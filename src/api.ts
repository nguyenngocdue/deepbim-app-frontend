import { toast } from "sonner";

// Interface định nghĩa response từ API xác thực (auth)
interface AuthResponse {
  access_token: string;          // JWT token dùng để truy cập các API bảo vệ
  refresh_token?: string;        // Token dùng để refresh access token khi hết hạn
  message?: string;              // Optional message từ backend (nếu có lỗi hoặc thông báo)
}

// Interface mô tả thông tin user nhận từ API
interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hàm wrapper để gọi fetch kèm Authorization token
 * Tự động refresh token và retry request khi access token hết hạn.
 *
 * @param url - Endpoint URL cần fetch
 * @param options - Request options (method, headers, body...)
 * @param retryCount - Số lần đã retry (chỉ retry tối đa 1 lần)
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<any> {
  // Lấy access_token từ localStorage
  const token = localStorage.getItem('access_token');
  // Thực hiện fetch request
  const response = await fetch(`${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }), // Thêm Authorization header nếu có token
      ...options.headers, // Ghi đè headers nếu có
    },
    credentials: 'include', // Gửi kèm cookie (nếu backend sử dụng cookie)
  });


  // Nếu access token hết hạn (Unauthorized) sẽ refresh token và retry request
  if (response.status === 401 && retryCount < 1) {
    try {
      await refreshAccessToken(); // Refresh access token mới
      return fetchWithAuth(url, options, retryCount + 1); // Retry lại request với token mới
    } catch (err) {
      // Nếu refresh token cũng thất bại, xóa hết token để đăng nhập lại
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      throw new Error('Session expired. Please log in again to fully experience all features.');
    }
  }
  // Nếu response trả về lỗi, parse lỗi và ném ra error rõ ràng
  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage = errorData.message || 'Failed to fetch data';
    throw new Error(errorMessage);
  }
  // Trả về dữ liệu JSON nếu thành công
  return response.json();
}

/**
 * Hàm refresh lại access token mới từ backend sử dụng refresh token
 * Token mới nhận được sẽ lưu vào localStorage để dùng tiếp cho các request kế tiếp
 */
async function refreshAccessToken(): Promise<void> {
  // Lấy refresh_token từ localStorage
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token found. Please log in again.');
  }

  // Gửi yêu cầu refresh token tới backend
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${refreshToken}`,
    },
    credentials: 'include',
  });

  // Kiểm tra response từ backend
  if (!response.ok) {
    throw new Error('Failed to refresh token. Please log in again.');
  }

  // Lấy access_token mới từ response
  const result: AuthResponse = await response.json();

  // Backend phải trả về access_token mới thì mới hợp lệ
  if (!result.access_token) {
    throw new Error(result.message || 'Failed to refresh token');
  }

  // Lưu access_token mới vào localStorage
  localStorage.setItem('access_token', result.access_token);

  // Cập nhật refresh_token mới nếu backend có trả về
  if (result.refresh_token) {
    localStorage.setItem('refresh_token', result.refresh_token);
  }
}

/**
 * Fetch thông tin người dùng hiện tại đang đăng nhập.
 * API này sẽ trả về thông tin cơ bản như userId.
 */
export async function fetchCurrentUser(): Promise<{ id: number }> {
  return fetchWithAuth2(`/auth/me`);
}

export async function fetchNoSignAPI<T>(url : string) :Promise<T>{
  const response = fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`);
  return  (await response).json()
}

/**
 * Fetch đầy đủ thông tin user profile dựa trên ID của user hiện tại.
 * Hàm này gọi 2 API: `/auth/me` để lấy ID, sau đó gọi `/users/:id` để lấy thông tin chi tiết.
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  const currentUser =  await fetchCurrentUser(); // lấy ID người dùng hiện tại
  const user =  await fetchWithAuth2(`/users/${currentUser?.data.id}`);
  return user;
}

export async function handleSignout(): Promise<void> {
  try {
    const accessToken = localStorage.getItem('access_token');
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken
          ? { Authorization: `Bearer ${accessToken}` } // Nếu có access_token → gửi
          : {}), // Nếu dùng cookie thì không cần
      },
      credentials: 'include', // ✅ Gửi cookie nếu có
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Signout failed');
    }

    // ✅ Dọn sạch localStorage dù có dùng hay không
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  } catch (error) {
    console.error('Signout error:', error);
    throw error;
  }
}


// utils/apiClient.ts

// Hàm tự động đính Bearer token, phân biệt FormData, và retry nếu 401
export async function fetchWithAuth2<T = any>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  if (!isFormData && !(headers as Record<string, string>)["Content-Type"]) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const url = new URL(`${baseUrl}${endpoint}`);

  const response = await fetch(url.toString(), {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && retryCount < 1) {
    try {
      await refreshAccessToken();
      return fetchWithAuth2(endpoint, options, retryCount + 1);
    } catch (err) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      throw new Error("Session expired. Please log in again to fully experience all features.");
    }
  }

  if (!response.ok) {
    let errorData: any = {};
    try {
      errorData = await response.clone().json();
    } catch {
      errorData = { message: await response.clone().text() };
    }
    errorData.status = response.status;
    throw errorData; // Ném ra object lỗi thay vì Error string
  }
  return await response.json();
}



// Hàm GET có đính kèm Authorization, tự build query, tự parse JSON
export async function apiGet<T>(
  endpoint: string,
  params?: Record<string, any>
): Promise<T> {
  try {
    // Biến endpoint thành URL, xử lý base URL nếu cần
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    const url = new URL(endpoint, baseUrl);

    // // Thêm query params nếu có
    // if (params) {
    //   Object.entries(params).forEach(([key, value]) => {
    //     if (value !== undefined && value !== null) {
    //       url.searchParams.append(key, String(value));
    //     }
    //   });
    // }

    const response = await fetchWithAuth2(endpoint.toString(), {
      method: 'GET',
    });

    return response;
  } catch (err: any) {
    // console.error('[apiGet error]', err);
    // throw new Error(err.message || 'Unknown error during GET request');
    toast.warning("", {
      description: "Please log in again to continue.",
      action: {
        label: "Sign In",
        onClick: () => window.location.href = '/sign-in',
      }
    })
  }
}




export async function apiRequest<T>(
  endpoint: string,
  method: "GET" | "PATCH" | "DELETE" = "GET",
  body?: any,
): Promise<T> {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetchWithAuth2(endpoint.toString(), options);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP error ${response.status}: ${errorText}`);
  }

  // ✅ Xử lý toast cho DELETE và PATCH
  if (method === "DELETE") {
    toast.success("Deleted successfully!");
  }
  if (method === "PATCH") {
    toast.success("Updated successfully!");
  }
  return response.json();
}


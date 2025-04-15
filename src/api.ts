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
      throw new Error('Session expired. Please log in again.');
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
  return fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
    method: 'GET',
  });
}

/**
 * Fetch đầy đủ thông tin user profile dựa trên ID của user hiện tại.
 * Hàm này gọi 2 API: `/auth/me` để lấy ID, sau đó gọi `/users/:id` để lấy thông tin chi tiết.
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  const currentUser = await fetchCurrentUser(); // lấy ID người dùng hiện tại
  return fetchWithAuth(`${import.meta.env.VITE_API_BASE_URL}/users/${currentUser.id}`, {
    method: 'GET',
  });
}

export async function handleSignout(): Promise<void> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
    });

    const result = await response.json();
    if (response.ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } else {
      throw new Error(result.message || 'Signout failed');
    }
  } catch (error) {
    console.error('Signout error:', error);
    throw error; // Ném lỗi để component có thể xử lý
  }
}

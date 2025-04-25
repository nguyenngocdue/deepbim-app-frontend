
export async function apiGet<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    // Nếu có params thì build query string
    const url = new URL(`${baseUrl}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });
    }
  
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          // Có thể thêm Authorization token ở đây nếu cần
        },
      });
  
      if (!response.ok) {
        // Xử lý lỗi HTTP
        const errorText = await response.text();
        throw new Error(`HTTP error ${response.status}: ${errorText}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      // Bắt lỗi mạng hoặc lỗi bất thường
      console.error('API GET error:', error);
      throw error;
    }
  }
  
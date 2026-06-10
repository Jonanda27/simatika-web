import { API_BASE_URL } from '../constants/config';

interface FetchOptions extends RequestInit {
  data?: any;
}

export const fetchClient = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('jwt_token');
  }
  
  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.data instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  if (options.data && !(options.data instanceof FormData)) {
    config.body = JSON.stringify(options.data);
  } else if (options.data instanceof FormData) {
    config.body = options.data;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 && typeof window !== 'undefined') {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
      throw new Error(data.message || 'Terjadi kesalahan pada server');
    }

    return data;
  } catch (error) {
    console.error(`API Error [${options.method || 'GET'} ${endpoint}]:`, error);
    throw error;
  }
};

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) => fetchClient<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, data?: any, options?: RequestInit) => fetchClient<T>(endpoint, { ...options, method: 'POST', data }),
  put: <T = any>(endpoint: string, data?: any, options?: RequestInit) => fetchClient<T>(endpoint, { ...options, method: 'PUT', data }),
  patch: <T = any>(endpoint: string, data?: any, options?: RequestInit) => fetchClient<T>(endpoint, { ...options, method: 'PATCH', data }),
  delete: <T = any>(endpoint: string, options?: RequestInit) => fetchClient<T>(endpoint, { ...options, method: 'DELETE' }),
};

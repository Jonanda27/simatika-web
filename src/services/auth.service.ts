import { ENDPOINTS } from '../constants/config';
import { LoginCredentials, LoginResponse } from '../types/auth';
import { api } from '../lib/api';

class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      return await api.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
    } catch (error: any) {
      console.error('AuthService login error:', error);
      throw error;
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwt_token');
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwt_token');
    }
    return null;
  }
}

export const authService = new AuthService();

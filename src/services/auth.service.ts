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

  async getMe(): Promise<{ success: boolean; user: any }> {
    try {
      return await api.get<{ success: boolean; user: any }>('/auth/me');
    } catch (error: any) {
      console.error('AuthService getMe error:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

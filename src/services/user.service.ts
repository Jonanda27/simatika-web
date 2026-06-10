import { ENDPOINTS } from '../constants/config';
import { api } from '../lib/api';

class UserService {
  async getAllUsers() {
    const response = await api.get(ENDPOINTS.USERS);
    return response.data;
  }

  async getUserById(id: string) {
    const response = await api.get(`${ENDPOINTS.USERS}/${id}`);
    return response.data;
  }

  async createUser(payload: any) {
    return api.post(ENDPOINTS.USERS, payload);
  }

  async updateUser(id: string, payload: any) {
    return api.put(`${ENDPOINTS.USERS}/${id}`, payload);
  }

  async deleteUser(id: string) {
    return api.delete(`${ENDPOINTS.USERS}/${id}`);
  }
}

export const userService = new UserService();


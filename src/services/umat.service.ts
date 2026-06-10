import { UmatSacrament, UmatMutation, UmatChurchActivity, UmatData, UmatPagination } from '../types/umat';
import { api } from '../lib/api';






class UmatService {
  async getAll(params: {
    page?: number;
    limit?: number;
    search?: string;
    jk?: string;
  }): Promise<{ success: boolean; data: UmatData[]; pagination: UmatPagination }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.jk) query.set('jk', params.jk);

    return api.get(`/umat?${query.toString()}`);
  }

  async getById(id: string): Promise<{ success: boolean; data: UmatData }> {
    return api.get(`/umat/${id}`);
  }
}

export const umatService = new UmatService();

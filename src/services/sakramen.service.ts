import { SakramenData, SakramenPagination, SakramenResponse } from '../types/sakramen';
import { api } from '../lib/api';




class SakramenService {
  async getAll(page = 1, limit = 10, search = '', jenis = ''): Promise<SakramenResponse> {
    const query = new URLSearchParams();
    if (page) query.set('page', String(page));
    if (limit) query.set('limit', String(limit));
    if (search) query.set('search', search);
    if (jenis) query.set('jenis', jenis);

    return api.get(`/sakramen?${query.toString()}`);
  }

  async getById(id: string): Promise<{ success: boolean; data: SakramenData }> {
    return api.get(`/sakramen/${id}`);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/sakramen/${id}`);
  }
}

export const sakramenService = new SakramenService();

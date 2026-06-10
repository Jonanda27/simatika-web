import { MutasiData, MutasiPagination, MutasiResponse } from '../types/mutasi';
import { api } from '../lib/api';




class MutasiService {
  async getAll(page = 1, limit = 10, search = '', jenis = ''): Promise<MutasiResponse> {
    const query = new URLSearchParams();
    if (page) query.set('page', String(page));
    if (limit) query.set('limit', String(limit));
    if (search) query.set('search', search);
    if (jenis) query.set('jenis', jenis);

    return api.get(`/mutasi?${query.toString()}`);
  }

  async getById(id: string): Promise<{ success: boolean; data: MutasiData }> {
    return api.get(`/mutasi/${id}`);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/mutasi/${id}`);
  }
}

export const mutasiService = new MutasiService();

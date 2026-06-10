import { KeluargaAnggota, KeluargaData, KeluargaPagination } from '../types/keluarga';
import { api } from '../lib/api';




class KeluargaService {
  async getAll(params: { page?: number; limit?: number; search?: string }): Promise<{
    success: boolean;
    data: KeluargaData[];
    pagination: KeluargaPagination;
  }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);

    return api.get(`/keluarga?${query.toString()}`);
  }

  async getById(id: string): Promise<{ success: boolean; data: KeluargaData }> {
    return api.get(`/keluarga/${id}`);
  }
}

export const keluargaService = new KeluargaService();

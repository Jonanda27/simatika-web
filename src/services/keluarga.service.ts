import { KeluargaAnggota, KeluargaData, KeluargaPagination } from '../types/keluarga';
import { api } from '../lib/api';




class KeluargaService {
  async getAll(params: { page?: number; limit?: number; search?: string; is_non_stasi?: boolean }): Promise<{
    success: boolean;
    data: KeluargaData[];
    pagination: KeluargaPagination;
  }> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.is_non_stasi) query.set('is_non_stasi', 'true');

    return api.get(`/keluarga?${query.toString()}`);
  }

  async getById(id: string): Promise<{ success: boolean; data: KeluargaData }> {
    return api.get(`/keluarga/${id}`);
  }

  async publicSearch(query: string): Promise<{ success: boolean; data: KeluargaData[] }> {
    return api.get(`/keluarga/public/search?q=${encodeURIComponent(query)}`);
  }

  async publicGetById(id: string): Promise<{ success: boolean; data: KeluargaData }> {
    return api.get(`/keluarga/public/${id}`);
  }
}

export const keluargaService = new KeluargaService();

import { AktivitasData, AktivitasPagination, AktivitasResponse } from '../types/aktivitas';
import { api } from '../lib/api';




class AktivitasService {
  async getAll(page = 1, limit = 10, search = '', frekuensi = ''): Promise<AktivitasResponse> {
    const query = new URLSearchParams();
    if (page) query.set('page', String(page));
    if (limit) query.set('limit', String(limit));
    if (search) query.set('search', search);
    if (frekuensi) query.set('frekuensi', frekuensi);

    return api.get(`/aktivitas?${query.toString()}`);
  }

  async getById(id: string): Promise<{ success: boolean; data: AktivitasData }> {
    return api.get(`/aktivitas/${id}`);
  }

  async delete(id: string): Promise<{ success: boolean; message: string }> {
    return api.delete(`/aktivitas/${id}`);
  }
}

export const aktivitasService = new AktivitasService();

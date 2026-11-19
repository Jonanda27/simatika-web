import { api } from '@/lib/api';

export interface KbgData {
  id: string;
  nama_kbg: string;
  kode_kbg: string;
  stasi_id: string | null;
  ketua_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  Pengurus?: Array<{
    id: string;
    nama_manual: string | null;
    Umat?: {
      nama_lengkap: string;
    } | null;
  }>;
}

export const kbgService = {
  getAll: async (params?: { stasi_id?: string; no_stasi?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.stasi_id) query.set('stasi_id', params.stasi_id);
    if (params?.no_stasi) query.set('no_stasi', 'true');
    
    const queryString = query.toString();
    const url = queryString ? `/kbgs?${queryString}` : '/kbgs';
    
    return api.get<{ success: boolean; data: KbgData[] }>(url);
  },

  updateLocation: async (id: string, data: { latitude: number; longitude: number }) => {
    return api.put<{ success: boolean; data: KbgData }>(`/kbgs/${id}/location`, data);
  },

  create: async (data: Partial<KbgData>) => {
    return api.post<{ success: boolean; data: KbgData; message: string }>('/kbgs', data);
  },

  update: async (id: string, data: Partial<KbgData>) => {
    return api.put<{ success: boolean; data: KbgData; message: string }>(`/kbgs/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/kbgs/${id}`);
  }
};

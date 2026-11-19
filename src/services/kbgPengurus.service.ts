import { api } from '@/lib/api';

export interface KbgPengurusData {
  id: string;
  kbg_id: string;
  umat_id: string;
  nama_manual?: string;
  jabatan: string;
  periode_mulai: string;
  periode_selesai: string;
  nomor_telepon?: string;
  sk_url?: string;
  is_active: boolean;
  Umat?: {
    id: string;
    nama_lengkap: string;
    nomor_induk_umat: string;
    jenis_kelamin: string;
  };
}

export const kbgPengurusService = {
  getByKbgId: async (kbgId: string) => {
    return api.get<{ success: boolean; data: KbgPengurusData[] }>(`/kbg-pengurus/${kbgId}`);
  },

  create: async (data: Partial<KbgPengurusData>) => {
    return api.post<{ success: boolean; message: string; data: KbgPengurusData }>('/kbg-pengurus', data);
  },

  update: async (id: string, data: Partial<KbgPengurusData>) => {
    return api.put<{ success: boolean; message: string; data: KbgPengurusData }>(`/kbg-pengurus/${id}`, data);
  },

  delete: async (id: string) => {
    return api.delete<{ success: boolean; message: string }>(`/kbg-pengurus/${id}`);
  }
};

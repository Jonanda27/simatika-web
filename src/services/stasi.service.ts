import { api } from '@/lib/api';

export interface StasiData {
    id: string;
    nama_stasi: string;
    kode_stasi: string;
    latitude: number | null;
    longitude: number | null;
}

export const stasiService = {
    getAll: async () => {
        return api.get<{ success: boolean; data: StasiData[] }>('/stasi');
    },
    create: async (data: Partial<StasiData>) => {
        return api.post<{ success: boolean; data: StasiData; message: string }>('/stasi', data);
    },
    update: async (id: string, data: Partial<StasiData>) => {
        return api.put<{ success: boolean; data: StasiData; message: string }>(`/stasi/${id}`, data);
    },
    delete: async (id: string) => {
        return api.delete<{ success: boolean; message: string }>(`/stasi/${id}`);
    }
};

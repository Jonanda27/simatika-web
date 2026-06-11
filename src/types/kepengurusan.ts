export interface PengurusItem {
  jabatan: string;
  nama: string;
  telepon: string;
}

export interface KepengurusanPayload {
  kbg_id: string | null;
  periode_mulai: string;
  periode_selesai: string;
  pengurus: PengurusItem[];
}

export interface SyncKepengurusanResponse {
  success: boolean;
  message: string;
  queueId: string;
}

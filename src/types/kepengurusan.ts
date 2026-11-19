export interface PengurusItem {
  umat_id?: string; // Menyimpan ID Umat jika dipilih dari database
  jabatan: string;
  nama: string;
  telepon: string;
}

export interface KepengurusanPayload {
  kbg_id: string | null;
  periode_mulai: string;
  periode_selesai: string;
  type?: string;
  pengurus: PengurusItem[];
}

export interface SyncKepengurusanResponse {
  success: boolean;
  message: string;
  queueId: string;
}

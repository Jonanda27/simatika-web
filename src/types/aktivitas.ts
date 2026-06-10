export interface AktivitasData {
  id: string;
  umat_id: string;
  frekuensi_misa: 'Mingguan' | 'Harian' | 'Hari Raya';
  keaktifan_organisasi?: string;
  petugas_liturgi?: string;
  riwayat_kursus?: any;
  Umat?: {
    id: string;
    nama_lengkap: string;
    jenis_kelamin: string;
    pekerjaan?: string;
    Family?: {
      no_kk_paroki: string;
    };
  };
}

export interface AktivitasPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface AktivitasResponse {
  success: boolean;
  data: AktivitasData[];
  pagination: AktivitasPagination;
}

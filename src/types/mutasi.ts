export interface MutasiData {
  id: string;
  umat_id: string;
  jenis_mutasi: 'Pindah Basis' | 'Pindah Stasi' | 'Pindah Paroki' | 'Pindah Dekenat' | 'Pindah Keuskupan' | 'Meninggal';
  tanggal_kejadian: string;
  tempat_kematian?: string;
  keterangan?: string;
  Umat?: {
    id: string;
    nama_lengkap: string;
    tempat_lahir?: string;
    tanggal_lahir?: string;
    Family?: {
      no_kk_paroki: string;
    };
  };
}

export interface MutasiPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface MutasiResponse {
  success: boolean;
  data: MutasiData[];
  pagination: MutasiPagination;
}

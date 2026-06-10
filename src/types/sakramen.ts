export interface SakramenData {
  id: string;
  umat_id: string;
  jenis_sakramen: 'Baptis' | 'Komuni Pertama' | 'Krisma' | 'Perkawinan' | 'Imamat/Kaul Kekal' | 'Minyak Suci';
  nomor_surat: string;
  tanggal_penerimaan: string;
  tempat_pelaksanaan: string;
  nama_pastor: string;
  nama_wali_saksi: string;
  metadata?: any;
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

export interface SakramenPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface SakramenResponse {
  success: boolean;
  data: SakramenData[];
  pagination: SakramenPagination;
}

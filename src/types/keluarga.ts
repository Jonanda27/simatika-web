// src/types/keluarga.ts
export interface KeluargaAnggota {
  id: string;
  nomor_induk_umat?: string | null;
  nama_lengkap: string;
  fam: string | null;
  status_dalam_keluarga: string | null;
  jenis_kelamin: 'L' | 'P' | null;
  tanggal_lahir: string | null;
  pekerjaan: string | null;
  pendidikan_terakhir?: string | null;
  suku?: string | null;
  status_kesehatan?: string | null;
  Sacraments?: any[]; // PERBAIKAN: Menambahkan dukungan array Sakramen untuk GIS
}

export interface KeluargaData {
  id: string;
  kode_unik_keluarga?: string | null;
  no_kk_paroki: string | null;
  kk_url?: string | null;
  status_rumah: string | null;
  fasilitas_kamar_mandi: boolean;
  fasilitas_kamar_cuci: boolean;
  fasilitas_wc: boolean;
  pendapatan_per_bulan: number | null;
  asuransi_kesehatan: string | null;
  foto_rumah_url: string | null;
  latitude: number | null;
  longitude: number | null;
  is_non_stasi?: boolean;
  kbg_id?: string | null;
  Kbg?: { id: string; nama_kbg: string; stasi_id?: string | null } | null;
  Umats?: KeluargaAnggota[];
  createdAt?: string;
}

export interface KeluargaPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
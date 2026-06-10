export interface UmatSacrament {
  id: string;
  jenis_sakramen: string;
  nomor_surat: string | null;
  tanggal_penerimaan: string | null;
  tempat_pelaksanaan: string | null;
  nama_pastor: string | null;
  nama_wali_saksi: string | null;
}

export interface UmatMutation {
  id: string;
  jenis_mutasi: string;
  tanggal_kejadian: string | null;
  tempat_kematian: string | null;
  keterangan: string | null;
}

export interface UmatChurchActivity {
  frekuensi_misa: string | null;
  keaktifan: string | null;
  petugas_liturgi: string | null;
  riwayat_kursus: string | null;
}

export interface UmatData {
  id: string;
  nama_lengkap: string;
  fam: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: 'L' | 'P' | null;
  status_dalam_keluarga: string | null;
  pekerjaan: string | null;
  suku: string | null;
  pendidikan_terakhir: string | null;
  status_kesehatan: string | null;
  kode_numpang: string | null;
  Family?: {
    id: string;
    no_kk_paroki: string | null;
    status_rumah: string | null;
    pendapatan_per_bulan: number | null;
    asuransi_kesehatan?: string | null;
    fasilitas_kamar_mandi?: boolean;
    fasilitas_kamar_cuci?: boolean;
    fasilitas_wc?: boolean;
    foto_rumah_url?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    Kbg?: {
      id: string;
      nama_kbg: string;
    } | null;
  } | null;
  Sacraments?: UmatSacrament[];
  Mutations?: UmatMutation[];
  ChurchActivity?: UmatChurchActivity | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface UmatPagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

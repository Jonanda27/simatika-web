export interface FamilyMember {
  id?: string;
  nama_lengkap: string;
  nik?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  jenis_kelamin: string;
  status_keluarga: string;
  status_perkawinan?: string;
  pendidikan_terakhir?: string;
  pekerjaan?: string;
  suku?: string;
  golongan_darah?: string;
  status_kesehatan?: string;
  telepon?: string;
  email?: string;
  // Keaktifan
  keterlibatan_kbg?: string;
  peran_paroki?: string;
  // Sakramen
  has_baptis?: boolean;
  tanggal_baptis?: string;
  paroki_baptis?: string;
  has_komuni?: boolean;
  tanggal_komuni?: string;
  paroki_komuni?: string;
  has_krisma?: boolean;
  tanggal_krisma?: string;
  paroki_krisma?: string;
  has_perkawinan?: boolean;
  tanggal_perkawinan?: string;
  paroki_perkawinan?: string;
  has_imamat?: boolean;
  tanggal_imamat?: string;
  paroki_imamat?: string;
  has_minyak_suci?: boolean;
  tanggal_minyak_suci?: string;
  paroki_minyak_suci?: string;
  // UI State
  isLocalNew?: boolean;
}

export interface FamilyFormData {
  no_kk_paroki: string;
  status_numpang: string;
  lat: number | null;
  lng: number | null;
  foto_rumah_path: string | null;
  foto_rumah_file?: File | null;
  foto_rumah_url?: string | null;
  fasilitas_kamar_mandi: boolean;
  fasilitas_kamar_cuci: boolean;
  fasilitas_wc: boolean;
  status_rumah: string;
  pendapatan_per_bulan: string;
  asuransi_kesehatan: string;
  members: FamilyMember[];
}

import { KeluargaAnggota } from "@/types/keluarga";
import { differenceInYears } from "date-fns";

export const getAge = (tglLahir: string | null) => {
  if (!tglLahir) return "-";
  return `${differenceInYears(new Date(), new Date(tglLahir))} thn`;
};

export const getKepalaKeluarga = (umats?: KeluargaAnggota[]) =>
  umats?.find(u => u.status_dalam_keluarga === 'KK')?.nama_lengkap || umats?.[0]?.nama_lengkap || '-';

export const statusRumahColor: Record<string, string> = {
  Milik: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Kontrak: 'bg-amber-50 text-amber-700 border-amber-200',
  Dinas: 'bg-brown-50 text-brown-700 border-brown-200',
  Numpang: 'bg-slate-100 text-slate-600 border-slate-300',
};

import { UmatData } from "@/types/umat";
import { differenceInYears } from "date-fns";

export const getStatusInfo = (umat: UmatData) => {
  const mutation = umat.Mutations?.[0];
  if (!mutation) return { label: "Aktif", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (mutation.jenis_mutasi === "Meninggal") return { label: "Meninggal", color: "text-rose-700 bg-rose-50 border-rose-200" };
  if (mutation.jenis_mutasi === "Pindah Keluar") return { label: "Pindah", color: "text-amber-700 bg-amber-50 border-amber-200" };
  if (mutation.jenis_mutasi === "Mutasi Masuk") return { label: "Mutasi Masuk", color: "text-brown-700 bg-brown-50 border-brown-200" };
  return { label: "Aktif", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
};

export const getAge = (tglLahir: string | null) => {
  if (!tglLahir) return "-";
  return `${differenceInYears(new Date(), new Date(tglLahir))} thn`;
};

export const sacramentsColorMap: Record<string, string> = {
  "Baptis": "bg-brown-100 text-brown-800 border-brown-200",
  "Komuni Pertama": "bg-purple-100 text-purple-800 border-purple-200",
  "Krisma": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Perkawinan": "bg-amber-100 text-amber-800 border-amber-200",
  "Imamat/Kaul Kekal": "bg-indigo-100 text-indigo-800 border-indigo-200",
};

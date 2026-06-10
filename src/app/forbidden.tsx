import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function Forbidden() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <div className="flex items-center justify-center h-24 w-24 rounded-full bg-destructive/10 mb-6">
        <ShieldAlert className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
        Akses Ditolak (403)
      </h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        Maaf, Anda tidak memiliki izin (hak akses) untuk membuka halaman ini. 
        Halaman ini mungkin diperuntukkan bagi level Admin yang berbeda.
      </p>
      <div className="flex gap-4">
        <Link href="/(auth)/login" className={buttonVariants({ variant: "outline" })}>
          Ganti Akun
        </Link>
        <Link href="/" className={buttonVariants()}>
          Kembali ke Dasbor
        </Link>
      </div>
    </div>
  );
}

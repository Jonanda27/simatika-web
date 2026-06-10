import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-slate-200 dark:text-slate-800 tracking-widest">
        404
      </h1>
      <div className="absolute">
        <h2 className="bg-destructive px-2 text-sm rounded text-white shadow-sm">
          Halaman Tidak Ditemukan
        </h2>
      </div>
      <p className="mt-8 text-slate-600 dark:text-slate-400 max-w-md">
        Maaf, rute atau halaman yang Anda tuju tidak tersedia. Mungkin halaman telah dihapus atau Anda salah mengetikkan URL.
      </p>
      <Link href="/" className={buttonVariants({ className: "mt-8" })}>
        Kembali ke Dasbor
      </Link>
    </div>
  );
}

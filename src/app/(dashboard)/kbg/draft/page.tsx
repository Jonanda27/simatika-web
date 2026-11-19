"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileEdit, Trash2, ClipboardList, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDrafts } from "@/hooks/useDrafts";

interface DraftItem {
  id: string;
  createdAt: string;
  data: any;
}

export default function DraftPage() {
  const { drafts, deleteDraft } = useDrafts();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus draft ini?")) {
      deleteDraft(id);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-transparent min-h-full">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-brown-50 text-brown-600 border border-brown-100 rounded-none">
          <ClipboardList className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Data Draft
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Data keluarga hasil impor yang belum dilengkapi foto atau koordinat lokasi.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-slate-200/80 rounded-none overflow-hidden">
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-20 text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-none border border-slate-100 flex items-center justify-center mb-5">
              <ClipboardList className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-600 mb-2">Belum ada draft tersimpan</h3>
            <p className="text-sm font-medium">Silakan lakukan Proses Impor Data terlebih dahulu untuk mulai mengisi draft.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 text-sm text-slate-600">
                  <th className="p-5 font-bold">Nomor KK</th>
                  <th className="p-5 font-bold">Kepala Keluarga</th>
                  <th className="p-5 font-bold">Jml Anggota</th>
                  <th className="p-5 font-bold">Waktu Impor</th>
                  <th className="p-5 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {drafts.map((draft) => {
                  const kepalaKeluarga = draft.data?.members?.find((a: any) => a.status_keluarga === "Kepala Keluarga")?.nama_lengkap 
                    || draft.data?.members?.[0]?.nama_lengkap 
                    || "Tanpa Nama";
                    
                  const dateStr = new Date(draft.createdAt).toLocaleString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                  });

                  return (
                    <tr key={draft.id} className="hover:bg-brown-50/30 transition-colors group">
                      <td className="p-5 text-slate-800 font-bold">{draft.data.no_kk_paroki || "-"}</td>
                      <td className="p-5 font-bold text-slate-700">{kepalaKeluarga}</td>
                      <td className="p-5 text-slate-600">
                        <span className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-none border border-blue-200 font-bold text-xs">
                          <Users className="w-3.5 h-3.5 mr-1.5" />
                          {draft.data.members?.length || 0} Orang
                        </span>
                      </td>
                      <td className="p-5 text-slate-500 font-medium">{dateStr}</td>
                      <td className="p-5">
                        <div className="flex justify-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="rounded-none text-slate-500 border-slate-200 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors"
                            onClick={() => handleDelete(draft.id)}
                            title="Hapus Draft"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Link href={`/kbg/pendataan?draftId=${draft.id}`}>
                            <Button 
                              size="sm" 
                              className="rounded-none bg-brown-600 hover:bg-brown-700 text-white font-bold transition-all px-4"
                            >
                              <FileEdit className="h-4 w-4 mr-2" />
                              Lengkapi Data
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="p-4 bg-transparent border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Menampilkan {drafts.length} data draft</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


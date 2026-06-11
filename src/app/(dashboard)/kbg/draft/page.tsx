"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileEdit, Trash2, ClipboardList } from "lucide-react";
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
    <div className="p-4 sm:p-8 space-y-8 bg-slate-50 min-h-full">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
          Draft Lokal
        </h1>
        <p className="text-slate-500 mt-1">
          Data keluarga hasil impor yang belum dilengkapi foto atau lokasi.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-16 text-slate-400">
            <ClipboardList className="h-16 w-16 mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-slate-600 mb-1">Belum ada draft</h3>
            <p className="text-sm">Silakan lakukan Import Data terlebih dahulu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-sm text-slate-500">
                  <th className="p-4 font-semibold">Nomor KK</th>
                  <th className="p-4 font-semibold">Kepala Keluarga</th>
                  <th className="p-4 font-semibold">Jml Anggota</th>
                  <th className="p-4 font-semibold">Waktu Impor</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {drafts.map((draft) => {
                  const kepalaKeluarga = draft.data?.members?.find((a: any) => a.status_keluarga === "Kepala Keluarga")?.nama_lengkap 
                    || draft.data?.members?.[0]?.nama_lengkap 
                    || "-";
                    
                  const dateStr = new Date(draft.createdAt).toLocaleString("id-ID", {
                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                  });

                  return (
                    <tr key={draft.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 text-slate-800 font-bold">{draft.data.no_kk_paroki || "-"}</td>
                      <td className="p-4 text-slate-600">{kepalaKeluarga}</td>
                      <td className="p-4 text-slate-600">
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-semibold">
                          {draft.data.members?.length || 0} Orang
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{dateStr}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-slate-500 hover:text-red-600 hover:bg-red-50 border-slate-200"
                            onClick={() => handleDelete(draft.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Link href={`/kbg/pendataan?draftId=${draft.id}`}>
                            <Button 
                              size="sm" 
                              className="bg-brown-600 hover:bg-brown-700 text-white font-semibold"
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
          </div>
        )}
      </div>
    </div>
  );
}

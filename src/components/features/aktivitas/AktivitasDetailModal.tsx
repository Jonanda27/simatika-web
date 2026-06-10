"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, Church, Users, BookOpen } from "lucide-react";
import { AktivitasData } from "@/types/aktivitas";
import { frekuensiColorMap } from "./utils";

export function AktivitasDetailModal({ aktivitas, open, onClose }: { aktivitas: AktivitasData | null; open: boolean; onClose: () => void }) {
  if (!aktivitas) return null;

  let riwayatKursusStr = '';
  if (aktivitas.riwayat_kursus) {
    if (typeof aktivitas.riwayat_kursus === 'string') {
      riwayatKursusStr = aktivitas.riwayat_kursus;
    } else {
      riwayatKursusStr = JSON.stringify(aktivitas.riwayat_kursus, null, 2);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-[95vw] p-0 flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-emerald-50/50 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-lg text-emerald-700 shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Detail Aktivitas Pastoral</h2>
            <p className="text-sm text-slate-500 mt-0.5">Keterlibatan liturgi dan organisasi</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nama Umat</p>
              <h3 className="font-bold text-slate-900 text-base capitalize lowercase">{aktivitas.Umat?.nama_lengkap || '-'}</h3>
            </div>
            <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold ${frekuensiColorMap[aktivitas.frekuensi_misa] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
              Misa {aktivitas.frekuensi_misa}
            </Badge>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
            
            <div className="flex items-start gap-3">
              <Church className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Tugas Liturgi</p>
                <p className="text-sm font-semibold text-slate-900">{aktivitas.petugas_liturgi || 'Tidak ada'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Keaktifan Organisasi</p>
                <p className="text-sm font-semibold text-slate-900">{aktivitas.keaktifan_organisasi || 'Tidak ada'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <BookOpen className="w-4 h-4 text-slate-400 mt-0.5" />
              <div className="w-full">
                <p className="text-xs text-slate-500 mb-0.5">Riwayat Kursus / Pelatihan</p>
                {riwayatKursusStr ? (
                  <div className="mt-1 bg-white border border-slate-200 rounded-lg p-2.5 max-h-32 overflow-y-auto">
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
                      {riwayatKursusStr}
                    </pre>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-slate-900">Belum ada</p>
                )}
              </div>
            </div>
            
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <Button onClick={onClose} variant="outline" className="rounded-lg">Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, UserX, MapPin } from "lucide-react";
import { MutasiData } from "@/types/mutasi";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { mutasiColorMap } from "./utils";

export function MutasiDetailModal({ mutasi, open, onClose }: { mutasi: MutasiData | null; open: boolean; onClose: () => void }) {
  if (!mutasi) return null;

  const isDeath = mutasi.jenis_mutasi === "Meninggal";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-[95vw] p-0 flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        
        {/* Header */}
        <div className={`p-6 border-b border-slate-200 flex items-start gap-4 ${isDeath ? 'bg-slate-100' : 'bg-brown-50/50'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${isDeath ? 'bg-slate-300 text-slate-700' : 'bg-brown-100 text-brown-700'}`}>
            {isDeath ? <UserX className="w-6 h-6" /> : <ArrowRightLeft className="w-6 h-6" />}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Detail Mutasi</h2>
            <p className="text-sm text-slate-500 mt-0.5">Catatan perpindahan atau kematian umat</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nama Umat</p>
              <h3 className="font-bold text-slate-900 text-base capitalize lowercase">{mutasi.Umat?.nama_lengkap || '-'}</h3>
            </div>
            <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold ${mutasiColorMap[mutasi.jenis_mutasi] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
              {mutasi.jenis_mutasi}
            </Badge>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Tanggal {isDeath ? 'Kematian' : 'Pindah'}</p>
                <p className="text-sm font-semibold text-slate-900">
                  {mutasi.tanggal_kejadian ? format(new Date(mutasi.tanggal_kejadian), 'dd MMMM yyyy', { locale: localeId }) : '-'}
                </p>
              </div>
            </div>

            {isDeath && (
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Tempat Kematian / Pemakaman</p>
                  <p className="text-sm font-semibold text-slate-900">{mutasi.tempat_kematian || '-'}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <ArrowRightLeft className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Keterangan / Alasan</p>
                <p className="text-sm font-semibold text-slate-900">{mutasi.keterangan || '-'}</p>
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
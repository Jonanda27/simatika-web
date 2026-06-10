"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, MapPin, User } from "lucide-react";
import { SakramenData } from "@/types/sakramen";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { sacramentsColorMap } from "./utils";

export function SakramenDetailModal({ sakramen, open, onClose }: { sakramen: SakramenData | null; open: boolean; onClose: () => void }) {
  if (!sakramen) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl w-[95vw] p-0 flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Detail Sakramen</h2>
            <p className="text-sm text-slate-500 mt-0.5">Sertifikat dan pencatatan sakramen</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nama Umat</p>
              <h3 className="font-bold text-slate-900 text-base capitalize lowercase">{sakramen.Umat?.nama_lengkap || '-'}</h3>
            </div>
            <Badge variant="outline" className={`px-3 py-1 text-xs font-semibold ${sacramentsColorMap[sakramen.jenis_sakramen] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
              {sakramen.jenis_sakramen}
            </Badge>
          </div>

          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Nomor Surat / Sertifikat</p>
                <p className="text-sm font-semibold text-slate-900 font-mono">{sakramen.nomor_surat || '-'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Tanggal Penerimaan</p>
                <p className="text-sm font-semibold text-slate-900">
                  {sakramen.tanggal_penerimaan ? format(new Date(sakramen.tanggal_penerimaan), 'dd MMMM yyyy', { locale: localeId }) : '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Tempat Pelaksanaan</p>
                <p className="text-sm font-semibold text-slate-900">{sakramen.tempat_pelaksanaan || '-'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 mb-0.5">Nama Pastor (Pelayan)</p>
                <p className="text-sm font-semibold text-slate-900">{sakramen.nama_pastor || '-'}</p>
              </div>
            </div>
            
            {(sakramen.jenis_sakramen === 'Baptis' || sakramen.jenis_sakramen === 'Krisma') && (
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Wali {sakramen.jenis_sakramen}</p>
                  <p className="text-sm font-semibold text-slate-900">{sakramen.nama_wali_saksi || '-'}</p>
                </div>
              </div>
            )}
            
            {sakramen.jenis_sakramen === 'Perkawinan' && (
              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Saksi Perkawinan</p>
                  <p className="text-sm font-semibold text-slate-900">{sakramen.nama_wali_saksi || '-'}</p>
                </div>
              </div>
            )}
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
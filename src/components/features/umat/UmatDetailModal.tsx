"use client";

import { useState, useEffect } from "react";
import { User, Home, BookOpen, Activity, AlertCircle, Phone, MapPin, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UmatData } from "@/types/umat";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { getStatusInfo, getAge, sacramentsColorMap } from "./utils";

// ================== DETAIL MODAL ==================
export function UmatDetailModal({ umat, open, onClose }: { umat: UmatData | null; open: boolean; onClose: () => void }) {
  const [activeSection, setActiveSection] = useState<'profil' | 'keluarga' | 'sakramen' | 'aktivitas'>('profil');

  useEffect(() => {
    if (open) setActiveSection('profil');
  }, [open]);

  if (!umat) return null;

  const status = getStatusInfo(umat);
  const age = getAge(umat.tanggal_lahir);
  const sacraments = umat.Sacraments || [];

  const navItems = [
    { id: 'profil', label: 'Profil', icon: User },
    { id: 'keluarga', label: 'Keluarga', icon: Home },
    { id: 'sakramen', label: `Sakramen (${sacraments.length})`, icon: BookOpen },
    { id: 'aktivitas', label: 'Aktivitas', icon: Activity },
  ] as const;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl w-[97vw] h-[90vh] sm:h-[80vh] p-0 flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        <div className="flex flex-col sm:flex-row h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-full sm:w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
            {/* Profile Card */}
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center text-brown-700 font-bold text-lg shrink-0">
                  {umat.nama_lengkap?.charAt(0) || 'U'}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-900 leading-tight truncate">{umat.nama_lengkap}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{umat.fam || '-'} · {age}</p>
                </div>
              </div>
              <Badge variant="outline" className={`text-xs ${status.color}`}>{status.label}</Badge>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-brown-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Close button on mobile */}
            <div className="p-3 border-t border-slate-200">
              <button onClick={onClose} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors">
                <X className="w-4 h-4" /> Tutup
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

            {/* PROFIL */}
            {activeSection === 'profil' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Data Pribadi</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Informasi kependudukan umat.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {[
                        ['Nama Lengkap', umat.nama_lengkap || '-'],
                        ['Nama FAM', umat.fam || '-'],
                        ['Jenis Kelamin', umat.jenis_kelamin === 'L' ? 'Laki-laki' : umat.jenis_kelamin === 'P' ? 'Perempuan' : '-'],
                        ['Tempat Lahir', umat.tempat_lahir || '-'],
                        ['Tanggal Lahir', umat.tanggal_lahir ? format(new Date(umat.tanggal_lahir), 'dd MMMM yyyy', { locale: localeId }) : '-'],
                        ['Umur', age],
                        ['Status Keluarga', umat.status_dalam_keluarga || '-'],
                        ['Pekerjaan', umat.pekerjaan || 'Tidak bekerja'],
                        ['Pendidikan Terakhir', umat.pendidikan_terakhir || '-'],
                        ['Suku', umat.suku || '-'],
                        ['Status Kesehatan', umat.status_kesehatan || 'Normal'],
                        ['Kode Numpang', umat.kode_numpang || '-'],
                      ].map(([label, value]) => (
                        <tr key={label} className="hover:bg-slate-50/50">
                          <th className="px-5 py-3 text-left font-semibold text-slate-600 w-2/5 bg-slate-50/30 text-xs uppercase tracking-wider">{label}</th>
                          <td className="px-5 py-3 text-slate-900 font-medium">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* KELUARGA */}
            {activeSection === 'keluarga' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Data Keluarga</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Informasi rumah tangga dan KBG.</p>
                </div>

                {umat.Family ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">KBG / Lingkungan</div>
                        <div className="font-bold text-slate-800">{umat.Family.Kbg?.nama_kbg || '-'}</div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">No. KK Paroki</div>
                        <div className="font-bold text-slate-800 font-mono text-sm">{umat.Family.no_kk_paroki || '-'}</div>
                      </div>
                      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Status Rumah</div>
                        <div className="font-bold text-slate-800">{umat.Family.status_rumah || '-'}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 w-2/5 bg-slate-50/30 text-xs uppercase tracking-wider">Pendapatan/Bulan</th>
                            <td className="px-5 py-3 text-emerald-700 font-bold">
                              {umat.Family.pendapatan_per_bulan
                                ? `Rp ${Number(umat.Family.pendapatan_per_bulan).toLocaleString('id-ID')}`
                                : '-'}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 bg-slate-50/30 text-xs uppercase tracking-wider">Asuransi Kesehatan</th>
                            <td className="px-5 py-3 text-slate-900">{umat.Family.asuransi_kesehatan || '-'}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 bg-slate-50/30 text-xs uppercase tracking-wider align-top">Fasilitas MCK</th>
                            <td className="px-5 py-3">
                              <div className="flex gap-2 flex-wrap">
                                {umat.Family.fasilitas_kamar_mandi && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700 text-xs">Kamar Mandi</Badge>}
                                {umat.Family.fasilitas_kamar_cuci && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700 text-xs">Tempat Cuci</Badge>}
                                {umat.Family.fasilitas_wc && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700 text-xs">WC / Toilet</Badge>}
                                {!umat.Family.fasilitas_kamar_mandi && !umat.Family.fasilitas_kamar_cuci && !umat.Family.fasilitas_wc && (
                                  <span className="text-slate-400 italic text-sm">Tidak ada fasilitas</span>
                                )}
                              </div>
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 bg-slate-50/30 text-xs uppercase tracking-wider">Lokasi GPS</th>
                            <td className="px-5 py-3 font-mono text-xs text-slate-700">
                              {umat.Family.latitude && umat.Family.longitude
                                ? `${umat.Family.latitude}, ${umat.Family.longitude}`
                                : '-'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {umat.Family.foto_rumah_url && (
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                        <img src={umat.Family.foto_rumah_url} alt="Foto Rumah" className="w-full max-h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                          <p className="text-white text-xs">Foto Rumah Keluarga</p>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Home className="w-16 h-16 opacity-20 mb-4" />
                    <p className="font-medium text-slate-500">Data keluarga belum tersedia</p>
                  </div>
                )}
              </div>
            )}

            {/* SAKRAMEN */}
            {activeSection === 'sakramen' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Data Sakramen</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Riwayat penerimaan sakramen.</p>
                </div>

                {sacraments.length > 0 ? (
                  <div className="space-y-3">
                    {sacraments.map((s) => (
                      <div key={s.id} className={`p-4 rounded-xl border ${sacramentsColorMap[s.jenis_sakramen] || 'bg-slate-50 border-slate-200'} bg-opacity-30`}>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-sm">{s.jenis_sakramen}</h4>
                          {s.nomor_surat && <span className="font-mono text-xs bg-white/80 px-2 py-0.5 rounded border border-current/20">No. {s.nomor_surat}</span>}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500 block mb-0.5">Tanggal</span>
                            <span className="font-medium text-slate-800">
                              {s.tanggal_penerimaan ? format(new Date(s.tanggal_penerimaan), 'dd MMM yyyy', { locale: localeId }) : '-'}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">Tempat / Gereja</span>
                            <span className="font-medium text-slate-800">{s.tempat_pelaksanaan || '-'}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block mb-0.5">Pastor</span>
                            <span className="font-medium text-slate-800">{s.nama_pastor || '-'}</span>
                          </div>
                          {s.nama_wali_saksi && (
                            <div className="col-span-2 sm:col-span-3">
                              <span className="text-slate-500 block mb-0.5">Wali / Saksi</span>
                              <span className="font-medium text-slate-800">{s.nama_wali_saksi}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <BookOpen className="w-16 h-16 opacity-20 mb-4" />
                    <p className="font-medium text-slate-500">Belum ada data sakramen tercatat</p>
                  </div>
                )}
              </div>
            )}

            {/* AKTIVITAS */}
            {activeSection === 'aktivitas' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Aktivitas Gereja</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Keterlibatan dalam kegiatan paroki.</p>
                </div>

                {umat.ChurchActivity ? (
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <tbody className="divide-y divide-slate-100">
                        {[
                          ['Frekuensi Misa', umat.ChurchActivity.frekuensi_misa || '-'],
                          ['Keaktifan', umat.ChurchActivity.keaktifan || '-'],
                          ['Petugas Liturgi', umat.ChurchActivity.petugas_liturgi || '-'],
                          ['Riwayat Kursus', umat.ChurchActivity.riwayat_kursus || '-'],
                        ].map(([label, value]) => (
                          <tr key={label} className="hover:bg-slate-50/50">
                            <th className="px-5 py-3 text-left font-semibold text-slate-600 w-2/5 bg-slate-50/30 text-xs uppercase tracking-wider">{label}</th>
                            <td className="px-5 py-3 text-slate-900 font-medium">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Activity className="w-16 h-16 opacity-20 mb-4" />
                    <p className="font-medium text-slate-500">Data aktivitas belum tersedia</p>
                  </div>
                )}

                {/* Riwayat Mutasi */}
                {umat.Mutations && umat.Mutations.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-500" /> Riwayat Mutasi
                    </h4>
                    {umat.Mutations?.map(m => (
                      <div key={m.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm">
                        <div className="flex justify-between items-start">
                          <span className="font-bold text-amber-800">{m.jenis_mutasi}</span>
                          <span className="text-xs text-amber-600">
                            {m.tanggal_kejadian ? format(new Date(m.tanggal_kejadian), 'dd MMM yyyy', { locale: localeId }) : '-'}
                          </span>
                        </div>
                        {(m.tempat_kematian || m.keterangan) && (
                          <p className="text-amber-700 mt-1 text-xs">{m.tempat_kematian || m.keterangan}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

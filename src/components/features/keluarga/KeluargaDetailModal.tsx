"use client";

import { useState, useEffect } from "react";
import { Home, Users, MapPin, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { KeluargaData } from "@/types/keluarga";
import { getAge, getKepalaKeluarga } from "./utils";

// ================== DETAIL MODAL ==================
export function KeluargaDetailModal({ keluarga, open, onClose }: { keluarga: KeluargaData | null; open: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'info' | 'anggota'>('info');

  useEffect(() => { if (open) setActiveTab('info'); }, [open]);

  if (!keluarga) return null;

  const kepala = getKepalaKeluarga(keluarga.Umats);
  const jumlahAnggota = keluarga.Umats?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[97vw] h-[88vh] sm:h-[78vh] p-0 flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        <div className="flex flex-col sm:flex-row h-full overflow-hidden">

          {/* Sidebar kiri */}
          <div className="w-full sm:w-60 bg-gradient-to-b from-slate-800 to-slate-900 flex flex-col shrink-0 text-white">
            <div className="p-5 border-b border-slate-700">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-xl flex items-center justify-center mb-3">
                <Home className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="font-bold text-base leading-tight">{kepala}</h2>
              <p className="text-xs text-slate-400 mt-1 font-mono">{keluarga.no_kk_paroki || 'No KK -'}</p>
              {keluarga.Kbg && (
                <p className="text-xs text-slate-400 mt-1">{keluarga.Kbg.nama_kbg}</p>
              )}
            </div>

            {/* Stats */}
            <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-700">
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-2xl font-black text-white">{jumlahAnggota}</div>
                <div className="text-xs text-slate-400">Anggota</div>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                <div className="text-sm font-bold text-white capitalize">{keluarga.status_rumah || '-'}</div>
                <div className="text-xs text-slate-400">Rumah</div>
              </div>
            </div>

            {/* Tabs */}
            <nav className="flex-1 p-3 space-y-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'info' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'}`}
              >
                <Home className="w-4 h-4" /> Info Keluarga
              </button>
              <button
                onClick={() => setActiveTab('anggota')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'anggota' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'}`}
              >
                <div className="flex items-center gap-2.5"><Users className="w-4 h-4" /> Anggota</div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'anggota' ? 'bg-emerald-500 text-white' : 'bg-slate-600 text-slate-300'}`}>{jumlahAnggota}</span>
              </button>
            </nav>

            <div className="p-3 border-t border-slate-700">
              <button onClick={onClose} className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-500 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors">
                <X className="w-3.5 h-3.5" /> Tutup
              </button>
            </div>
          </div>

          {/* Content kanan */}
          <div className="flex-1 overflow-y-auto bg-white">

            {/* INFO TAB */}
            {activeTab === 'info' && (
              <div className="p-6 sm:p-8 space-y-6 animate-in fade-in duration-200">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Informasi Keluarga</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Data hunian, ekonomi, dan lokasi.</p>
                </div>

                {/* KPI mini cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">KBG</div>
                    <div className="font-bold text-slate-800 text-sm">{keluarga.Kbg?.nama_kbg || '-'}</div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Status Rumah</div>
                    <div className="font-bold text-slate-800 text-sm">{keluarga.status_rumah || '-'}</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 col-span-2 sm:col-span-1">
                    <div className="text-xs text-emerald-600 mb-1 uppercase tracking-wider">Pendapatan</div>
                    <div className="font-bold text-emerald-800 text-sm">
                      {keluarga.pendapatan_per_bulan
                        ? `Rp ${Number(keluarga.pendapatan_per_bulan).toLocaleString('id-ID')}`
                        : '-'}
                    </div>
                  </div>
                </div>

                {/* Detail table */}
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50/50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50 w-2/5">No. KK Paroki</th>
                        <td className="px-5 py-3 font-mono text-slate-800 font-medium">{keluarga.no_kk_paroki || '-'}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">Asuransi Kesehatan</th>
                        <td className="px-5 py-3 text-slate-800">{keluarga.asuransi_kesehatan || '-'}</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50 align-top">Fasilitas MCK</th>
                        <td className="px-5 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {keluarga.fasilitas_kamar_mandi && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700 text-xs">Kamar Mandi</Badge>}
                            {keluarga.fasilitas_kamar_cuci && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700 text-xs">Tempat Cuci</Badge>}
                            {keluarga.fasilitas_wc && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700 text-xs">WC / Toilet</Badge>}
                            {!keluarga.fasilitas_kamar_mandi && !keluarga.fasilitas_kamar_cuci && !keluarga.fasilitas_wc && (
                              <span className="text-slate-400 text-sm italic">Tidak ada fasilitas</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50/50">
                        <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-50/50">Koordinat GPS</th>
                        <td className="px-5 py-3 font-mono text-xs text-slate-700">
                          {keluarga.latitude && keluarga.longitude
                            ? `${keluarga.latitude}, ${keluarga.longitude}`
                            : <span className="text-slate-400 not-italic font-sans text-sm">Tidak dilampirkan</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Foto rumah */}
                {keluarga.foto_rumah_url ? (
                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm group relative">
                    <img src={keluarga.foto_rumah_url} alt="Foto Rumah" className="w-full max-h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs flex items-center gap-1.5"><MapPin className="w-3 h-3" />Foto Rumah Keluarga</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <Home className="w-10 h-10 opacity-30 mb-2" />
                    <p className="text-sm font-medium text-slate-500">Foto rumah belum diunggah</p>
                  </div>
                )}
              </div>
            )}

            {/* ANGGOTA TAB */}
            {activeTab === 'anggota' && (
              <div className="p-6 sm:p-8 space-y-5 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">Daftar Anggota Keluarga</h3>
                    <p className="text-sm text-slate-500 mt-0.5">Semua individu dalam satu KK.</p>
                  </div>
                  <Badge className="bg-slate-800 text-white">{jumlahAnggota} Orang</Badge>
                </div>

                {keluarga.Umats && keluarga.Umats.length > 0 ? (
                  <div className="space-y-3">
                    {keluarga.Umats.map((member, i) => (
                      <div key={member.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className={`h-1.5 w-full ${member.status_dalam_keluarga === 'KK' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                        <div className="p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${member.jenis_kelamin === 'L' ? 'bg-brown-100 text-brown-700' : 'bg-pink-100 text-pink-700'}`}>
                                {member.nama_lengkap?.charAt(0) || i + 1}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-slate-900 text-sm">{member.nama_lengkap}</h4>
                                  {member.status_dalam_keluarga === 'KK' && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-emerald-100 text-emerald-800">KK</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500 flex-wrap">
                                  <span>{member.jenis_kelamin === 'L' ? 'Laki-laki' : member.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</span>
                                  <span>•</span>
                                  <span>{getAge(member.tanggal_lahir)}</span>
                                  <span>•</span>
                                  <span>{member.pekerjaan || 'Tidak bekerja'}</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs text-slate-600 border-slate-300 shrink-0">
                              {member.status_dalam_keluarga || '-'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                    <Users className="w-12 h-12 opacity-20 mb-3" />
                    <p className="font-medium text-slate-500">Belum ada anggota terdaftar</p>
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


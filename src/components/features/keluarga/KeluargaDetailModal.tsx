"use client";

import { useState, useEffect } from "react";
import { Home, Users, MapPin, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { KeluargaData } from "@/types/keluarga";
import { getAge, getKepalaKeluarga } from "./utils";
import dynamic from "next/dynamic";

const MapDisplay = dynamic(() => import("@/components/map/MapDisplay"), { ssr: false, loading: () => <div className="w-full h-48 bg-slate-100 flex items-center justify-center animate-pulse">Memuat Peta...</div> });

// ================== DETAIL MODAL ==================
export function KeluargaDetailModal({ keluarga, open, onClose, onUmatClick }: { keluarga: KeluargaData | null; open: boolean; onClose: () => void; onUmatClick?: (id: string) => void; }) {
  const [activeTab, setActiveTab] = useState<'info' | 'anggota'>('info');

  useEffect(() => { if (open) setActiveTab('info'); }, [open]);

  if (!keluarga) return null;

  const kepala = getKepalaKeluarga(keluarga.Umats);
  const jumlahAnggota = keluarga.Umats?.length || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl w-[97vw] h-[88vh] sm:h-[78vh] p-0 flex flex-col overflow-hidden bg-white rounded-none shadow-2xl border-0">
        <div className="flex flex-col sm:flex-row h-full overflow-hidden">

          {/* Sidebar kiri */}
          <div className="w-full sm:w-64 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-5 border-b border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-brown-50 border border-brown-100 rounded-none flex items-center justify-center shrink-0">
                  <Home className="w-6 h-6 text-brown-600" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-sm text-slate-900 leading-tight truncate">{kepala}</h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-mono">{keluarga.no_kk_paroki || 'No KK -'}</p>
                </div>
              </div>
              {keluarga.Kbg && (
                <Badge variant="outline" className="text-xs rounded-none font-bold border-0 px-2 py-1 bg-slate-200/60 text-slate-700">{keluarga.Kbg.nama_kbg}</Badge>
              )}
            </div>

            {/* Stats */}
            <div className="p-4 grid grid-cols-2 gap-3 border-b border-slate-200">
              <div className="bg-white rounded-none p-3 text-center border border-slate-200/80 shadow-sm">
                <div className="text-2xl font-black text-slate-800">{jumlahAnggota}</div>
                <div className="text-xs font-bold text-slate-500 mt-0.5">Anggota</div>
              </div>
              <div className="bg-white rounded-none p-3 text-center flex flex-col justify-center border border-slate-200/80 shadow-sm">
                <div className="text-sm font-bold text-slate-800 capitalize">{keluarga.status_rumah || '-'}</div>
                <div className="text-xs font-bold text-slate-500 mt-1">Rumah</div>
              </div>
            </div>

            {/* Tabs */}
            <nav className="flex-1 p-3 space-y-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-none text-sm font-bold transition-all ${activeTab === 'info' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                <Home className="w-4 h-4" /> Info Keluarga
              </button>
              <button
                onClick={() => setActiveTab('anggota')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none text-sm font-bold transition-all ${activeTab === 'anggota' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/60'}`}
              >
                <div className="flex items-center gap-2.5"><Users className="w-4 h-4" /> Anggota</div>
                <span className={`text-xs px-2 py-0.5 rounded-none font-bold ${activeTab === 'anggota' ? 'bg-brown-500 text-white' : 'bg-slate-200 text-slate-700'}`}>{jumlahAnggota}</span>
              </button>
            </nav>
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
                  <div className="p-4 bg-slate-50/50 rounded-none border border-slate-200/80">
                    <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">KBG</div>
                    <div className="font-bold text-slate-800 text-sm">{keluarga.Kbg?.nama_kbg || '-'}</div>
                  </div>
                  <div className="p-4 bg-slate-50/50 rounded-none border border-slate-200/80">
                    <div className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Status Rumah</div>
                    <div className="font-bold text-slate-800 text-sm">{keluarga.status_rumah || '-'}</div>
                  </div>
                  <div className="p-4 bg-indigo-50/50 rounded-none border border-indigo-200/80 col-span-2 sm:col-span-1">
                    <div className="text-xs font-bold text-indigo-700 mb-1 uppercase tracking-wider">Pendapatan</div>
                    <div className="font-bold text-indigo-900 text-sm">
                      {keluarga.pendapatan_per_bulan
                        ? `Rp ${Number(keluarga.pendapatan_per_bulan).toLocaleString('id-ID')}`
                        : '-'}
                    </div>
                  </div>
                </div>

                {/* Detail table */}
                <div className="bg-white rounded-none border border-slate-200/80 overflow-hidden shadow-sm">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      <tr className="group">
                        <th className="px-5 py-3 text-left font-bold text-slate-500 w-2/5 bg-slate-50/50 text-xs uppercase tracking-wider border-r border-slate-100">Kode Unik Keluarga</th>
                        <td className="px-5 py-3 font-mono text-slate-800 font-bold">{keluarga.kode_unik_keluarga || '-'}</td>
                      </tr>
                      <tr className="group">
                        <th className="px-5 py-3 text-left font-bold text-slate-500 w-2/5 bg-slate-50/50 text-xs uppercase tracking-wider border-r border-slate-100">No. KK Paroki</th>
                        <td className="px-5 py-3 font-mono text-slate-800 font-bold">{keluarga.no_kk_paroki || '-'}</td>
                      </tr>
                      <tr className="group">
                        <th className="px-5 py-3 text-left font-bold text-slate-500 bg-slate-50/50 text-xs uppercase tracking-wider border-r border-slate-100">Asuransi Kesehatan</th>
                        <td className="px-5 py-3 text-slate-800 font-bold">{keluarga.asuransi_kesehatan || '-'}</td>
                      </tr>
                      <tr className="group">
                        <th className="px-5 py-3 text-left font-bold text-slate-500 bg-slate-50/50 text-xs uppercase tracking-wider align-top border-r border-slate-100">Fasilitas MCK</th>
                        <td className="px-5 py-3">
                          <div className="flex gap-2 flex-wrap">
                            {keluarga.fasilitas_kamar_mandi && <Badge variant="outline" className="border-0 bg-brown-50 text-brown-700 font-bold rounded-none px-2 py-1 text-xs">Kamar Mandi</Badge>}
                            {keluarga.fasilitas_kamar_cuci && <Badge variant="outline" className="border-0 bg-brown-50 text-brown-700 font-bold rounded-none px-2 py-1 text-xs">Tempat Cuci</Badge>}
                            {keluarga.fasilitas_wc && <Badge variant="outline" className="border-0 bg-brown-50 text-brown-700 font-bold rounded-none px-2 py-1 text-xs">WC / Toilet</Badge>}
                            {!keluarga.fasilitas_kamar_mandi && !keluarga.fasilitas_kamar_cuci && !keluarga.fasilitas_wc && (
                              <span className="text-slate-400 font-medium text-sm italic">Tidak ada fasilitas</span>
                            )}
                          </div>
                        </td>
                      </tr>
                      <tr className="group">
                        <th className="px-5 py-3 text-left font-bold text-slate-500 bg-slate-50/50 text-xs uppercase tracking-wider border-r border-slate-100">Koordinat GPS</th>
                        <td className="px-5 py-3 font-mono font-bold text-xs text-slate-700">
                          {keluarga.latitude && keluarga.longitude
                            ? `${keluarga.latitude}, ${keluarga.longitude}`
                            : <span className="text-slate-400 not-italic font-sans font-medium text-sm">Tidak dilampirkan</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Peta Lokasi */}
                {keluarga.latitude && keluarga.longitude && (
                  <div className="w-full h-[300px] sm:h-[400px] rounded-none border border-slate-200/80 shadow-sm overflow-hidden">
                    <MapDisplay lat={keluarga.latitude} lng={keluarga.longitude} />
                  </div>
                )}

                {/* Foto rumah */}
                {keluarga.foto_rumah_url ? (
                  <div className="rounded-none overflow-hidden border border-slate-200/80 shadow-sm group relative">
                    <img src={keluarga.foto_rumah_url} alt="Foto Rumah" className="w-full max-h-56 object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-xs font-bold flex items-center gap-1.5"><MapPin className="w-3 h-3" />Foto Rumah Keluarga</p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-none border border-dashed border-slate-300 p-8 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                    <Home className="w-10 h-10 opacity-30 mb-2" />
                    <p className="text-sm font-bold text-slate-500">Foto rumah belum diunggah</p>
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
                  <Badge className="bg-slate-800 text-white rounded-none">{jumlahAnggota} Orang</Badge>
                </div>

                {keluarga.Umats && keluarga.Umats.length > 0 ? (
                  <div className="space-y-4">
                    {keluarga.Umats.map((member, i) => (
                      <button onClick={() => onUmatClick?.(member.id)} key={member.id} className="block w-full text-left bg-white rounded-none border border-slate-200/80 overflow-hidden shadow-sm hover:border-brown-400 hover:shadow-md transition-all cursor-pointer">
                        <div className={`h-1 w-full ${member.status_dalam_keluarga === 'KK' ? 'bg-brown-500' : 'bg-slate-200'}`} />
                        <div className="p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-none border flex items-center justify-center font-bold text-sm shrink-0 ${member.jenis_kelamin === 'L' ? 'bg-brown-50 border-brown-100 text-brown-700' : 'bg-pink-50 border-pink-100 text-pink-700'}`}>
                                {member.nama_lengkap?.charAt(0) || i + 1}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-bold text-slate-900 text-base group-hover:text-brown-700 transition-colors">{member.nama_lengkap}</h4>
                                  {member.nomor_induk_umat && (
                                    <Badge variant="outline" className="rounded-none text-[10px] px-1.5 py-0 h-4 bg-slate-50 text-slate-600 font-mono border-slate-200">{member.nomor_induk_umat}</Badge>
                                  )}
                                  {member.status_dalam_keluarga === 'KK' && (
                                    <Badge variant="secondary" className="rounded-none text-[10px] px-1.5 py-0 h-4 bg-brown-100 text-brown-800 font-bold border border-brown-200">KK</Badge>
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
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="rounded-none font-bold text-xs text-slate-600 border-slate-300 shrink-0">
                                {member.status_dalam_keluarga || '-'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </button>
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



"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Home, Users, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";
import { VerificationData } from "@/types/verification";

export interface VerifikasiDetailModalProps {
  open: boolean;
  onClose: () => void;
  selectedItem: VerificationData | null;
  userRole: string | null;
  onVerifyStasi: () => void;
  onApproveParoki: () => void;
  onReject: (reason: string) => void;
  actionLoading: boolean;
}

export function VerifikasiDetailModal({ 
  open, onClose, selectedItem, userRole, 
  onVerifyStasi, onApproveParoki, onReject, actionLoading 
}: VerifikasiDetailModalProps) {
  const [activeModalSection, setActiveModalSection] = useState<'ringkasan' | 'rumah' | 'lokasi' | 'anggota' | 'approved_paroki'>('ringkasan');
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (open) {
      setActiveModalSection('ringkasan');
      setRejectReason("");
    }
  }, [open]);

  const handleLocalReject = () => {
    if (!rejectReason.trim()) {
      alert("Alasan penolakan wajib diisi.");
      return;
    }
    onReject(rejectReason);
  };

  return (
    <>
    {/* Detail Modal */}
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-6xl w-[98vw] h-[95vh] sm:h-[85vh] p-0 flex flex-col overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        {selectedItem && (
          <div className="flex flex-col sm:flex-row h-full overflow-hidden">
            
            {/* Left Sidebar Menu */}
            <div className="w-full sm:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0">
              <div className="p-6 border-b border-slate-200">
                <Badge variant="outline" className={`mb-3 ${
                  selectedItem.status === 'PENDING' 
                    ? 'bg-amber-100 text-amber-800 border-amber-300' 
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}>
                  {selectedItem.status === 'PENDING' ? 'Verifikasi Stasi' : 'Approval Paroki'}
                </Badge>
                <h2 className="text-xl font-bold text-slate-900 leading-tight">
                  {selectedItem.payload_data.type === 'KEPENGURUSAN' 
                    ? `SK Pengurus KBG`
                    : `Kel. ${selectedItem.payload_data.members?.[0]?.nama_lengkap || 'Tanpa Nama'}`
                  }
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {selectedItem.payload_data.type === 'KEPENGURUSAN' 
                    ? `Periode ${selectedItem.payload_data.periode_mulai} - ${selectedItem.payload_data.periode_selesai}`
                    : (selectedItem.payload_data.kbg_id ? 'Terkoneksi KBG' : 'Luar KBG')}
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-1">
                {selectedItem.payload_data.type === 'KEPENGURUSAN' ? (
                  <>
                    <button 
                      onClick={() => setActiveModalSection('ringkasan')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeModalSection === 'ringkasan' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                      <AlertCircle className="w-4 h-4" /> Ringkasan SK
                    </button>
                    <button 
                      onClick={() => setActiveModalSection('anggota')}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeModalSection === 'anggota' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                      <div className="flex items-center gap-3"><Users className="w-4 h-4" /> Susunan Pengurus</div>
                      <Badge variant="secondary" className={`${activeModalSection === 'anggota' ? 'bg-brown-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {selectedItem.payload_data.pengurus?.length || 0}
                      </Badge>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => setActiveModalSection('ringkasan')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeModalSection === 'ringkasan' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                      <AlertCircle className="w-4 h-4" /> Ringkasan
                    </button>
                    <button 
                      onClick={() => setActiveModalSection('rumah')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeModalSection === 'rumah' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                      <Home className="w-4 h-4" /> Ekonomi & Rumah
                    </button>
                    <button 
                      onClick={() => setActiveModalSection('lokasi')}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeModalSection === 'lokasi' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                      <MapPin className="w-4 h-4" /> Lokasi & Foto
                    </button>
                    <button 
                      onClick={() => setActiveModalSection('anggota')}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeModalSection === 'anggota' ? 'bg-brown-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-200/50'}`}
                    >
                      <div className="flex items-center gap-3"><Users className="w-4 h-4" /> Anggota</div>
                      <Badge variant="secondary" className={`${activeModalSection === 'anggota' ? 'bg-brown-500 text-white' : 'bg-slate-200 text-slate-700'}`}>
                        {selectedItem.payload_data.members?.length || 0}
                      </Badge>
                    </button>
                  </>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-200 bg-slate-100/50">
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Info Penginput</div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brown-200 text-brown-700 flex items-center justify-center font-bold text-xs">
                    {selectedItem.User?.username?.substring(0,2).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">{selectedItem.User?.username || 'Sistem'}</div>
                    <div className="text-xs text-slate-500">{selectedItem.User?.role || 'Unknown'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content Area */}
            <div className="flex-1 flex flex-col h-full bg-white relative">
              <div className="flex-1 overflow-y-auto p-6 sm:p-10">
                
                {/* --- SECTION: RINGKASAN --- */}
                {activeModalSection === 'ringkasan' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Data</h3>
                      <p className="text-slate-500 mt-1">
                        {selectedItem.payload_data.type === 'KEPENGURUSAN' 
                          ? 'Tinjauan struktur pengurus KBG.' 
                          : 'Tinjauan cepat informasi keluarga.'}
                      </p>
                    </div>
                    
                    {selectedItem.payload_data.type === 'KEPENGURUSAN' ? (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
                            <Users className="w-8 h-8 text-brown-500 mb-3" />
                            <div className="text-3xl font-black text-slate-800">{selectedItem.payload_data.pengurus?.length || 0}</div>
                            <div className="text-sm font-medium text-slate-500 mt-1">Total Pengurus</div>
                          </div>
                          <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
                            <CheckCircle className="w-8 h-8 text-emerald-500 mb-3" />
                            <div className="text-3xl font-black text-slate-800">{selectedItem.payload_data.periode_mulai}</div>
                            <div className="text-sm font-medium text-slate-500 mt-1">Tahun Mulai Menjabat</div>
                          </div>
                        </div>

                        {selectedItem.payload_data.sk_url ? (
                          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl text-blue-900 leading-relaxed flex flex-col items-center">
                            <div className="font-bold mb-3 flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-blue-600" /> Dokumen SK Terlampir
                            </div>
                            <a href={selectedItem.payload_data.sk_url} target="_blank" rel="noreferrer" className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                              Lihat SK Pengangkatan
                            </a>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-amber-900 leading-relaxed flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
                            <div>
                              <strong>Peringatan:</strong> Tidak ada file SK Pengangkatan yang dilampirkan. Pastikan struktur ini memang sah sebelum menyetujuinya.
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
                            <Users className="w-8 h-8 text-brown-500 mb-3" />
                            <div className="text-3xl font-black text-slate-800">{selectedItem.payload_data.members?.length || 0}</div>
                            <div className="text-sm font-medium text-slate-500 mt-1">Total Anggota Keluarga</div>
                          </div>
                          <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm">
                            <Home className="w-8 h-8 text-emerald-500 mb-3" />
                            <div className="text-3xl font-black text-slate-800 capitalize">{selectedItem.payload_data.status_rumah || '-'}</div>
                            <div className="text-sm font-medium text-slate-500 mt-1">Status Kepemilikan Rumah</div>
                          </div>
                        </div>

                        <div className="bg-brown-50 border border-brown-200 p-5 rounded-2xl text-brown-900 leading-relaxed">
                          <strong>Tugas Anda:</strong> Mohon periksa keabsahan foto rumah, kelengkapan surat sakramen pada setiap anggota keluarga, dan validitas domisili sebelum melakukan persetujuan.
                          {userRole === 'ADMIN_PAROKI' && " Data ini telah lolos verifikasi dari Admin Stasi."}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* --- SECTION: RUMAH --- */}
                {activeModalSection === 'rumah' && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Ekonomi & Rumah</h3>
                      <p className="text-slate-500 mt-1">Informasi Nomor KK, status hunian, dan pendapatan.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <tbody className="divide-y divide-slate-100">
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-6 py-4 font-semibold text-slate-700 w-1/3 bg-slate-50/30">Nomor KK Paroki</th>
                            <td className="px-6 py-4 text-slate-900">{selectedItem.payload_data.no_kk_paroki || '-'}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-6 py-4 font-semibold text-slate-700 bg-slate-50/30">Status Rumah</th>
                            <td className="px-6 py-4 text-slate-900">{selectedItem.payload_data.status_rumah || '-'}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-6 py-4 font-semibold text-slate-700 bg-slate-50/30">Pendapatan Per Bulan</th>
                            <td className="px-6 py-4 text-emerald-700 font-bold">
                              {selectedItem.payload_data.pendapatan ? `Rp ${selectedItem.payload_data.pendapatan.toLocaleString('id-ID')}` : '-'}
                            </td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-6 py-4 font-semibold text-slate-700 bg-slate-50/30">Asuransi Kesehatan</th>
                            <td className="px-6 py-4 text-slate-900">{selectedItem.payload_data.asuransi || '-'}</td>
                          </tr>
                          <tr className="hover:bg-slate-50/50">
                            <th className="px-6 py-4 font-semibold text-slate-700 bg-slate-50/30 align-top">Fasilitas MCK</th>
                            <td className="px-6 py-4">
                              <div className="flex gap-2 flex-wrap">
                                {selectedItem.payload_data.has_kamar_mandi && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700">Kamar Mandi</Badge>}
                                {selectedItem.payload_data.has_kamar_cuci && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700">Tempat Cuci</Badge>}
                                {selectedItem.payload_data.has_wc && <Badge variant="outline" className="border-brown-200 bg-brown-50 text-brown-700">WC / Toilet</Badge>}
                                {!selectedItem.payload_data.has_kamar_mandi && !selectedItem.payload_data.has_kamar_cuci && !selectedItem.payload_data.has_wc && <span className="text-slate-400 italic">Tidak ada fasilitas</span>}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* --- SECTION: LOKASI --- */}
                {activeModalSection === 'lokasi' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Lokasi & Foto Bukti</h3>
                      <p className="text-slate-500 mt-1">Koordinat domisili dan foto fisik rumah dari lapangan.</p>
                    </div>

                    <div className="flex gap-4">
                      <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Latitude</div>
                        <div className="font-mono text-slate-800 break-all">{selectedItem.payload_data.lat || 'Tidak dilampirkan'}</div>
                      </div>
                      <div className="flex-1 p-4 rounded-xl border border-slate-200 bg-slate-50">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Longitude</div>
                        <div className="font-mono text-slate-800 break-all">{selectedItem.payload_data.lng || 'Tidak dilampirkan'}</div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-100 shadow-inner group relative">
                      {selectedItem.payload_data.foto_rumah_url ? (
                        <>
                          <img 
                            src={selectedItem.payload_data.foto_rumah_url} 
                            alt="Foto Rumah" 
                            className="w-full h-auto max-h-[500px] object-contain transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white text-sm">Foto diambil oleh Penginput</p>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-400">
                          <Home className="w-16 h-16 mb-4 opacity-20" />
                          <p className="font-medium text-lg text-slate-500">Tidak ada foto dilampirkan</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* --- SECTION: ANGGOTA --- */}
                {activeModalSection === 'anggota' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-end">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Daftar Anggota Keluarga</h3>
                        <p className="text-slate-500 mt-1">Detail individu dan status sakramen.</p>
                      </div>
                      <Badge className="bg-slate-800">{selectedItem.payload_data.members?.length || 0} Orang</Badge>
                    </div>

                    <div className="space-y-4">
                      {selectedItem.payload_data.type === 'KEPENGURUSAN' ? (
                        selectedItem.payload_data.pengurus?.map((p: any, i: number) => (
                          <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm p-5 flex flex-col sm:flex-row justify-between gap-4">
                            <div>
                              <h4 className="text-lg font-bold text-slate-900">{p.nama}</h4>
                              <p className="text-sm text-slate-500 mt-1 font-medium">{p.jabatan}</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
                              <User className="w-4 h-4" />
                              <span className="text-sm font-medium">{p.telepon || 'Tidak ada no. telp'}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        selectedItem.payload_data.members?.map((m: any, i: number) => (
                        <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                          <div className={`h-2 w-full ${m.status_dalam_keluarga === 'KK' ? 'bg-brown-500' : 'bg-slate-200'}`}></div>
                          <div className="p-5 sm:p-6">
                            <div className="flex flex-col sm:flex-row justify-between gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                  <h4 className="text-xl font-bold text-slate-900">{m.nama_lengkap}</h4>
                                  {m.status_dalam_keluarga === 'KK' && (
                                    <Badge variant="secondary" className="bg-brown-100 text-brown-800 border-brown-200">Kepala Keluarga</Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                  <span className="flex items-center gap-1.5 font-medium"><User className="w-4 h-4 text-slate-400" /> {m.jenis_kelamin}</span>
                                  <span className="text-slate-300">•</span>
                                  <span>Lahir: {m.tempat_lahir || '-'}, {m.tgl_lahir}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="font-medium text-slate-700">{m.pekerjaan || 'Tidak bekerja'}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 flex-wrap items-start">
                                {m.has_baptis && <Badge className="bg-brown-100 text-brown-800 hover:bg-brown-200 border-0">Baptis</Badge>}
                                {m.has_komuni && <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-0">Komuni</Badge>}
                                {m.has_krisma && <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">Krisma</Badge>}
                                {m.has_perkawinan && <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">Kawin</Badge>}
                                {!m.has_baptis && !m.has_komuni && !m.has_krisma && !m.has_perkawinan && (
                                  <span className="text-sm italic text-slate-400 px-2 py-1 bg-slate-50 rounded border border-slate-100">Belum ada sakramen</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
                              <div>
                                <div className="text-xs text-slate-500 mb-1">Status Hubungan</div>
                                <div className="font-semibold text-slate-800">{m.status_dalam_keluarga}</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 mb-1">Pendidikan</div>
                                <div className="font-semibold text-slate-800">{m.pendidikan_terakhir || '-'}</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 mb-1">Kesehatan</div>
                                <div className="font-semibold text-slate-800">{m.status_kesehatan || 'Normal'}</div>
                              </div>
                              <div>
                                <div className="text-xs text-slate-500 mb-1">Suku</div>
                                <div className="font-semibold text-slate-800">{m.suku || '-'}</div>
                              </div>
                            </div>

                            {/* DETAIL SAKRAMEN */}
                            {(m.has_baptis || m.has_komuni || m.has_krisma || m.has_perkawinan) && (
                              <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4 text-slate-400" /> Detail Surat Sakramen
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  
                                  {m.has_baptis && (
                                    <div className="bg-brown-50/50 p-3 rounded-lg border border-brown-100">
                                      <div className="font-semibold text-brown-800 text-sm mb-2 border-b border-brown-100 pb-1">Baptis</div>
                                      <div className="grid grid-cols-1 gap-1 text-xs text-slate-600">
                                        <div><span className="text-slate-400">No:</span> {m.baptis_no_surat || '-'}</div>
                                        <div><span className="text-slate-400">Tgl:</span> {m.baptis_tgl || '-'}</div>
                                        <div><span className="text-slate-400">Gereja:</span> {m.baptis_tempat || '-'}</div>
                                        <div><span className="text-slate-400">Oleh:</span> {m.baptis_pastor || '-'}</div>
                                      </div>
                                    </div>
                                  )}

                                  {m.has_komuni && (
                                    <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100">
                                      <div className="font-semibold text-purple-800 text-sm mb-2 border-b border-purple-100 pb-1">Komuni Pertama</div>
                                      <div className="grid grid-cols-1 gap-1 text-xs text-slate-600">
                                        <div><span className="text-slate-400">Tgl:</span> {m.komuni_tgl || '-'}</div>
                                        <div><span className="text-slate-400">Gereja:</span> {m.komuni_tempat || '-'}</div>
                                      </div>
                                    </div>
                                  )}

                                  {m.has_krisma && (
                                    <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                                      <div className="font-semibold text-emerald-800 text-sm mb-2 border-b border-emerald-100 pb-1">Krisma</div>
                                      <div className="grid grid-cols-1 gap-1 text-xs text-slate-600">
                                        <div><span className="text-slate-400">No:</span> {m.krisma_no_surat || '-'}</div>
                                        <div><span className="text-slate-400">Tgl:</span> {m.krisma_tgl || '-'}</div>
                                        <div><span className="text-slate-400">Gereja:</span> {m.krisma_tempat || '-'}</div>
                                        <div><span className="text-slate-400">Oleh:</span> {m.krisma_pastor || '-'}</div>
                                      </div>
                                    </div>
                                  )}

                                  {m.has_perkawinan && (
                                    <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                                      <div className="font-semibold text-amber-800 text-sm mb-2 border-b border-amber-100 pb-1">Perkawinan</div>
                                      <div className="grid grid-cols-1 gap-1 text-xs text-slate-600">
                                        <div><span className="text-slate-400">No:</span> {m.kawin_no_surat || '-'}</div>
                                        <div><span className="text-slate-400">Tgl:</span> {m.kawin_tgl || '-'}</div>
                                        <div><span className="text-slate-400">Gereja:</span> {m.kawin_tempat || '-'}</div>
                                        <div><span className="text-slate-400">Oleh:</span> {m.kawin_pastor || '-'}</div>
                                      </div>
                                    </div>
                                  )}

                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )))}
                    </div>
                  </div>
                )}

                {/* --- SECTION: HISTORY --- */}
                {activeModalSection === 'approved_paroki' && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Riwayat Verifikasi</h3>
                      <p className="text-slate-500 mt-1">Jejak audit data yang telah disetujui.</p>
                    </div>
                    <div className="text-slate-400 italic text-center py-10">Belum ada riwayat tersedia.</div>
                  </div>
                )}

                <div className="h-20"></div> {/* Bottom spacing for sticky footer */}
              </div>

              {/* Sticky Action Footer */}
              <div className="border-t border-slate-200 bg-white p-4 sm:p-6 mt-auto">
                
                {/* Reject Reason Input */}
                <div className="mb-6 max-w-2xl bg-red-50 p-4 rounded-xl border border-red-100">
                  <label className="text-sm font-bold text-red-900 flex items-center gap-2 mb-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    Alasan Penolakan <span className="text-red-500 font-normal opacity-80">(Opsional, wajib jika Anda menolak)</span>
                  </label>
                  <Input 
                    placeholder="Ketikan alasan kenapa data ini ditolak (cth: Foto tidak jelas)..." 
                    className="border-red-200 focus-visible:ring-red-500 bg-white placeholder:text-slate-400"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleLocalReject}
                    disabled={actionLoading}
                    className="w-full sm:w-auto border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-12 px-6 rounded-xl font-bold"
                  >
                    <XCircle className="w-5 h-5 mr-2" /> Tolak Data
                  </Button>
                  
                  <div className="flex flex-col-reverse sm:flex-row w-full sm:w-auto gap-3">
                    <Button variant="ghost" onClick={() => onClose()} className="h-12 px-6 rounded-xl font-medium w-full sm:w-auto">Batalkan</Button>
                    
                    {userRole !== 'ADMIN_PAROKI' && selectedItem?.status === 'PENDING' && selectedItem.payload_data.type !== 'KEPENGURUSAN' && (
                      <Button 
                        onClick={onVerifyStasi}
                        disabled={actionLoading}
                        className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 h-12 px-8 rounded-xl font-bold text-base"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Setujui & Verifikasi (Stasi)
                      </Button>
                    )}

                    {userRole === 'ADMIN_PAROKI' && (selectedItem?.status === 'VERIFIED_STASI' || (selectedItem?.payload_data.type === 'KEPENGURUSAN' && selectedItem?.status === 'PENDING')) && (
                      <Button 
                        onClick={onApproveParoki}
                        disabled={actionLoading}
                        className="w-full sm:w-auto bg-brown-600 hover:bg-brown-700 text-white shadow-lg shadow-brown-600/30 h-12 px-8 rounded-xl font-bold text-base"
                      >
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Approve Final (Paroki)
                      </Button>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}

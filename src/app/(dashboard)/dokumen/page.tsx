"use strict";
"use client";

import { useState } from "react";
import { 
  FileText, FolderOpen, Download, Search, 
  FileCheck, FileDigit, Plus, Eye, Printer, BookOpen, ChevronRight, FileArchive, ArrowRight
} from "lucide-react";

const BUKU_INDUK = [
  { id: 1, title: "Buku Permandian 2023", type: "PDF", size: "2.4 MB", date: "10 Jan 2024", desc: "Rekapitulasi pembaptisan sepanjang tahun 2023." },
  { id: 2, title: "Buku Perkawinan 2023", type: "PDF", size: "1.8 MB", date: "15 Jan 2024", desc: "Arsip janji suci dan pencatatan nikah kanonik." },
  { id: 3, title: "Buku Krisma 2023", type: "PDF", size: "3.1 MB", date: "20 Jan 2024", desc: "Daftar penerima sakramen penguatan." },
  { id: 4, title: "Buku Kematian 2023", type: "PDF", size: "1.2 MB", date: "05 Jan 2024", desc: "Catatan umat yang telah berpulang ke Rumah Bapa." },
];

const SURAT_TERBARU = [
  { id: 'SRT-001', umat: "Yohanes Kogoya", jenis: "Surat Keterangan Baptis", tgl: "10 Mei 2026", status: "Selesai" },
  { id: 'SRT-002', umat: "Maria Magai", jenis: "Surat Pengantar Nikah", tgl: "12 Mei 2026", status: "Proses" },
  { id: 'SRT-003', umat: "Petrus Tabuni", jenis: "Surat Mutasi (Keluar)", tgl: "14 Mei 2026", status: "Selesai" },
  { id: 'SRT-004', umat: "Agnes Wenda", jenis: "Surat Keterangan Kematian", tgl: "15 Mei 2026", status: "Ditolak" },
];

export default function DokumenArsipPage() {
  const [activeTab, setActiveTab] = useState<'buku' | 'surat' | 'scan'>('buku');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER SECTION WITH PREMIUM GRADIENT */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brown-900 via-indigo-900 to-purple-900 p-8 sm:p-10 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <FolderOpen className="w-64 h-64" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold uppercase tracking-wider mb-4">
              <FileCheck className="w-4 h-4 text-brown-300" />
              <span>Administrasi Gereja</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-brown-200">
              Dokumen & Arsip
            </h1>
            <p className="text-brown-100/80 max-w-xl text-sm sm:text-base leading-relaxed">
              Pusat pengelolaan dokumen resmi gereja, pencetakan surat keterangan umat, dan pengarsipan Buku Induk Paroki secara digital.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
              <Search className="w-4 h-4" /> Cari Arsip
            </button>
            <button className="flex items-center gap-2 bg-brown-500 hover:bg-brown-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-brown-500/30 hover:shadow-brown-400/40">
              <Plus className="w-4 h-4" /> Buat Surat Baru
            </button>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
        <button 
          onClick={() => setActiveTab('buku')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'buku' ? 'bg-brown-50 text-brown-700 dark:bg-brown-900/30 dark:text-brown-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4.5 h-4.5" /> Buku Induk Paroki
        </button>
        <button 
          onClick={() => setActiveTab('surat')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'surat' ? 'bg-brown-50 text-brown-700 dark:bg-brown-900/30 dark:text-brown-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4.5 h-4.5" /> Surat Pengantar & Keterangan
        </button>
        <button 
          onClick={() => setActiveTab('scan')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'scan' ? 'bg-brown-50 text-brown-700 dark:bg-brown-900/30 dark:text-brown-400 shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <FileArchive className="w-4.5 h-4.5" /> Berkas Fisik (Scans)
        </button>
      </div>

      {/* CONTENT AREA */}
      <div className="mt-6">
        
        {/* TAB 1: BUKU INDUK */}
        {activeTab === 'buku' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Arsip Digital Buku Induk</h3>
                <p className="text-sm text-slate-500">Hasil rekapitulasi data sakramen dan kematian umat yang di-generate per tahun.</p>
              </div>
              <button className="text-sm font-semibold text-brown-600 hover:text-brown-700 flex items-center gap-1">
                Lihat Semua Tahun <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {BUKU_INDUK.map((buku) => (
                <div key={buku.id} className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-brown-300 dark:hover:border-brown-700 transition-all cursor-pointer flex flex-col h-full relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-brown-50 to-indigo-50 dark:from-brown-900/20 dark:to-indigo-900/20 rounded-full blur-2xl group-hover:bg-brown-100 transition-colors"></div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-brown-50 dark:bg-brown-900/30 text-brown-600 dark:text-brown-400 flex items-center justify-center shadow-inner">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-md">
                      {buku.type} • {buku.size}
                    </span>
                  </div>
                  
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg mb-1.5 relative z-10 group-hover:text-brown-600 transition-colors">{buku.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 flex-1 relative z-10 leading-relaxed">
                    {buku.desc}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 relative z-10 mt-auto">
                    <span className="text-[11px] font-medium text-slate-400">{buku.date}</span>
                    <button className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 flex items-center justify-center group-hover:bg-brown-600 group-hover:text-white transition-all shadow-sm">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions for Book */}
            <div className="bg-brown-50 dark:bg-brown-900/10 border border-brown-100 dark:border-brown-900/30 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brown-100 dark:bg-brown-900/40 flex items-center justify-center shrink-0">
                  <FileDigit className="w-6 h-6 text-brown-600 dark:text-brown-400" />
                </div>
                <div>
                  <h4 className="font-bold text-brown-900 dark:text-brown-100">Generate Buku Tahun Ini</h4>
                  <p className="text-xs text-brown-600 dark:text-brown-300 mt-0.5">Buat rekap PDF otomatis untuk data tahun berjalan.</p>
                </div>
              </div>
              <button className="bg-white dark:bg-slate-800 border border-brown-200 dark:border-brown-700 text-brown-700 dark:text-brown-400 font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm hover:shadow transition-all shrink-0">
                Generate Sekarang
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SURAT MENYURAT */}
        {activeTab === 'surat' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Riwayat Pembuatan Surat</h3>
                  <p className="text-sm text-slate-500 mt-1">Daftar surat keterangan/pengantar yang diterbitkan sistem.</p>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Cari nama / nomor surat..." className="pl-9 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brown-500 w-full sm:w-64 transition-all" />
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800">
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-widest">No. Surat</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-widest">Nama Umat</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-widest">Jenis Surat</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-widest">Tanggal</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="py-4 px-6 text-xs font-extrabold text-slate-500 uppercase tracking-widest text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-sm">
                    {SURAT_TERBARU.map((surat) => (
                      <tr key={surat.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors group">
                        <td className="py-4 px-6 font-mono text-slate-500 font-medium">{surat.id}</td>
                        <td className="py-4 px-6 font-bold text-slate-800 dark:text-slate-200">{surat.umat}</td>
                        <td className="py-4 px-6 text-slate-600 dark:text-slate-400">{surat.jenis}</td>
                        <td className="py-4 px-6 text-slate-500">{surat.tgl}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            surat.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            surat.status === 'Proses' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                          }`}>
                            {surat.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-brown-600 hover:bg-brown-50 dark:hover:bg-brown-900/30 rounded-lg transition-colors" title="Lihat">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Cetak">
                              <Printer className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCAN FISIK */}
        {activeTab === 'scan' && (
          <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-5 rotate-3 shadow-inner">
              <FileArchive className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Penyimpanan Berkas Digital</h3>
            <p className="text-slate-500 max-w-md text-sm mb-6">
              Folder digital untuk menyimpan foto copy Kartu Keluarga (KK), KTP, dan arsip dokumen lampiran umat lainnya yang diunggah saat pendaftaran.
            </p>
            <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <FolderOpen className="w-4 h-4" /> Buka Direktori Berkas
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

"use strict";
"use client";

import { useState, useEffect } from "react";
import { 
  FileText, FolderOpen, ChevronRight, FileCheck,
  Folder, Image as ImageIcon, ChevronLeft, Search, Plus, List, Grid, Info, Settings
} from "lucide-react";
import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData } from "@/types/keluarga";

export default function DokumenArsipPage() {
  const [families, setFamilies] = useState<KeluargaData[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<KeluargaData | null>(null);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    keluargaService.getAll({ limit: 100 }).then(res => {
      setFamilies(res.data || []);
      setLoadingScans(false);
    }).catch(err => {
      console.error(err);
      setLoadingScans(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-[#1f1f1f] font-sans pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col p-6 gap-6 max-w-7xl mx-auto">
        
        {/* MAIN CONTENT CARD */}
        <main className="bg-white rounded-none border border-slate-200 shadow-sm flex flex-col overflow-hidden min-h-[75vh]">
          
          {/* Main Content Header & Search */}
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
            {!selectedFolder ? (
              <div className="flex items-center gap-2 text-slate-800">
                <FolderOpen className="w-6 h-6 text-brown-500" />
                <h1 className="text-xl font-bold tracking-tight">Direktori Berkas Digital</h1>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-800">
                <button 
                  onClick={() => setSelectedFolder(null)}
                  className="hover:bg-slate-200/50 p-1.5 rounded-none transition-colors text-slate-500 flex items-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <span 
                    onClick={() => setSelectedFolder(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer font-normal"
                  >
                    Direktori
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300" />
                  <Folder className="w-5 h-5 text-brown-500 fill-brown-100" />
                  <span className="truncate max-w-[200px] sm:max-w-md">
                    {`Keluarga ${selectedFolder.Umats?.find(u => u.status_dalam_keluarga === 'KK')?.nama_lengkap || 'Tanpa Nama'}`}
                  </span>
                </div>
              </div>
            )}

            <div className="relative w-full sm:max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Cari folder atau file..." 
                className="w-full bg-white border border-slate-200 rounded-none py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-brown-500 transition-shadow shadow-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
            {!selectedFolder ? (
              // FOLDER LIST VIEW
              <div>
                {loadingScans ? (
                  <div className="flex items-center justify-center py-20 text-[#444746]">
                    <div className="w-8 h-8 border-4 border-[#c2e7ff] border-t-[#0b57d0] rounded-full animate-spin"></div>
                  </div>
                ) : families.length === 0 ? (
                  <div className="text-center py-20 text-[#444746]">
                    <p>No files in My Drive</p>
                  </div>
                ) : (
                  <>
                    <h2 className="text-[14px] font-medium text-[#444746] mb-4 mt-2">Folders</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {families.map(family => {
                        const head = family.Umats?.find(u => u.status_dalam_keluarga === 'KK') || family.Umats?.[0];
                        const title = `Keluarga ${head?.nama_lengkap || 'Tanpa Nama'}`;
                        return (
                          <div 
                            key={family.id} 
                            onClick={() => setSelectedFolder(family)}
                            className="group flex items-center gap-3 bg-white hover:bg-brown-50 border border-slate-200 hover:border-brown-300 rounded-none p-4 cursor-pointer transition-all shadow-sm hover:shadow-md"
                          >
                            <Folder className="w-8 h-8 text-slate-400 fill-slate-100 group-hover:text-brown-500 group-hover:fill-brown-100 shrink-0 transition-colors" />
                            <div className="flex flex-col overflow-hidden">
                              <span className="text-[14px] font-bold text-slate-800 truncate">{title}</span>
                              <span className="text-[11px] font-mono text-slate-500">{family.no_kk_paroki || 'No KK Kosong'}</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </div>
            ) : (
              // FILE GRID VIEW
              <div>
                <h2 className="text-[14px] font-medium text-[#444746] mb-4 mt-2">Files</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {/* Foto Rumah */}
                  {selectedFolder.foto_rumah_url && (
                    <a href={selectedFolder.foto_rumah_url} target="_blank" rel="noreferrer" className="group flex flex-col bg-white hover:bg-slate-50 rounded-none overflow-hidden cursor-pointer transition-all border border-slate-200 hover:border-brown-300 shadow-sm hover:shadow-md">
                      <div className="bg-slate-100 h-40 relative flex items-center justify-center border-b border-slate-100">
                        <img src={selectedFolder.foto_rumah_url} className="w-full h-full object-cover" alt="Foto Rumah" />
                      </div>
                      <div className="p-4 flex items-center gap-3">
                        <ImageIcon className="w-5 h-5 text-rose-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-800 truncate">Foto Fisik Rumah</span>
                      </div>
                    </a>
                  )}

                  {/* KK */}
                  {selectedFolder.kk_url && (
                    <a href={selectedFolder.kk_url} target="_blank" rel="noreferrer" className="group flex flex-col bg-white hover:bg-slate-50 rounded-none overflow-hidden cursor-pointer transition-all border border-slate-200 hover:border-brown-300 shadow-sm hover:shadow-md">
                      <div className="bg-slate-100 h-40 relative flex items-center justify-center border-b border-slate-100">
                        {selectedFolder.kk_url.includes('.pdf') ? (
                          <FileText className="w-16 h-16 text-rose-500" />
                        ) : (
                          <img src={selectedFolder.kk_url} className="w-full h-full object-cover" alt="KK" />
                        )}
                      </div>
                      <div className="p-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-800 truncate">Kartu Keluarga</span>
                      </div>
                    </a>
                  )}

                  {/* Sacraments */}
                  {selectedFolder.Umats?.map(umat => 
                    umat.Sacraments?.filter((s: any) => s.sertifikat_url).map((sac: any) => (
                      <a key={sac.id} href={sac.sertifikat_url} target="_blank" rel="noreferrer" className="group flex flex-col bg-white hover:bg-slate-50 rounded-none overflow-hidden cursor-pointer transition-all border border-slate-200 hover:border-brown-300 shadow-sm hover:shadow-md">
                        <div className="bg-slate-100 h-40 relative flex items-center justify-center border-b border-slate-100">
                          {sac.sertifikat_url.includes('.pdf') ? (
                            <FileText className="w-16 h-16 text-blue-500" />
                          ) : (
                            <img src={sac.sertifikat_url} className="w-full h-full object-cover" alt="Sertifikat" />
                          )}
                        </div>
                        <div className="p-4 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span className="text-sm font-bold text-slate-800 truncate" title={`Sertifikat ${sac.jenis_sakramen}`}>
                              Sertifikat {sac.jenis_sakramen}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 truncate ml-6">{umat.nama_lengkap}</span>
                        </div>
                      </a>
                    ))
                  )}

                  {!selectedFolder.foto_rumah_url && !selectedFolder.kk_url && !selectedFolder.Umats?.some(u => u.Sacraments?.some((s: any) => s.sertifikat_url)) && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400">
                      <Folder className="w-16 h-16 mb-4 fill-slate-100 text-slate-300" />
                      <p>Folder keluarga ini kosong.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

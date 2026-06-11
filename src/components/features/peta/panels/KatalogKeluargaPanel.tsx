// src/components/features/peta/panels/KatalogKeluargaPanel.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Users, ChevronRight, Home, MapPin, AlertCircle } from "lucide-react";

import { useGisUmatStore } from "@/store/useGisUmatStore";
import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData } from "@/types/keluarga";

// IMPORT MOCK DATA KITA
import { dummyKeluargaGis } from "@/lib/dummyGisData";

// Helper untuk ekstrak Kepala Keluarga
const getKepalaKeluarga = (umats?: any[]) => {
    return umats?.find((u) => u.status_dalam_keluarga === 'KK')?.nama_lengkap
        || umats?.[0]?.nama_lengkap
        || 'Tanpa Nama';
};

export default function KatalogKeluargaPanel() {
    const { openPanel, selectedFamilyId, setSelectedFamilyId } = useGisUmatStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [families, setFamilies] = useState<KeluargaData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Data + Merge dengan Mock Data
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const loadData = async () => {
            try {
                const res = await keluargaService.getAll({ limit: 5000 });
                if (isMounted && res.success) {
                    // MENGGABUNGKAN DATA RIIL API + MOCK DATA DUMMY
                    const combinedData = [...res.data, ...dummyKeluargaGis];
                    setFamilies(combinedData);
                }
            } catch (error) {
                console.error("Gagal memuat katalog keluarga:", error);
                // JIKA API MATI/GAGAL, TETAP TAMPILKAN MOCK DATA
                if (isMounted) setFamilies(dummyKeluargaGis);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, []);

    // Filter Search
    const filteredFamilies = useMemo(() => {
        if (!searchQuery) return families;
        const lowerQuery = searchQuery.toLowerCase();

        return families.filter((f) => {
            const kepala = getKepalaKeluarga(f.Umats).toLowerCase();
            const noKk = (f.no_kk_paroki || "").toLowerCase();
            return kepala.includes(lowerQuery) || noKk.includes(lowerQuery);
        });
    }, [searchQuery, families]);

    // Handle Klik Baris
    const handleFamilyClick = (family: KeluargaData) => {
        setSelectedFamilyId(family.id);

        if (family.latitude !== null && family.longitude !== null) {
            window.dispatchEvent(
                new CustomEvent("map-fly-to-coords", {
                    detail: { lat: family.latitude, lng: family.longitude },
                })
            );
        }

        openPanel("detil-keluarga", `Kel. ${getKepalaKeluarga(family.Umats)}`, family);
    };

    return (
        <div className="flex flex-col h-full bg-white pb-10 text-slate-800">
            <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm">
                <div className="relative group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brown-600 transition-colors"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Cari Nama KK atau No. Paroki..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none py-1.5 pl-8 pr-3 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-brown-500 focus:ring-1 focus:ring-brown-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="px-4 py-3 bg-brown-50/50 border-b border-slate-200 flex items-start gap-2.5">
                    <MapPin size={14} className="text-brown-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                        Menampilkan <span className="font-bold text-slate-800">{families.length}</span> keluarga terdaftar.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col">
                        {[1, 2, 3, 4].map((n) => (
                            <div key={n} className="px-4 py-4 border-b border-slate-100 flex gap-3 bg-white animate-pulse">
                                <div className="w-8 h-8 bg-slate-200 rounded-none" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-200 w-3/4" />
                                    <div className="h-2 bg-slate-100 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredFamilies.length > 0 ? (
                    filteredFamilies.map((family) => {
                        const isActive = selectedFamilyId === family.id;
                        const kepalaKeluarga = getKepalaKeluarga(family.Umats);
                        const totalAnggota = family.Umats?.length || 0;
                        const hasGps = family.latitude !== null && family.longitude !== null;

                        return (
                            <button
                                key={family.id}
                                onClick={() => handleFamilyClick(family)}
                                className={`group flex items-center justify-between px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition-colors text-left w-full outline-none
                  ${isActive ? "bg-brown-50/40 border-l-[3px] border-l-brown-600" : "bg-white border-l-[3px] border-l-transparent"}
                `}
                            >
                                <div className="flex items-start gap-3 min-w-0 pr-2">
                                    <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border transition-colors
                    ${isActive ? "bg-brown-600 text-white border-brown-700" : "bg-slate-100 text-slate-400 border-slate-200 group-hover:text-brown-600"}
                  `}>
                                        <Home size={14} />
                                    </div>

                                    <div className="flex flex-col gap-0.5 truncate">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-[12px] truncate transition-colors ${isActive ? 'text-brown-900 font-bold' : 'text-slate-800 font-semibold group-hover:text-slate-900'}`}>
                                                Kel. {kepalaKeluarga}
                                            </h4>
                                            {!hasGps && (
                                                <span className="bg-rose-100 text-rose-700 border border-rose-200 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm flex items-center gap-1">
                                                    <AlertCircle size={8} /> No GPS
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                                            <span>{family.no_kk_paroki || "NON-KK"}</span>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1"><Users size={10} /> {totalAnggota} Jiwa</span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight
                                    size={16}
                                    className={`shrink-0 transition-transform ${isActive ? "text-brown-600 translate-x-1" : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1"}`}
                                />
                            </button>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 px-4">
                        <div className="w-12 h-12 rounded-none bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                            <Search size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-bold text-slate-700">Keluarga Tidak Ditemukan</p>
                            <p className="text-[11px] text-slate-500 font-normal">Pastikan nama yang Anda cari benar</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
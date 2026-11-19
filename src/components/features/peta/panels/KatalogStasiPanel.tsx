// src/components/features/peta/panels/KatalogStasiPanel.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin, ChevronRight, Map } from "lucide-react";

import { useGisUmatStore } from "@/store/useGisUmatStore";
import { stasiService, StasiData } from "@/services/stasi.service";

export default function KatalogStasiPanel() {
    const { setSelectedStasiId, setSelectedKbgId, setSelectedFamilyId, selectedStasiId } = useGisUmatStore();

    const [searchQuery, setSearchQuery] = useState("");
    const [stasis, setStasis] = useState<StasiData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);

        const loadData = async () => {
            try {
                const res = await stasiService.getAll();
                if (isMounted && res.success) {
                    setStasis(res.data);
                }
            } catch (error) {
                console.error("Gagal memuat katalog stasi:", error);
                if (isMounted) setStasis([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();
        return () => { isMounted = false; };
    }, []);

    const filteredStasis = useMemo(() => {
        let result = stasis;
        if (!searchQuery) return result;
        const lowerQuery = searchQuery.toLowerCase();

        return result.filter((s) => {
            const nama = (s.nama_stasi || "").toLowerCase();
            const kode = (s.kode_stasi || "").toLowerCase();
            return nama.includes(lowerQuery) || kode.includes(lowerQuery);
        });
    }, [searchQuery, stasis]);

    const handleStasiClick = (stasi: StasiData) => {
        setSelectedStasiId(stasi.id);
        setSelectedKbgId(null);
        setSelectedFamilyId(null);

        if (stasi.latitude !== null && stasi.longitude !== null) {
            window.dispatchEvent(
                new CustomEvent("map-fly-to-coords", {
                    detail: { lat: parseFloat(stasi.latitude as unknown as string), lng: parseFloat(stasi.longitude as unknown as string), zoom: 14 },
                })
            );
        }
    };

    return (
        <div className="flex flex-col h-full bg-white pb-10 text-slate-800">
            {selectedStasiId && (
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">Mode Detail Stasi Aktif</span>
                    <button 
                        onClick={() => {
                            setSelectedStasiId(null);
                            setSelectedKbgId(null);
                            setSelectedFamilyId(null);
                            window.dispatchEvent(new Event("map-reset-view"));
                        }}
                        className="text-[10px] font-bold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-sm transition-colors"
                    >
                        Tampilkan Semua Stasi
                    </button>
                </div>
            )}

            <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm">
                <div className="relative group">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-600 transition-colors"
                        size={14}
                    />
                    <input
                        type="text"
                        placeholder="Cari Nama Stasi atau Kode..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-none py-1.5 pl-8 pr-3 text-[12px] font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
                <div className="px-4 py-3 bg-amber-50/50 border-b border-slate-200 flex items-start gap-2.5">
                    <MapPin size={14} className="text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                        Menampilkan <span className="font-bold text-slate-800">{stasis.length}</span> stasi di Paroki.
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex flex-col">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="px-4 py-4 border-b border-slate-100 flex gap-3 bg-white animate-pulse">
                                <div className="w-8 h-8 bg-slate-200 rounded-none" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-slate-200 w-3/4" />
                                    <div className="h-2 bg-slate-100 w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredStasis.length > 0 ? (
                    filteredStasis.map((stasi) => {
                        const isActive = selectedStasiId === stasi.id;

                        return (
                            <button
                                key={stasi.id}
                                onClick={() => handleStasiClick(stasi)}
                                className={`group flex items-center justify-between px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition-colors text-left w-full outline-none
                  ${isActive ? "bg-amber-50/40 border-l-[3px] border-l-amber-600" : "bg-white border-l-[3px] border-l-transparent"}
                `}
                            >
                                <div className="flex items-start gap-3 min-w-0 pr-2">
                                    <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border transition-colors
                    ${isActive ? "bg-amber-600 text-white border-amber-700" : "bg-slate-100 text-slate-400 border-slate-200 group-hover:text-amber-600"}
                  `}>
                                        <Map size={14} />
                                    </div>

                                    <div className="flex flex-col gap-0.5 truncate">
                                        <div className="flex items-center gap-2">
                                            <h4 className={`text-[12px] truncate transition-colors ${isActive ? 'text-amber-900 font-bold' : 'text-slate-800 font-semibold group-hover:text-slate-900'}`}>
                                                {stasi.nama_stasi}
                                            </h4>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 uppercase tracking-wider mt-0.5">
                                            <span>KODE: {stasi.kode_stasi || "-"}</span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight
                                    size={16}
                                    className={`shrink-0 transition-transform ${isActive ? "text-amber-600 translate-x-1" : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1"}`}
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
                            <p className="text-[12px] font-bold text-slate-700">Stasi Tidak Ditemukan</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// src/components/features/peta/panels/KatalogWilayahPanel.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, MapPin, ChevronRight, Map, Home, Users, ArrowLeft, AlertCircle } from "lucide-react";

import { useGisUmatStore } from "@/store/useGisUmatStore";
import { stasiService, StasiData } from "@/services/stasi.service";
import { kbgService, KbgData } from "@/services/kbg.service";
import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData } from "@/types/keluarga";
import { usePathname } from "next/navigation";

// Helper untuk ekstrak Kepala Keluarga (seperti di KatalogKeluargaPanel)
const getKepalaKeluarga = (umats?: any[]) => {
    return umats?.find((u) => u.status_dalam_keluarga === 'KK')?.nama_lengkap
        || umats?.[0]?.nama_lengkap
        || 'Tanpa Nama';
};

export default function KatalogWilayahPanel() {
    const { 
        selectedStasiId, setSelectedStasiId, 
        selectedKbgId, setSelectedKbgId, 
        selectedFamilyId, setSelectedFamilyId 
    } = useGisUmatStore();
    const pathname = usePathname();

    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // State Data
    const [stasis, setStasis] = useState<StasiData[]>([]);
    const [kbgs, setKbgs] = useState<KbgData[]>([]);
    const [families, setFamilies] = useState<KeluargaData[]>([]);

    // Ambil data stasi (Selalu di awal)
    useEffect(() => {
        let isMounted = true;
        const loadStasis = async () => {
            if (!selectedStasiId) {
                setIsLoading(true);
                try {
                    const res = await stasiService.getAll();
                    if (isMounted && res.success) {
                        if (pathname !== "/peta-stasi") {
                            const virtualStasi: any = {
                                id: "stasi-non-stasi",
                                nama_stasi: "Keluarga Langsung Paroki",
                                kode_stasi: "P1",
                                latitude: -4.545,
                                longitude: 136.885
                            };
                            setStasis([virtualStasi, ...res.data]);
                        } else {
                            setStasis(res.data);
                            // Auto select stasi pertama jika berada di peta-stasi (admin stasi)
                            if (res.data.length > 0) {
                                setSelectedStasiId(res.data[0].id);
                                if (res.data[0].latitude !== null && res.data[0].longitude !== null) {
                                    window.dispatchEvent(new CustomEvent("map-fly-to-coords", {
                                        detail: { lat: parseFloat(res.data[0].latitude as unknown as string), lng: parseFloat(res.data[0].longitude as unknown as string), zoom: 14 },
                                    }));
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error("Gagal memuat stasi:", error);
                } finally {
                    if (isMounted) setIsLoading(false);
                }
            }
        };
        loadStasis();
        return () => { isMounted = false; };
    }, [selectedStasiId, pathname, setSelectedStasiId]);

    // Ambil data KBG jika Stasi terpilih
    useEffect(() => {
        let isMounted = true;
        const loadKbgs = async () => {
            if (selectedStasiId && selectedStasiId !== "stasi-non-stasi" && !selectedKbgId) {
                setIsLoading(true);
                try {
                    const res = await kbgService.getAll({ stasi_id: selectedStasiId });
                    if (isMounted && res.success) setKbgs(res.data);
                } catch (error) {
                    console.error("Gagal memuat kbg:", error);
                } finally {
                    if (isMounted) setIsLoading(false);
                }
            }
        };
        loadKbgs();
        return () => { isMounted = false; };
    }, [selectedStasiId, selectedKbgId]);

    // Ambil data Keluarga jika KBG terpilih
    useEffect(() => {
        let isMounted = true;
        const loadFamilies = async () => {
            if (selectedKbgId || selectedStasiId === "stasi-non-stasi") {
                setIsLoading(true);
                try {
                    const params: any = { limit: 5000 };
                    // Jangan kirim is_non_stasi ke backend, biarkan frontend yang filter
                    // karena sepertinya API call dengan parameter ini gagal atau di-cache

                    const res = await keluargaService.getAll(params);
                    if (isMounted && res.success) {
                        if (selectedStasiId === "stasi-non-stasi") {
                            setFamilies(res.data.filter((f: any) => f.is_non_stasi === true));
                        } else {
                            setFamilies(res.data.filter((f: any) => f.kbg_id === selectedKbgId));
                        }
                    }
                } catch (error) {
                    console.error("Gagal memuat keluarga:", error);
                } finally {
                    if (isMounted) setIsLoading(false);
                }
            }
        };
        loadFamilies();
        return () => { isMounted = false; };
    }, [selectedKbgId, selectedStasiId]);

    // Determine current mode
    const mode = (selectedKbgId || selectedStasiId === "stasi-non-stasi") ? "KELUARGA" : (selectedStasiId ? "KBG" : "STASI");

    // Clear search on mode change
    useEffect(() => {
        setSearchQuery("");
    }, [mode]);

    const filteredData = useMemo(() => {
        const lowerQuery = searchQuery.toLowerCase();
        
        if (mode === "STASI") {
            if (!searchQuery) return stasis;
            return stasis.filter((s) => (s.nama_stasi || "").toLowerCase().includes(lowerQuery) || (s.kode_stasi || "").toLowerCase().includes(lowerQuery));
        } 
        else if (mode === "KBG") {
            if (!searchQuery) return kbgs;
            return kbgs.filter((k) => (k.nama_kbg || "").toLowerCase().includes(lowerQuery) || (k.kode_kbg || "").toLowerCase().includes(lowerQuery));
        } 
        else {
            if (!searchQuery) return families;
            return families.filter((f) => {
                const kepala = getKepalaKeluarga(f.Umats).toLowerCase();
                const noKk = (f.no_kk_paroki || "").toLowerCase();
                return kepala.includes(lowerQuery) || noKk.includes(lowerQuery);
            });
        }
    }, [searchQuery, mode, stasis, kbgs, families]);

    // Handlers
    const handleStasiClick = (stasi: StasiData) => {
        setSelectedStasiId(stasi.id);
        setSelectedKbgId(null);
        setSelectedFamilyId(null);
        if (stasi.latitude !== null && stasi.longitude !== null) {
            window.dispatchEvent(new CustomEvent("map-fly-to-coords", {
                detail: { lat: parseFloat(stasi.latitude as unknown as string), lng: parseFloat(stasi.longitude as unknown as string), zoom: 14 },
            }));
        }
    };

    const handleKbgClick = (kbg: KbgData) => {
        setSelectedKbgId(kbg.id);
        setSelectedFamilyId(null);
        if (kbg.latitude !== null && kbg.longitude !== null) {
            window.dispatchEvent(new CustomEvent("map-fly-to-coords", {
                detail: { lat: parseFloat(kbg.latitude as unknown as string), lng: parseFloat(kbg.longitude as unknown as string), zoom: 16 },
            }));
        }
    };

    const handleFamilyClick = (family: KeluargaData) => {
        setSelectedFamilyId(family.id);
        if (family.latitude !== null && family.longitude !== null) {
            window.dispatchEvent(new CustomEvent("map-fly-to-coords", {
                detail: { lat: parseFloat(family.latitude as unknown as string), lng: parseFloat(family.longitude as unknown as string), zoom: 18 },
            }));
        }
    };

    // Renderers
    const renderHeader = () => {
        if (mode === "STASI") return null;

        const handleBack = () => {
            if (mode === "KELUARGA") {
                setSelectedKbgId(null);
                setSelectedFamilyId(null);
                
                if (selectedStasiId === "stasi-non-stasi") {
                    setSelectedStasiId(null);
                    window.dispatchEvent(new Event("map-reset-view"));
                } else {
                    // Kembalikan view ke stasi
                    const stasi = stasis.find(s => s.id === selectedStasiId);
                    if (stasi && stasi.latitude !== null && stasi.longitude !== null) {
                        window.dispatchEvent(new CustomEvent("map-fly-to-coords", {
                            detail: { lat: parseFloat(stasi.latitude as unknown as string), lng: parseFloat(stasi.longitude as unknown as string), zoom: 14 },
                        }));
                    } else {
                        window.dispatchEvent(new Event("map-reset-view"));
                    }
                }
            } else if (mode === "KBG") {
                if (pathname !== "/peta-stasi") {
                    setSelectedStasiId(null);
                    setSelectedKbgId(null);
                    setSelectedFamilyId(null);
                    window.dispatchEvent(new Event("map-reset-view"));
                }
            }
        };

        const activeStasi = stasis.find(s => s.id === selectedStasiId);
        const activeKbg = kbgs.find(k => k.id === selectedKbgId);

        // Di peta-stasi, jika sedang di mode KBG, jangan tampilkan tombol KEMBALI NAIK 
        // karena admin stasi tidak bisa kembali ke daftar stasi
        const hideBackButton = pathname === "/peta-stasi" && mode === "KBG";

        return (
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Sedang melihat:</span>
                    <span className="text-[11px] font-bold text-brown-700 truncate max-w-[150px]">
                        {mode === "KELUARGA" 
                            ? (selectedStasiId === "stasi-non-stasi" ? activeStasi?.nama_stasi : activeKbg?.nama_kbg) 
                            : activeStasi?.nama_stasi}
                    </span>
                </div>
                {!hideBackButton && (
                    <button 
                        onClick={handleBack}
                        className="flex items-center gap-1 text-[10px] font-bold text-white bg-brown-600 hover:bg-brown-700 px-3 py-1.5 rounded-sm transition-colors"
                    >
                        <ArrowLeft size={12} />
                        KEMBALI NAIK
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white pb-10 text-slate-800">
            {renderHeader()}

            <div className="px-4 py-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brown-600 transition-colors" size={14} />
                    <input
                        type="text"
                        placeholder={
                            mode === "STASI" ? "Cari Nama Stasi..." :
                            mode === "KBG" ? "Cari Nama KBG..." : "Cari Nama KK..."
                        }
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
                        Menampilkan <span className="font-bold text-slate-800">{filteredData.length}</span> {mode.toLowerCase()} terdaftar.
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
                ) : filteredData.length > 0 ? (
                    filteredData.map((item: any) => {
                        
                        if (mode === "STASI") {
                            const stasi = item as StasiData;
                            const isVirtual = stasi.id === "stasi-non-stasi";
                            
                            return (
                                <button
                                    key={stasi.id}
                                    onClick={() => handleStasiClick(stasi)}
                                    className={`group flex items-center justify-between px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition-colors text-left w-full outline-none bg-white border-l-[3px] border-l-transparent`}
                                >
                                    <div className="flex items-start gap-3 min-w-0 pr-2">
                                        <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border transition-colors ${
                                            isVirtual 
                                                ? "bg-slate-100 text-slate-600 border-slate-300 group-hover:bg-slate-600 group-hover:text-white"
                                                : "bg-amber-50 text-amber-600 border-amber-200 group-hover:bg-amber-600 group-hover:text-white"
                                        }`}>
                                            {isVirtual ? <Users size={14} /> : <Map size={14} />}
                                        </div>
                                        <div className="flex flex-col gap-0.5 truncate mt-1">
                                            <h4 className={`text-[12px] truncate transition-colors font-semibold ${
                                                isVirtual ? "text-slate-700 group-hover:text-slate-900" : "text-slate-800 group-hover:text-amber-900"
                                            }`}>
                                                {stasi.nama_stasi}
                                            </h4>
                                            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">KODE: {stasi.kode_stasi || "-"}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className={`shrink-0 transition-transform text-slate-300 group-hover:translate-x-1 ${
                                        isVirtual ? "group-hover:text-slate-600" : "group-hover:text-amber-500"
                                    }`} />
                                </button>
                            );
                        }

                        if (mode === "KBG") {
                            const kbg = item as KbgData;
                            return (
                                <button
                                    key={kbg.id}
                                    onClick={() => handleKbgClick(kbg)}
                                    className={`group flex items-center justify-between px-4 py-3 border-b border-slate-200 hover:bg-slate-50 transition-colors text-left w-full outline-none bg-white border-l-[3px] border-l-transparent`}
                                >
                                    <div className="flex items-start gap-3 min-w-0 pr-2">
                                        <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border transition-colors bg-brown-50 text-brown-600 border-brown-200 group-hover:bg-brown-600 group-hover:text-white`}>
                                            <Users size={14} />
                                        </div>
                                        <div className="flex flex-col gap-0.5 truncate mt-1">
                                            <h4 className="text-[12px] truncate transition-colors text-slate-800 font-semibold group-hover:text-brown-900">
                                                {kbg.nama_kbg}
                                            </h4>
                                            <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">KODE: {kbg.kode_kbg || "-"}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="shrink-0 transition-transform text-slate-300 group-hover:text-brown-500 group-hover:translate-x-1" />
                                </button>
                            );
                        }

                        // MODE KELUARGA
                        const family = item as KeluargaData;
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
                                            <span className="flex items-center gap-1"><Users size={10} /> {totalAnggota} Anggota</span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight size={16} className={`shrink-0 transition-transform ${isActive ? "text-brown-600 translate-x-1" : "text-slate-300 group-hover:text-slate-500 group-hover:translate-x-1"}`} />
                            </button>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 px-4">
                        <div className="w-12 h-12 rounded-none bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-200">
                            <Search size={20} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[12px] font-bold text-slate-700">Data Tidak Ditemukan</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

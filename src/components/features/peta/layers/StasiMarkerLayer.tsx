"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Marker, useMapEvents, Tooltip, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Home, Users, Fingerprint, ChevronRight } from "lucide-react";

import { kbgService, KbgData } from "@/services/kbg.service";
import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData } from "@/types/keluarga";
import { useGisUmatStore } from "@/store/useGisUmatStore";

import { createPolymorphicMarker, createClusterIcon } from "../utils/gisColorMath";

// Custom Icon untuk Pin KBG
const kbgIcon = L.divIcon({
    className: "kbg-marker",
    html: `
        <div class="relative flex flex-col items-center justify-center">
            <div class="w-12 h-12 bg-brown-700 border-2 border-white rounded-full flex items-center justify-center shadow-lg shadow-black/50 z-10 hover:scale-110 transition-transform">
                <span class="text-white font-black text-xs tracking-tighter">KBG</span>
            </div>
            <div class="absolute -bottom-2 w-2 h-2 bg-brown-700 rotate-45"></div>
        </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
});

export default function StasiMarkerLayer() {
    const markerMode = useGisUmatStore((state) => state.markerMode);
    const selectedFamilyId = useGisUmatStore((state) => state.selectedFamilyId);
    const setSelectedFamilyId = useGisUmatStore((state) => state.setSelectedFamilyId);
    const selectedKbgId = useGisUmatStore((state) => state.selectedKbgId);
    const setSelectedKbgId = useGisUmatStore((state) => state.setSelectedKbgId);
    const openPanel = useGisUmatStore((state) => state.openPanel);
    const closePanelsToTheRight = useGisUmatStore((state) => state.closePanelsToTheRight);

    const [kbgs, setKbgs] = useState<KbgData[]>([]);
    const [families, setFamilies] = useState<KeluargaData[]>([]);
    
    // Simpan referensi ke semua marker keluarga untuk auto-open popup
    const markerRefs = useRef<Record<string, L.Marker | null>>({});
    
    // Timer untuk menunda penutupan popup saat kursor berpindah
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    // Buka popup secara otomatis jika keluarga dipilih dari sidebar
    useEffect(() => {
        if (selectedFamilyId && markerRefs.current[selectedFamilyId]) {
            markerRefs.current[selectedFamilyId]?.openPopup();
        }
    }, [selectedFamilyId]);

    // Fetch data KBG dan Keluarga
    useEffect(() => {
        const fetchData = async () => {
            try {
                const kbgRes = await kbgService.getAll();
                if (kbgRes.success) setKbgs(kbgRes.data);

                const familyRes = await keluargaService.getAll({ limit: 5000 });
                if (familyRes.success) setFamilies(familyRes.data);
            } catch (error) {
                console.error("Gagal menarik data spasial Stasi:", error);
            }
        };
        fetchData();
    }, []);

    const validKbgs = useMemo(() => {
        return kbgs.filter((kbg) => kbg.latitude !== null && kbg.longitude !== null);
    }, [kbgs]);

    const activeFamilies = useMemo(() => {
        if (!selectedKbgId) return [];
        if (selectedKbgId === 'ALL') {
            return families.filter((f) => f.latitude !== null && f.longitude !== null);
        }
        return families.filter((f) => f.kbg_id === selectedKbgId && f.latitude !== null && f.longitude !== null);
    }, [families, selectedKbgId]);

    // Handle zoom out to return to KBG view
    useMapEvents({
        zoomend: (e) => {
            // Jika zoom level terlalu jauh (misal < 15), kembali ke mode KBG (kecuali sedang mode ALL)
            if (e.target.getZoom() < 15 && selectedKbgId !== null && selectedKbgId !== 'ALL') {
                setSelectedKbgId(null);
                closePanelsToTheRight(-1); // Tutup panel detail
            }
        }
    });

    const handleKbgClick = (kbg: KbgData, e: L.LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();
        setSelectedKbgId(kbg.id);
        
        window.dispatchEvent(
            new CustomEvent("map-fly-to-coords", {
                detail: { lat: kbg.latitude, lng: kbg.longitude },
            })
        );
    };

    const handleFamilyClick = (family: KeluargaData, e: L.LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();
        setSelectedFamilyId(family.id);

        window.dispatchEvent(
            new CustomEvent("map-fly-to-coords", {
                detail: { lat: family.latitude, lng: family.longitude },
            })
        );
    };

    // MODE 1: TAMPILKAN PIN KBG (Default)
    if (selectedKbgId === null) {
        return (
            <MarkerClusterGroup
                chunkedLoading
                iconCreateFunction={createClusterIcon}
                maxClusterRadius={40}
            >
                {validKbgs.map((kbg) => (
                    <Marker
                        key={kbg.id}
                        position={[kbg.latitude as number, kbg.longitude as number]}
                        icon={kbgIcon}
                        eventHandlers={{ click: (e) => handleKbgClick(kbg, e) }}
                    >
                        <Tooltip direction="top" offset={[0, -48]} opacity={1} permanent={false}>
                            <div className="font-bold text-slate-800 text-xs">{kbg.nama_kbg}</div>
                            <div className="text-[10px] text-slate-500">{kbg.kode_kbg}</div>
                        </Tooltip>
                    </Marker>
                ))}
            </MarkerClusterGroup>
        );
    }
    // MODE 2: TAMPILKAN PIN KELUARGA DALAM KBG TERSEBUT
    return (
        <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterIcon}
            maxClusterRadius={60}
        >
            {activeFamilies.map((family) => {
                const isSelected = selectedFamilyId === family.id;
                const kepalaKeluarga = family.Umats?.find((u: any) => u.status_dalam_keluarga === 'KK')?.nama_lengkap 
                    || family.Umats?.[0]?.nama_lengkap || 'Tanpa Nama';
                    
                return (
                    <Marker
                        key={family.id}
                        position={[family.latitude as number, family.longitude as number]}
                        icon={createPolymorphicMarker(family, markerMode, isSelected)}
                        ref={(r) => { markerRefs.current[family.id] = r; }}
                        eventHandlers={{ 
                            click: (e) => handleFamilyClick(family, e),
                            mouseover: (e) => {
                                if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                                e.target.openPopup();
                            },
                            mouseout: (e) => {
                                hoverTimeout.current = setTimeout(() => {
                                    e.target.closePopup();
                                }, 300);
                            }
                        }}
                    >
                        <Popup closeButton={true} className="min-w-[220px]">
                            <div 
                                className="flex flex-col font-sans -mx-2 -mt-1"
                                onMouseEnter={() => {
                                    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
                                }}
                                onMouseLeave={() => {
                                    markerRefs.current[family.id]?.closePopup();
                                }}
                            >
                                {/* Header */}
                                <div className="flex items-center gap-2.5 pb-2 mb-2 border-b border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-brown-50 text-brown-600 border border-brown-100 flex items-center justify-center shrink-0">
                                        <Home size={14} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex flex-col min-w-0 pr-4">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Kepala Keluarga</span>
                                        <h4 className="font-bold text-[13px] text-slate-800 leading-tight truncate">
                                            Kel. {kepalaKeluarga}
                                        </h4>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="flex flex-col gap-2.5 mb-3">
                                    <div className="flex items-start gap-2 bg-slate-50 p-1.5 rounded-md border border-slate-100">
                                        <Fingerprint size={12} className="text-slate-400 mt-0.5 shrink-0" />
                                        <div className="flex flex-col">
                                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Kode Unik Registrasi</span>
                                            <span className="text-[11px] font-mono font-black text-brown-700 tracking-wider">
                                                {family.kode_unik_keluarga || 'BELUM TERBIT'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">No. Paroki</span>
                                            <span className="text-[11px] font-semibold text-slate-700 truncate">{family.no_kk_paroki || '-'}</span>
                                        </div>
                                        <div className="flex flex-col border-l border-slate-100 pl-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase">Jumlah Umat</span>
                                            <span className="text-[12px] font-black text-slate-700 flex items-center gap-1">
                                                <Users size={10} className="text-brown-500" /> {family.Umats?.length || 0} <span className="text-[9px] font-medium text-slate-400">Anggota</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <button 
                                    onClick={() => {
                                        markerRefs.current[family.id]?.closePopup();
                                        openPanel("detil-keluarga", `Kel. ${kepalaKeluarga}`, family);
                                    }}
                                    className="group w-full flex items-center justify-center gap-1.5 bg-brown-600 hover:bg-brown-700 text-white py-2 px-3 rounded-md transition-all shadow-sm"
                                >
                                    <span className="text-[11px] font-bold tracking-wide">LIHAT DETAIL</span>
                                    <ChevronRight size={14} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MarkerClusterGroup>
    );
}

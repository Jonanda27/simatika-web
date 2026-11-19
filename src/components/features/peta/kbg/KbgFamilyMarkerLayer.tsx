// src/components/features/peta/kbg/KbgFamilyMarkerLayer.tsx
"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { Home, Users, Fingerprint, ChevronRight } from "lucide-react";

import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData } from "@/types/keluarga";
import { useGisUmatStore } from "@/store/useGisUmatStore";

import { useAuth } from "@/context/AuthContext";
import { kbgPengurusService } from "@/services/kbgPengurus.service";

// 1. IMPORT DARI PURE FABRICATION UTILS (Logika Warna Dipisah)
import { createPolymorphicMarker, createClusterIcon } from "../utils/gisColorMath";

// Helper internal untuk ekstrak Kepala Keluarga
const getKepalaKeluarga = (umats?: any[]) => {
    return umats?.find((u) => u.status_dalam_keluarga === 'KK')?.nama_lengkap
        || umats?.[0]?.nama_lengkap
        || 'Tanpa Nama';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function KbgFamilyMarkerLayer() {
    const { user } = useAuth();
    const {
        markerMode,
        stasiFilterMode,
        selectedFamilyId,
        setSelectedFamilyId,
        openPanel,
        closePanelsToTheRight
    } = useGisUmatStore();

    const [families, setFamilies] = useState<KeluargaData[]>([]);
    const [pengurusIds, setPengurusIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const markerRefs = useRef<Record<string, L.Marker | null>>({});
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    // Auto-open popup when selected from sidebar
    useEffect(() => {
        if (selectedFamilyId && markerRefs.current[selectedFamilyId]) {
            markerRefs.current[selectedFamilyId]?.openPopup();
        }
    }, [selectedFamilyId]);

    // FETCH DATA SECARA MANDIRI (Information Expert)
    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                // Tarik data dengan limit besar khusus untuk pemetaan koordinat
                const res = await keluargaService.getAll({ limit: 5000 });
                if (isMounted && res.success) {
                    setFamilies(res.data);
                }
                // Fetch Pengurus KBG
                if (user?.id_kbg) {
                    const resPengurus = await kbgPengurusService.getByKbgId(user.id_kbg);
                    if (isMounted && resPengurus.success && resPengurus.data) {
                        const activeIds = resPengurus.data.filter(p => p.is_active).map(p => p.umat_id);
                        setPengurusIds(activeIds);
                    }
                }
            } catch (error) {
                console.error("Gagal menarik data pemetaan:", error);
                if (isMounted) setFamilies([]);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchData();
        return () => { isMounted = false; };
    }, [user?.id_kbg]);

    // Filter hanya keluarga yang memiliki koordinat valid dan sesuai dengan filter stasi
    const validFamilies = useMemo(() => {
        return families.filter((f) => {
            if (f.latitude === null || f.longitude === null) return false;
            const isNonStasi = f.is_non_stasi || !f.Kbg?.stasi_id;
            if (stasiFilterMode === 'has_stasi' && isNonStasi) return false;
            if (stasiFilterMode === 'no_stasi' && !isNonStasi) return false;
            return true;
        });
    }, [families, stasiFilterMode]);

    // Handler klik titik marker
    const handleMarkerClick = (family: KeluargaData, e: L.LeafletMouseEvent) => {
        e.originalEvent.stopPropagation();

        // 1. Catat ke State Global bahwa rumah ini dipilih (merubah gaya pin menjadi berkedip)
        setSelectedFamilyId(family.id);

        // 2. Kirim Event Kamera agar peta terbang mulus mendekati rumah ini
        window.dispatchEvent(
            new CustomEvent("map-fly-to-coords", {
                detail: { lat: family.latitude, lng: family.longitude },
            })
        );

        // 3. Bersihkan laci/panel lama, dan buka laci Detail Keluarga dari samping
        closePanelsToTheRight(-1);
        const kepalaKeluarga = getKepalaKeluarga(family.Umats);
        openPanel("detil-keluarga", `Kel. ${kepalaKeluarga}`, family);
    };

    if (isLoading || validFamilies.length === 0) return null;

    return (
        <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterIcon}
            showCoverageOnHover={false}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={true}
        >
            {validFamilies.map((family) => {
                const isSelected = selectedFamilyId === family.id;
                const isPengurus = family.Umats?.some(u => pengurusIds.includes(u.id)) || false;

                const kepalaKeluarga = family.Umats?.find((u: any) => u.status_dalam_keluarga === 'KK')?.nama_lengkap 
                    || family.Umats?.[0]?.nama_lengkap || 'Tanpa Nama';

                return (
                    <Marker
                        key={family.id}
                        position={[family.latitude as number, family.longitude as number]}
                        icon={createPolymorphicMarker(family, markerMode, isSelected, isPengurus)}
                        ref={(r) => { markerRefs.current[family.id] = r; }}
                        eventHandlers={{
                            click: (e) => handleMarkerClick(family, e),
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

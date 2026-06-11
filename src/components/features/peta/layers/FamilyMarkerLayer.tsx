// src/components/features/peta/layers/FamilyMarkerLayer.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Marker } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";

import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData } from "@/types/keluarga";
import { useGisUmatStore } from "@/store/useGisUmatStore";

// 1. IMPORT DARI PURE FABRICATION UTILS (Logika Warna Dipisah)
import { createPolymorphicMarker, createClusterIcon } from "../utils/gisColorMath";

// 2. IMPORT MOCK DATA (Untuk Testing UI)
import { dummyKeluargaGis } from "@/lib/dummyGisData";

// Helper internal untuk ekstrak Kepala Keluarga
const getKepalaKeluarga = (umats?: any[]) => {
    return umats?.find((u) => u.status_dalam_keluarga === 'KK')?.nama_lengkap
        || umats?.[0]?.nama_lengkap
        || 'Tanpa Nama';
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FamilyMarkerLayer() {
    const {
        markerMode,
        selectedFamilyId,
        setSelectedFamilyId,
        openPanel,
        closePanelsToTheRight
    } = useGisUmatStore();

    const [families, setFamilies] = useState<KeluargaData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // FETCH DATA SECARA MANDIRI (Information Expert)
    useEffect(() => {
        let isMounted = true;
        const fetchFamilies = async () => {
            try {
                // Tarik data dengan limit besar khusus untuk pemetaan koordinat
                const res = await keluargaService.getAll({ limit: 5000 });
                if (isMounted && res.success) {
                    // MENGGABUNGKAN DATA RIIL API + MOCK DATA DUMMY
                    const combinedData = [...res.data, ...dummyKeluargaGis];
                    setFamilies(combinedData);
                }
            } catch (error) {
                console.error("Gagal menarik data titik koordinat:", error);
                // JIKA API MATI/GAGAL, TETAP TAMPILKAN MOCK DATA
                if (isMounted) setFamilies(dummyKeluargaGis);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchFamilies();
        return () => { isMounted = false; };
    }, []);

    // Filter hanya keluarga yang memiliki koordinat valid
    const validFamilies = useMemo(() => {
        return families.filter((f) => f.latitude !== null && f.longitude !== null);
    }, [families]);

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

                return (
                    <Marker
                        key={family.id}
                        position={[family.latitude as number, family.longitude as number]}
                        // Menggunakan fungsi pembuat ikon dari utils gisColorMath
                        icon={createPolymorphicMarker(family, markerMode, isSelected)}
                        eventHandlers={{
                            click: (e) => handleMarkerClick(family, e),
                        }}
                    />
                );
            })}
        </MarkerClusterGroup>
    );
}
// src/components/features/peta/layers/BoundaryMaskLayer.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { GeoJSON, Polygon } from "react-leaflet";
import { useGisUmatStore } from "@/store/useGisUmatStore";

/**
 * BoundaryMaskLayer - Fokus Visual Tingkat Keuskupan/Dekenat
 * Memuat batas wilayah Kabupaten Mimika (18 Distrik), membolongi area tersebut
 * agar terang, dan menggelapkan area di luar kabupaten (laut & kabupaten lain).
 */
export default function BoundaryMaskLayer() {
    const { maskOpacity } = useGisUmatStore();
    const [geoData, setGeoData] = useState<any>(null);

    // Mengambil file batas wilayah dari public/mimika_18_distrik.json
    useEffect(() => {
        let isMounted = true;

        fetch("/mimika_18_distrik.json")
            .then((res) => {
                if (!res.ok) throw new Error("File batas wilayah tidak ditemukan.");
                return res.json();
            })
            .then((data) => {
                if (isMounted) setGeoData(data);
            })
            .catch((err) => {
                console.warn("Masking wilayah dimatikan. Peringatan: ", err.message);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    // Membangun "Inverted Polygon" (Dunia - Wilayah Mimika)
    const invertedMaskCoordinates = useMemo(() => {
        if (!geoData || !geoData.features) return [];

        // Membuat batas poligon sebesar seluruh dunia
        const worldBounds: [number, number][] = [
            [90, -360],
            [90, 360],
            [-90, 360],
            [-90, -360],
        ];

        const innerHoles: [number, number][][] = [];

        // Melubangi SEMUA distrik yang ada di file JSON
        geoData.features.forEach((feature: any) => {
            const geometry = feature.geometry;
            if (!geometry) return;

            if (geometry.type === "Polygon") {
                // GeoJSON menggunakan [Longitude, Latitude], Leaflet butuh [Latitude, Longitude]
                const ring = geometry.coordinates[0].map(
                    (c: number[]) => [c[1], c[0]] as [number, number]
                );
                innerHoles.push(ring);
            } else if (geometry.type === "MultiPolygon") {
                geometry.coordinates.forEach((polygon: any[][]) => {
                    const ring = polygon[0].map(
                        (c: number[]) => [c[1], c[0]] as [number, number]
                    );
                    innerHoles.push(ring);
                });
            }
        });

        return [worldBounds, ...innerHoles];
    }, [geoData]);

    if (!geoData) return null;

    return (
        <>
            {/* Layer 1: Inverted Polygon (Penggelap Area Luar Kabupaten Mimika) */}
            {invertedMaskCoordinates.length > 0 && (
                <Polygon
                    positions={invertedMaskCoordinates}
                    pathOptions={{
                        fillColor: "#000000", // Warna hitam absolut
                        fillOpacity: maskOpacity / 100, // Dikendalikan oleh slider di BasemapLayerPanel
                        stroke: false,
                        interactive: false, // Tidak menghalangi interaksi klik di peta
                    }}
                />
            )}

            {/* Layer 2: Garis Batas Wilayah Distrik (Outline Tegas untuk ke-18 Distrik) */}
            <GeoJSON
                data={geoData}
                style={{
                    color: "#8d6e63",  // Warna Coklat Khas SIMATIKA
                    weight: 1.5,       // Garis sedikit lebih tipis agar tidak menutupi marker
                    fillOpacity: 0,    // Dalam wilayah distrik dibuat transparan 100%
                    dashArray: "4, 4", // Garis putus-putus
                    interactive: false,
                }}
            />
        </>
    );
}
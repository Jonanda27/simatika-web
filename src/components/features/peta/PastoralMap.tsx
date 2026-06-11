// src/components/features/peta/PastoralMap.tsx
"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useGisUmatStore } from "@/store/useGisUmatStore";
import FamilyMarkerLayer from "./layers/FamilyMarkerLayer";
import BoundaryMaskLayer from "./layers/BoundaryMaskLayer";

// --- Fix Leaflet Default Icon Issue di Next.js menggunakan CDN ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// ============================================================================
// MAP CONTROLLERS (Information Expert & Low Coupling)
// ============================================================================

/**
 * Controller 1: Menyadap event Leaflet (Zoom/Pan) dan melemparnya ke Global Store.
 * Tujuannya agar HUD / Elemen UI lain tahu peta sedang di posisi mana.
 */
function MapEventsTracker() {
    const { setMapZoom, setMapCenter } = useGisUmatStore();

    useMapEvents({
        zoomend: (e) => {
            setMapZoom(e.target.getZoom());
        },
        moveend: (e) => {
            const center = e.target.getCenter();
            setMapCenter([center.lat, center.lng]);
        },
    });

    return null;
}

/**
 * Controller 2: Mendengarkan Sinyal Eksternal (Custom Events) untuk menggerakkan kamera.
 * Memisahkan logika Leaflet murni dari event UI React.
 */
function ExternalKameraController() {
    const map = useMap();

    useEffect(() => {
        const handleZoomIn = () => map.zoomIn();
        const handleZoomOut = () => map.zoomOut();
        const handleResetView = () => map.setView([-4.545, 136.885], 13, { animate: true });

        // Event khusus untuk terbang (fly) ke koordinat rumah keluarga yang diklik
        const handleFlyToCoords = (e: Event) => {
            const customEvent = e as CustomEvent<{ lat: number; lng: number }>;
            const { lat, lng } = customEvent.detail;
            // Terbang perlahan ke titik koordinat, dengan zoom level 17 (Cukup dekat untuk melihat atap rumah)
            map.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
        };

        window.addEventListener("map-zoom-in", handleZoomIn);
        window.addEventListener("map-zoom-out", handleZoomOut);
        window.addEventListener("map-reset-view", handleResetView);
        window.addEventListener("map-fly-to-coords", handleFlyToCoords);

        return () => {
            window.removeEventListener("map-zoom-in", handleZoomIn);
            window.removeEventListener("map-zoom-out", handleZoomOut);
            window.removeEventListener("map-reset-view", handleResetView);
            window.removeEventListener("map-fly-to-coords", handleFlyToCoords);
        };
    }, [map]);

    return null;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function PastoralMap() {
    const { activeBaseMap, mapOpacity } = useGisUmatStore();

    // Resolusi Tile URL berdasarkan mode yang dipilih (Dark, Satellite, Street, OSM)
    const getTileUrl = () => {
        switch (activeBaseMap) {
            case "dark":
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
            case "satellite":
                return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
            case "street":
                return "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}";
            case "osm":
                return "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
            default:
                return "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
        }
    };

    return (
        <div className="absolute inset-0 z-0 bg-slate-950">
            <MapContainer
                center={[-4.545, 136.885]} // Titik pusat awal (Timika)
                zoom={13}
                zoomControl={false} // Dimatikan karena kita akan membuat MapHUD sendiri (Z-30)
                style={{ height: "100%", width: "100%", opacity: mapOpacity / 100 }}
            >
                <MapEventsTracker />
                <ExternalKameraController />

                {/* Lapisan Dasar Peta (Basemap) */}
                <TileLayer
                    attribution='&copy; Keuskupan Timika GIS | Data by OSM & Google'
                    url={getTileUrl()}
                    maxZoom={20}
                />

                {/* Masking Gelap Area Luar Paroki */}
                <BoundaryMaskLayer />

                {/* Lapisan Marker Titik Umat/Keluarga (Decoupled & Highly Cohesive) */}
                <FamilyMarkerLayer />

            </MapContainer>
        </div>
    );
}
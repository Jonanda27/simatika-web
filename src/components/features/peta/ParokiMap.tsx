// src/components/features/peta/ParokiMap.tsx
"use client";


import React, { useEffect } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useGisUmatStore } from "@/store/useGisUmatStore";
import BoundaryMaskLayer from "@/components/features/peta/layers/BoundaryMaskLayer";
import ParokiMarkerLayer from "@/components/features/peta/layers/ParokiMarkerLayer";

// --- Fix Leaflet Default Icon Issue di Next.js menggunakan CDN ---
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

function MapEventsTracker() {
    const setMapZoom = useGisUmatStore((state) => state.setMapZoom);
    const setMapCenter = useGisUmatStore((state) => state.setMapCenter);

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

function ExternalKameraController() {
    const map = useMap();

    useEffect(() => {
        const handleZoomIn = () => map.zoomIn();
        const handleZoomOut = () => map.zoomOut();
        const handleResetView = () => map.setView([-4.545, 136.885], 13, { animate: true });

        const handleFlyToCoords = (e: Event) => {
            const customEvent = e as CustomEvent<{ lat: number; lng: number, zoom?: number }>;
            const { lat, lng, zoom } = customEvent.detail;
            map.flyTo([lat, lng], zoom || 17, { animate: true, duration: 1.5 });
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

export default function ParokiMap() {
    const activeBaseMap = useGisUmatStore((state) => state.activeBaseMap);
    const mapOpacity = useGisUmatStore((state) => state.mapOpacity);

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
                center={[-4.545, 136.885]}
                zoom={12} // Level Paroki lebih jauh
                zoomControl={false}
                style={{ height: "100%", width: "100%", opacity: mapOpacity / 100 }}
            >
                <MapEventsTracker />
                <ExternalKameraController />

                <TileLayer
                    attribution='&copy; Keuskupan Timika GIS | Data by OSM & Google'
                    url={getTileUrl()}
                    maxZoom={20}
                />

                <BoundaryMaskLayer />

                {/* Layer khusus Paroki Hierarkis */}
                <ParokiMarkerLayer />

            </MapContainer>
        </div>
    );
}

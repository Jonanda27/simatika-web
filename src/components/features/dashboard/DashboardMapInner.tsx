"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DashboardStats } from "@/types/dashboard";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

export default function DashboardMapInner({ petaSebaran }: { petaSebaran: DashboardStats['petaSebaran'] }) {
    if (!petaSebaran || petaSebaran.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 p-4 text-center">
                <p className="text-sm font-medium">Tidak ada data sebaran yang tersedia</p>
            </div>
        );
    }

    const centerLat = petaSebaran[0]?.lat || -4.545;
    const centerLng = petaSebaran[0]?.lng || 136.885;

    return (
        <div className="absolute inset-0 z-0 bg-slate-900">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={16}
                zoomControl={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    attribution="&copy; Google Maps"
                />

                {petaSebaran.map((point) => {
                    const isNonStasi = point.is_family && point.has_stasi === false;
                    const iconHtml = !isNonStasi 
                        ? `<div style="position: relative; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;"><span class="absolute inline-flex h-4 w-4 rounded-full border border-yellow-200 bg-yellow-400/40"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400 border border-white shadow-sm"></span></div>`
                        : `<div style="position: relative; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;"><span class="absolute inline-flex h-4 w-4 rounded-md rotate-45 border border-slate-400 bg-slate-500/20"></span><span class="relative inline-flex rounded-sm rotate-45 h-2.5 w-2.5 bg-slate-500 border border-white shadow-sm"></span></div>`;
                    
                    const customIcon = L.divIcon({ 
                        html: iconHtml, 
                        className: "custom-mini-marker bg-transparent border-none outline-none", 
                        iconSize: [16, 16], 
                        iconAnchor: [8, 8] 
                    });

                    return (
                        <Marker 
                            key={point.id} 
                            position={[point.lat, point.lng]}
                            icon={customIcon}
                        >
                            <Popup>
                                <div className="text-sm font-bold">{point.name}</div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>
        </div>
    );
}

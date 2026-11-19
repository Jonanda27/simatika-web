"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet Default Icon Issue di Next.js menggunakan CDN
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
  });
}

interface LocationPickerMapProps {
    position: [number, number] | null;
    onPositionSelect: (pos: [number, number]) => void;
    defaultCenter?: [number, number];
}

function MapClickHandler({ onPositionSelect }: { onPositionSelect: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            onPositionSelect([e.latlng.lat, e.latlng.lng]);
        },
    });
    return null;
}

export default function LocationPickerMap({ position, onPositionSelect, defaultCenter = [-4.545, 136.885] }: LocationPickerMapProps) {
    return (
        <MapContainer
            center={position || defaultCenter}
            zoom={13}
            style={{ height: "100%", width: "100%", borderRadius: "0", zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onPositionSelect={onPositionSelect} />
            {position && <Marker position={position} />}
        </MapContainer>
    );
}

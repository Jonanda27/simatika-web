"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix missing marker icons in leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface Props {
  initialLat?: number;
  initialLng?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

function LocationMarker({ onSelect, initialPos }: { onSelect: (lat: number, lng: number) => void, initialPos: [number, number] | null }) {
  const [position, setPosition] = useState<[number, number] | null>(initialPos);
  
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function MapPicker({ initialLat, initialLng, onLocationSelect }: Props) {
  const [center, setCenter] = useState<[number, number]>([-4.545, 136.885]); // Default Timika area
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (initialLat && initialLng) {
      setCenter([initialLat, initialLng]);
    } else {
      // Try to get user location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => setCenter([pos.coords.latitude, pos.coords.longitude]),
          () => {} // fallback to default
        );
      }
    }
  }, [initialLat, initialLng]);

  if (!isMounted) return <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400">Loading Map...</div>;

  return (
    <div className="h-[300px] w-full rounded-xl overflow-hidden border border-slate-200 z-10 relative">
      <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker 
          onSelect={onLocationSelect} 
          initialPos={initialLat && initialLng ? [initialLat, initialLng] : null} 
        />
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[400] bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 shadow-md">
        Ketuk pada peta untuk mengatur lokasi
      </div>
    </div>
  );
}

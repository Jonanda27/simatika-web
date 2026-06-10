"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { X, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  initialLat?: number;
  initialLng?: number;
  onClose: () => void;
  onSave: (lat: number, lng: number) => void;
}

function LocationMarker({ onSelect, position }: { onSelect: (lat: number, lng: number) => void, position: [number, number] | null }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position}></Marker>
  );
}

export default function MapPickerModal({ initialLat, initialLng, onClose, onSave }: Props) {
  const [center, setCenter] = useState<[number, number]>([-4.545, 136.885]); // Default Timika area
  const [selectedPos, setSelectedPos] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const [isMounted, setIsMounted] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Used to force remount map when center changes significantly

  useEffect(() => {
    setIsMounted(true);
    
    // Fix missing marker icons in leaflet when mounted
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });

    // Auto detect location when modal opens
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCenter(newPos);
          // If no initial location was provided, auto-set to current location
          if (!initialLat || !initialLng) {
            setSelectedPos(newPos);
          }
          setMapKey(prev => prev + 1); // Force map to recenter
        },
        (error) => {
          console.warn("Geolocation failed:", error.message);
        }
      );
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
          setCenter(newPos);
          setSelectedPos(newPos);
          setMapKey(prev => prev + 1);
        },
        () => {
          alert("Gagal mendapatkan lokasi GPS. Pastikan izin lokasi diberikan.");
        }
      );
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ring-1 ring-slate-900/5">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-md text-blue-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              Pilih Lokasi pada Peta
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Map Content */}
        <div className="flex-1 bg-slate-100 relative h-[400px]">
          <MapContainer key={mapKey} center={center} zoom={15} scrollWheelZoom={true} style={{ height: "400px", width: "100%", zIndex: 10 }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker 
              onSelect={(lat, lng) => setSelectedPos([lat, lng])} 
              position={selectedPos}
            />
          </MapContainer>
          
          {/* Overlay Hint */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-slate-700 shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex items-center gap-2 border border-slate-200">
            <MapPin className="h-4 w-4 text-blue-600" />
            Geser peta & ketuk untuk menandai titik
          </div>

          {/* Locate Me Button */}
          <button
            onClick={handleLocateMe}
            className="absolute bottom-6 right-6 z-[400] bg-white text-slate-700 p-4 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center group"
            title="Ke Lokasi Saya"
          >
            <Navigation className="h-6 w-6 group-hover:text-blue-600 transition-colors" />
          </button>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white/90 backdrop-blur-md flex items-center justify-between rounded-b-3xl">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Titik Terpilih</span>
            {selectedPos ? (
              <span className="text-sm font-bold text-slate-800">
                {selectedPos[0].toFixed(5)}, {selectedPos[1].toFixed(5)}
              </span>
            ) : (
              <span className="text-sm font-medium text-slate-400 italic">Belum ada</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="rounded-full px-6 font-semibold border-slate-200">
              Batal
            </Button>
            <Button 
              onClick={() => {
                if (selectedPos) onSave(selectedPos[0], selectedPos[1]);
              }} 
              disabled={!selectedPos}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 shadow-md shadow-blue-900/20 font-semibold transition-transform active:scale-95"
            >
              Konfirmasi Lokasi
            </Button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

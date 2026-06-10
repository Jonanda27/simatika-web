"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { KeluargaData } from "@/types/keluarga";
import { getKepalaKeluarga } from "@/components/features/keluarga/utils";

// Fix Leaflet's default icon issue with Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface MapComponentProps {
  data: KeluargaData[];
}

function FamilyMarker({ family, headName }: { family: KeluargaData, headName: string }) {
  const map = useMap();
  const position = [family.latitude as number, family.longitude as number] as [number, number];

  return (
    <Marker
      position={position}
      eventHandlers={{
        click: () => {
          // Calculate an offset in pixels so the popup fits on screen
          // We shift the target center UP by 150 pixels, which moves the marker DOWN on the screen
          const targetZoom = 16;
          const targetPoint = map.project(position, targetZoom).subtract([0, 150]);
          const targetLatLng = map.unproject(targetPoint, targetZoom);
          
          map.flyTo(targetLatLng, targetZoom, {
            animate: true,
            duration: 1.5
          });
        }
      }}
    >
      <Popup autoPan={false}>
        <div className="flex flex-col gap-2 min-w-[200px]">
          {family.foto_rumah_url ? (
            <img 
              src={family.foto_rumah_url} 
              alt="Foto Rumah" 
              className="w-full h-24 object-cover rounded-md mb-1" 
            />
          ) : (
            <div className="w-full h-24 bg-gray-100 flex items-center justify-center rounded-md mb-1">
              <span className="text-gray-400 text-xs">Tanpa Foto</span>
            </div>
          )}
          <h3 className="font-bold text-sm text-gray-900 mb-0">
            Kel. {headName}
          </h3>
          <div className="text-xs text-gray-600 flex flex-col gap-1">
            <p><strong>No. KK Paroki:</strong> {family.no_kk_paroki || "-"}</p>
            <p><strong>Status Rumah:</strong> {family.status_rumah || "-"}</p>
          </div>
          <a 
            href={`/data-keluarga`} // Since there's no direct detail page, we just redirect to the family list. A real app might have a modal or dynamic route.
            className="mt-2 block text-center text-xs font-medium !text-white bg-brown-600 py-1.5 rounded hover:bg-brown-700 transition-colors"
          >
            Lihat Data Keluarga
          </a>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapComponent({ data }: MapComponentProps) {
  // Filter families that have valid latitude and longitude
  const mapData = data.filter(
    (item) => item.latitude !== null && item.longitude !== null
  );

  // Default center to Indonesia if no data or calculate average
  let defaultCenter: [number, number] = [-0.789275, 113.921327]; // Center of Indonesia
  
  if (mapData.length > 0) {
    // If there is data, use the first family's location as the center
    // Or better, calculate average to center all markers
    const sumLat = mapData.reduce((sum, item) => sum + (item.latitude || 0), 0);
    const sumLng = mapData.reduce((sum, item) => sum + (item.longitude || 0), 0);
    defaultCenter = [sumLat / mapData.length, sumLng / mapData.length];
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add custom style for popup border radius
    const styleId = 'leaflet-popup-custom-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .leaflet-popup-content-wrapper {
          border-radius: 4px !important;
          overflow: hidden;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 animate-pulse">
        <p className="text-gray-500">Memuat Peta...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative z-0">
      <MapContainer
        center={defaultCenter}
        zoom={mapData.length > 0 ? 13 : 5}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="OpenStreetMap (Default)">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satelit (Esri)">
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Peta Topografi">
            <TileLayer
              attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
              url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {mapData.map((family) => {
          // Get the Head of Family (KK) name if available using the existing util
          const headNameRaw = getKepalaKeluarga(family.Umats);
          const headName = headNameRaw !== '-' ? headNameRaw : "Tanpa Nama KK";

          return <FamilyMarker key={family.id} family={family} headName={headName} />;
        })}
      </MapContainer>
    </div>
  );
}

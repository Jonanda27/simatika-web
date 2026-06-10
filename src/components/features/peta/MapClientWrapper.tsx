"use client";

import dynamic from "next/dynamic";
import { KeluargaData } from "@/types/keluarga";

// Dynamically import the MapComponent with SSR disabled
// This must be done inside a Client Component, not a Server Component
const MapComponent = dynamic(
  () => import("./MapComponent"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-gray-50 animate-pulse">
        <p className="text-gray-500 font-medium">Memuat Komponen Peta...</p>
      </div>
    )
  }
);

interface MapClientWrapperProps {
  data: KeluargaData[];
}

export default function MapClientWrapper({ data }: MapClientWrapperProps) {
  return <MapComponent data={data} />;
}

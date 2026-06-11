// src/components/features/peta/MapClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

/**
 * Import dinamis PastoralMap dengan SSR dimatikan.
 * Ini wajib dilakukan karena Leaflet memanggil objek 'window' 
 * yang tidak ada di lingkungan Server (Node.js/Next.js SSR).
 */
const PastoralMap = dynamic(
  () => import("./PastoralMap"),
  {
    ssr: false,
    loading: () => (
      // Loading state saat chunk Javascript Leaflet & Map sedang diunduh browser
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-brown-600/30 border-t-brown-500 rounded-full animate-spin shadow-[0_0_15px_rgba(109,76,65,0.5)]"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brown-500 mt-4 animate-pulse">
          Menyusun Komponen Peta...
        </p>
      </div>
    )
  }
);

/**
 * MapClientWrapper - The Decoupled Gateway.
 * Tidak lagi menerima props 'data'. Data akan di-fetch secara mandiri 
 * oleh layer-layer spesifik di dalam PastoralMap (Prinsip Low Coupling & Information Expert).
 */
export default function MapClientWrapper() {
  return (
    <div className="w-full h-full relative z-0">
      <PastoralMap />
    </div>
  );
}
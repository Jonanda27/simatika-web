// src/app/peta-paroki/page.tsx
"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";

import GisNavbar from "@/components/features/peta/ui/GisNavbar";
import GisSidebar from "@/components/features/peta/ui/GisSidebar";
import MapHUD from "@/components/features/peta/ui/MapHUD";
import PanelOrchestrator from "@/components/features/peta/panels/PanelOrchestrator";
import { useGisUmatStore } from "@/store/useGisUmatStore";

// Import ParokiMapClientWrapper secara dinamis (Bypass SSR untuk Leaflet)
const ParokiMapClientWrapper = dynamic(
    () => import("@/components/features/peta/ParokiMapClientWrapper"),
    {
        ssr: false,
        loading: () => (
            <div className="h-full w-full bg-slate-900 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-brown-500 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(109,76,65,0.5)]"></div>
                <p className="text-xs font-black text-brown-400 uppercase tracking-[0.2em] animate-pulse">
                    Memuat Kanvas Spasial Paroki...
                </p>
            </div>
        ),
    }
);

export default function PetaParokiPage() {
    const { resetMapContext, openPanel } = useGisUmatStore();

    React.useEffect(() => {
        // Reset state peta agar bersih dari sisa state /peta-stasi atau lainnya
        resetMapContext();
        // Buka panel Wilayah secara default
        openPanel("katalog-wilayah", "Katalog & Pencarian Wilayah");
    }, [resetMapContext, openPanel]);
    return (
        <main className="relative h-dvh w-screen overflow-hidden bg-slate-950 font-sans text-slate-800 selection:bg-brown-200 selection:text-brown-900">

            {/* LAYER 0: PETA */}
            <div className="absolute inset-0 z-0">
                <Suspense fallback={<div className="h-full w-full bg-slate-900" />}>
                    <ParokiMapClientWrapper />
                </Suspense>
            </div>

            {/* LAYER UI */}
            <GisNavbar />
            <GisSidebar />
            <PanelOrchestrator />
            <MapHUD />

        </main>
    );
}

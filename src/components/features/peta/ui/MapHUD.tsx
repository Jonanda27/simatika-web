// src/components/features/peta/ui/MapHUD.tsx
"use client";

import React from "react";
import { Plus, Minus, Maximize, Map as MapIcon } from "lucide-react";
import { useGisUmatStore } from "@/store/useGisUmatStore";
import { cn } from "@/lib/utils";

export default function MapHUD() {
    const { markerMode } = useGisUmatStore();

    // Custom events untuk dilempar ke mesin Leaflet
    const triggerZoomIn = () => window.dispatchEvent(new Event('map-zoom-in'));
    const triggerZoomOut = () => window.dispatchEvent(new Event('map-zoom-out'));
    const triggerResetView = () => window.dispatchEvent(new Event('map-reset-view'));

    // Logic Penyusunan Isi Legenda berdasarkan Mode
    type LegendItem = { label: string; color: string };
    let legendItems: LegendItem[] = [];

    if (markerMode === "ekonomi") {
        legendItems = [
            { label: "Milik Sendiri / Mampu", color: "bg-emerald-500 border-emerald-200" },
            { label: "Kontrak / Sewa", color: "bg-amber-500 border-amber-200" },
            { label: "Menumpang / Rentan", color: "bg-rose-500 border-rose-200" },
        ];
    } else if (markerMode === "sakramen") {
        legendItems = [
            { label: "Keluarga Katolik (Lengkap)", color: "bg-teal-500 border-teal-200" },
            { label: "Pembinaan Sakramen (Lengkap/Kurang)", color: "bg-amber-500 border-amber-200" },
            { label: "Perhatian Khusus (Banyak Anomali)", color: "bg-rose-500 border-rose-200" },
        ];
    } else {
        legendItems = [
            { label: "Titik Rumah Umat/Keluarga", color: "bg-brown-500 border-brown-200" }
        ];
    }

    return (
        <div className="absolute bottom-8 right-8 z-30 pointer-events-none flex flex-row items-end gap-4 select-none">

            {/* 1. KOTAK LEGENDA TAKTIS (Frameless Continuous List) */}
            <div className="pointer-events-auto bg-white/95 backdrop-blur border border-slate-300 shadow-sm rounded-none w-56 animate-in fade-in slide-in-from-bottom-4 flex flex-col max-h-[50vh] overflow-y-auto custom-scrollbar">

                {/* Header Legenda */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10 text-left">
                    <MapIcon size={12} className="text-brown-700" />
                    <h4 className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                        {markerMode === "default" ? "Legenda Pemetaan" : `Filter: ${markerMode}`}
                    </h4>
                </div>

                {/* Isi Legenda (Flush List) */}
                <div className="flex flex-col">
                    {legendItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 px-3 py-2 border-b border-slate-100 last:border-0">
                            <div className="relative w-3 h-3 shrink-0 flex items-center justify-center">
                                <div className={cn("relative w-full h-full shadow-sm rounded-full border-2", item.color)} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600 tracking-tight leading-none text-left">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. KONTROL ZOOM PETA (Frameless Stack) */}
            <div className="pointer-events-auto flex flex-col bg-white/95 backdrop-blur border border-slate-300 shadow-none rounded-none overflow-hidden divide-y divide-slate-200 shrink-0">
                <button
                    onClick={triggerZoomIn}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-brown-700 transition-colors active:bg-slate-200 rounded-none outline-none"
                    title="Perbesar (Zoom In)"
                >
                    <Plus size={18} strokeWidth={2.5} />
                </button>

                <button
                    onClick={triggerResetView}
                    className="w-10 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-brown-700 transition-colors active:bg-slate-200 group rounded-none outline-none"
                    title="Reset Titik Fokus (Paroki)"
                >
                    <Maximize size={14} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                </button>

                <button
                    onClick={triggerZoomOut}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 hover:text-brown-700 transition-colors active:bg-slate-200 rounded-none outline-none"
                    title="Perkecil (Zoom Out)"
                >
                    <Minus size={18} strokeWidth={2.5} />
                </button>
            </div>

        </div>
    );
}
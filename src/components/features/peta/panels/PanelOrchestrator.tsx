// src/components/features/peta/panels/PanelOrchestrator.tsx
"use client";

import React, { useEffect, useState } from "react";
import { X, Map as MapIcon } from "lucide-react";
import { useGisUmatStore } from "@/store/useGisUmatStore";
import { GisPanelType } from "@/types/gis";

import KatalogKeluargaPanel from "./KatalogKeluargaPanel";
import DetailKeluargaPanel from "./DetailKeluargaPanel";
import BasemapLayerPanel from "./BasemapLayerPanel";

export default function PanelOrchestrator() {
    const { activePanels, closePanel, closePanelsToTheRight } = useGisUmatStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Sumbu X: Base width 300px (Ramping & Taktis)
    const PANEL_WIDTH = isMobile ? (typeof window !== "undefined" ? window.innerWidth - 64 : 300) : 300;

    return (
        <div className="absolute top-16 bottom-0 left-16 z-30 pointer-events-none flex items-start">

            {activePanels.map((panel, index) => {
                // Tentukan Tipologi Panel (Docked vs Floating)
                const isFloating = panel.type === "detil-keluarga";

                // Perhitungan Offset Dinamis
                const dockedOffset = index * PANEL_WIDTH;
                const floatingLeft = isMobile ? 16 : (index * PANEL_WIDTH) + 16;

                return (
                    <div
                        key={panel.id}
                        className={`absolute pointer-events-auto transition-all duration-300 ease-in-out bg-white overflow-hidden flex flex-col ${isFloating
                            ? "shadow-2xl border border-slate-200 rounded-none"
                            : "border-r border-slate-200 shadow-none rounded-none"
                            }`}
                        style={
                            isFloating
                                ? {
                                    left: `${floatingLeft}px`,
                                    top: "16px",
                                    bottom: "16px",
                                    width: "320px",
                                    maxWidth: "calc(100vw - 80px)",
                                    zIndex: 50,
                                }
                                : {
                                    left: 0,
                                    top: 0,
                                    bottom: 0,
                                    width: `${PANEL_WIDTH}px`,
                                    transform: `translateX(${dockedOffset}px)`,
                                    zIndex: 40 - index,
                                }
                        }
                    >
                        {/* HEADER PANEL (Hanya untuk tipe Docked) */}
                        {!isFloating && (
                            <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0 select-none">
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-black text-brown-600 uppercase tracking-widest leading-none">
                                        {panel.type.replace("-", " ")}
                                    </span>
                                    <h3 className="text-[11px] font-bold text-slate-800 truncate max-w-60 tracking-tight mt-1 uppercase leading-none">
                                        {panel.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={() => closePanel(panel.id)}
                                    className="p-1 rounded-none bg-transparent hover:bg-slate-200 text-slate-400 hover:text-rose-500 transition-colors active:scale-95 outline-none"
                                    title="Tutup Laci"
                                >
                                    <X size={16} strokeWidth={2.5} />
                                </button>
                            </div>
                        )}

                        {/* BODY PANEL (Konten dinamis) */}
                        <div
                            className="flex-1 overflow-y-auto custom-scrollbar"
                            onClick={() => !isFloating && closePanelsToTheRight(index)}
                        >
                            {renderPanelContent(panel.type, panel.data, panel.id, closePanel)}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Fungsi Delegasi Rendering
function renderPanelContent(
    type: GisPanelType,
    data: any,
    panelId: string,
    closePanel: (id: string) => void
) {
    switch (type) {
        case "katalog-keluarga":
            return <KatalogKeluargaPanel />;

        case "detil-keluarga":
            return <DetailKeluargaPanel familyData={data} panelId={panelId} />;

        case "basemap-layer":
            return <BasemapLayerPanel />;

        case "tentang":
            return (
                <div className="p-6 text-center space-y-3 text-slate-500 font-sans">
                    <MapIcon size={32} className="mx-auto text-brown-600/40 animate-pulse" />
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 leading-none">
                            SIMATIKA SPASIAL
                        </p>
                        <p className="text-[11px] mt-2 font-medium leading-relaxed text-justify">
                            Pusat Komando Tata Kelola Pastoral berbasis GIS. Sistem ini memvisualisasikan data sensus keluarga Katolik untuk mendukung pengambilan keputusan.
                        </p>
                    </div>
                </div>
            );

        default:
            return (
                <div className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
                    Modul sedang dikonstruksi...
                </div>
            );
    }
}
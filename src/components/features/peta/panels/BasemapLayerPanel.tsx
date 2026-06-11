// src/components/features/peta/panels/BasemapLayerPanel.tsx
"use client";

import React from "react";
import { Layers, Settings2, Map as MapIcon, Sun, Moon, Palette, Droplets } from "lucide-react";
import { useGisUmatStore } from "@/store/useGisUmatStore";
import { BasemapType, MarkerMode } from "@/types/gis";

export default function BasemapLayerPanel() {
    const {
        activeBaseMap,
        setActiveBaseMap,
        markerMode,
        setMarkerMode,
        mapOpacity,
        setMapOpacity,
        maskOpacity,
        setMaskOpacity
    } = useGisUmatStore();

    const baseMaps: { id: BasemapType; label: string; icon: any; desc: string }[] = [
        { id: "dark", label: "Carto Dark", icon: Moon, desc: "Peta Gelap (Optimal untuk titik)" },
        { id: "satellite", label: "Google Satellite", icon: Sun, desc: "Citra Satelit Atap Rumah" },
        { id: "street", label: "Google Roadmap", icon: MapIcon, desc: "Navigasi Jalan & Fasilitas" },
        { id: "osm", label: "OpenStreetMap", icon: Layers, desc: "Peta Jaringan Global" },
    ];

    const markerModes: { id: MarkerMode; label: string; icon: any; desc: string }[] = [
        { id: "default", label: "Lokasi Default", icon: MapIcon, desc: "Warna seragam untuk penanda lokasi" },
        { id: "ekonomi", label: "Analisis Ekonomi", icon: Settings2, desc: "Warna berdasarkan kepemilikan rumah" },
        { id: "sakramen", label: "Kesejahteraan Pastoral", icon: Droplets, desc: "Warna berdasarkan kelengkapan sakramen" },
    ];

    return (
        <div className="flex flex-col h-full bg-white pb-10 font-sans">

            {/* SECTION 1: VISUALISASI DATA (MARKER MODE) */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <Palette size={14} className="text-brown-700" />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Mode Visualisasi Titik</h4>
                </div>

                <div className="flex flex-col">
                    {markerModes.map((mode) => {
                        const isActive = markerMode === mode.id;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => setMarkerMode(mode.id)}
                                className="group flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left w-full outline-none"
                            >
                                <div className="flex items-center gap-3">
                                    {/* Custom Toggle Switch */}
                                    <div className={`relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${isActive ? 'bg-brown-500' : 'bg-slate-300'}`}>
                                        <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${isActive ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <div className={`transition-colors ${isActive ? "text-brown-700" : "text-slate-400 group-hover:text-slate-600"}`}>
                                            <mode.icon size={16} strokeWidth={2} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[12px] transition-colors ${isActive ? 'text-brown-800 font-bold' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}>
                                                {mode.label}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">{mode.desc}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 2: BASEMAP GALLERY */}
            <div className="flex flex-col mt-0 border-t-4 border-slate-100">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <Layers size={14} className="text-brown-700" />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Katalog Peta Dasar</h4>
                </div>

                <div className="flex flex-col">
                    {baseMaps.map((map) => {
                        const isActive = activeBaseMap === map.id;
                        return (
                            <button
                                key={map.id}
                                onClick={() => setActiveBaseMap(map.id)}
                                className="group flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left w-full outline-none"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`relative inline-flex h-3.5 w-7 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out ${isActive ? 'bg-brown-500' : 'bg-slate-300'}`}>
                                        <span className={`inline-block h-2.5 w-2.5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${isActive ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                                    </div>

                                    <div className="flex items-center gap-2.5">
                                        <div className={`transition-colors ${isActive ? "text-brown-700" : "text-slate-400 group-hover:text-slate-600"}`}>
                                            <map.icon size={16} strokeWidth={2} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`text-[12px] transition-colors ${isActive ? 'text-brown-800 font-bold' : 'text-slate-700 font-medium group-hover:text-slate-900'}`}>
                                                {map.label}
                                            </span>
                                            <span className="text-[10px] font-medium text-slate-500 leading-none mt-0.5">{map.desc}</span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* SECTION 3: VISUAL OPACITY CONTROLS */}
            <div className="flex flex-col mt-0 border-t-4 border-slate-100">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-200 text-slate-500">
                    <Settings2 size={14} className="text-brown-700" />
                    <h4 className="text-[11px] font-bold uppercase tracking-wider">Kontrol Visibilitas</h4>
                </div>

                <div className="flex flex-col divide-y divide-slate-100">
                    {/* Slider 1: Map Base Opacity */}
                    <div className="px-4 py-3 bg-white space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Kecerahan Peta Dasar</span>
                            <span className="text-[9px] font-black text-brown-800 font-mono bg-brown-50 px-1.5 py-0.5 border border-brown-100">{mapOpacity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={mapOpacity}
                            onChange={(e) => setMapOpacity(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-brown-600 outline-none"
                        />
                    </div>

                    {/* Slider 2: Masking Opacity */}
                    <div className="px-4 py-3 bg-white space-y-2.5">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Masking Luar Wilayah</span>
                            <span className="text-[9px] font-black text-slate-800 font-mono bg-slate-100 px-1.5 py-0.5 border border-slate-200">{maskOpacity}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={maskOpacity}
                            onChange={(e) => setMaskOpacity(parseInt(e.target.value))}
                            className="w-full h-1.5 bg-slate-200 rounded-none appearance-none cursor-pointer accent-slate-800 outline-none"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}
// src/components/features/peta/panels/DetailKeluargaPanel.tsx
"use client";

import React, { useState } from "react";
import {
    X, MapPin, Users, Home, CheckCircle2,
    AlertCircle, Droplets, Bath, User, Activity
} from "lucide-react";
import { useGisUmatStore } from "@/store/useGisUmatStore";
import { KeluargaData } from "@/types/keluarga";
import { cn } from "@/lib/utils";
import { differenceInYears } from "date-fns";

interface DetailKeluargaPanelProps {
    familyData: KeluargaData;
    panelId: string;
}

type TabType = "profil" | "anggota";

// Helper: Ekstrak Kepala Keluarga
const getKepalaKeluarga = (umats?: any[]) => {
    return umats?.find((u) => u.status_dalam_keluarga === 'KK')?.nama_lengkap
        || umats?.[0]?.nama_lengkap
        || 'Tanpa Nama';
};

// Helper: Menghitung Umur
const getAge = (tglLahir: string | null) => {
    if (!tglLahir) return "-";
    return `${differenceInYears(new Date(), new Date(tglLahir))} thn`;
};

// Helper: Mengecek kelengkapan sakramen dari array
const getSacramentStatus = (sacraments?: any[]) => {
    const status = { Baptis: false, Komuni: false, Krisma: false, Perkawinan: false };
    sacraments?.forEach((s) => {
        if (s.jenis_sakramen === "Baptis") status.Baptis = true;
        if (s.jenis_sakramen === "Komuni Pertama") status.Komuni = true;
        if (s.jenis_sakramen === "Krisma") status.Krisma = true;
        if (s.jenis_sakramen === "Perkawinan") status.Perkawinan = true;
    });
    return status;
};

export default function DetailKeluargaPanel({ familyData, panelId }: DetailKeluargaPanelProps) {
    const { closePanel } = useGisUmatStore();
    const [activeTab, setActiveTab] = useState<TabType>("profil");

    if (!familyData) return null;

    const kepalaKeluarga = getKepalaKeluarga(familyData.Umats);
    const totalAnggota = familyData.Umats?.length || 0;

    return (
        <div className="flex flex-col h-full w-full bg-white relative font-sans">

            {/* HEADER - Frameless & Sharp */}
            <div className="flex items-start justify-between px-4 py-3 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 shadow-sm">
                <div className="flex flex-col pr-2">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-brown-600 leading-none mb-1">
                        Data Keluarga
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                        Keluarga {kepalaKeluarga}
                    </h3>
                    <p className="text-[9px] font-mono text-slate-500 mt-1">KK: {familyData.no_kk_paroki || "-"}</p>
                </div>

                <button
                    onClick={() => closePanel(panelId)}
                    className="p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-colors rounded-none shrink-0"
                    title="Tutup Panel"
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            </div>

            {/* BODY - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">

                {/* HERO IMAGE SECTION (Single Image Render) */}
                <div className="relative w-full aspect-video bg-slate-900 shrink-0 group">
                    {familyData.foto_rumah_url ? (
                        <>
                            <img
                                src={familyData.foto_rumah_url}
                                alt="Foto Rumah"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
                            <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-white">
                                <Home size={12} className="text-brown-400" />
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/90">
                                    Visualisasi Hunian
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center w-full h-full text-slate-500">
                            <Home size={24} className="opacity-30 mb-2" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Tanpa Foto</span>
                        </div>
                    )}
                </div>

                {/* TABS MENU */}
                <div className="flex bg-slate-50 border-b border-slate-200 shrink-0 sticky top-0 z-10">
                    <button
                        onClick={() => setActiveTab("profil")}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors outline-none ${activeTab === "profil"
                            ? "bg-white text-brown-800 border-t-[3px] border-t-brown-600 border-r border-slate-200"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-t-[3px] border-t-transparent border-r border-slate-200"
                            }`}
                    >
                        Profil Properti
                    </button>
                    <button
                        onClick={() => setActiveTab("anggota")}
                        className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors outline-none flex items-center justify-center gap-1.5 ${activeTab === "anggota"
                            ? "bg-white text-brown-800 border-t-[3px] border-t-brown-600"
                            : "text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-t-[3px] border-t-transparent"
                            }`}
                    >
                        Anggota <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-sm">{totalAnggota}</span>
                    </button>
                </div>

                {/* TAB 1: PROFIL PROPERTI */}
                {activeTab === "profil" && (
                    <div className="flex flex-col pb-6 animate-in fade-in duration-300">
                        <div className="flex flex-col bg-white">
                            <DetailRow icon={MapPin} label="Kordinat GPS" value={`${familyData.latitude}, ${familyData.longitude}`} />
                            <DetailRow icon={Home} label="Status Rumah" value={familyData.status_rumah || "-"} />
                            <DetailRow
                                icon={Activity}
                                label="Pendapatan"
                                value={familyData.pendapatan_per_bulan ? `Rp ${Number(familyData.pendapatan_per_bulan).toLocaleString("id-ID")}` : "-"}
                            />
                            <DetailRow icon={CheckCircle2} label="Asuransi" value={familyData.asuransi_kesehatan || "-"} />
                        </div>

                        {/* Fasilitas MCK (High Density Layout) */}
                        <div className="px-4 py-4 bg-slate-50 border-y border-slate-200 mt-4 text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                                Fasilitas Sanitasi (MCK)
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <FasilitasBadge active={familyData.fasilitas_kamar_mandi} icon={<Bath size={10} />} label="Kamar Mandi" />
                                <FasilitasBadge active={familyData.fasilitas_kamar_cuci} icon={<Droplets size={10} />} label="Tempat Cuci" />
                                <FasilitasBadge active={familyData.fasilitas_wc} icon={<Droplets size={10} />} label="Toilet / WC" />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: DATA ANGGOTA & SAKRAMEN */}
                {activeTab === "anggota" && (
                    <div className="flex flex-col pb-6 animate-in fade-in duration-300">
                        {familyData.Umats && familyData.Umats.length > 0 ? (
                            <div className="flex flex-col divide-y divide-slate-100">
                                {familyData.Umats.map((umat: any, idx: number) => {
                                    const sac = getSacramentStatus(umat.Sacraments);
                                    const isKK = umat.status_dalam_keluarga === "KK";

                                    return (
                                        <div key={idx} className="p-4 bg-white hover:bg-slate-50 transition-colors">
                                            <div className="flex items-start gap-3">
                                                {/* Avatar Siku */}
                                                <div className={`w-10 h-10 rounded-none flex items-center justify-center shrink-0 border
                          ${isKK ? "bg-brown-100 border-brown-200 text-brown-700" : "bg-slate-100 border-slate-200 text-slate-500"}
                        `}>
                                                    <User size={16} />
                                                </div>

                                                <div className="flex flex-col min-w-0 flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="text-xs font-bold text-slate-900 truncate">
                                                            {umat.nama_lengkap}
                                                        </h4>
                                                        <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 border leading-none",
                                                            isKK ? "bg-brown-600 text-white border-brown-700" : "bg-slate-100 text-slate-500 border-slate-200"
                                                        )}>
                                                            {umat.status_dalam_keluarga || "-"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500 uppercase tracking-wider mb-2">
                                                        <span>{umat.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span>{getAge(umat.tanggal_lahir)}</span>
                                                        <span className="text-slate-300">•</span>
                                                        <span className="truncate">{umat.pekerjaan || "Belum Bekerja"}</span>
                                                    </div>

                                                    {/* Deretan Badge Sakramen */}
                                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                                        <SakramenBadge active={sac.Baptis} label="Bpt" />
                                                        <SakramenBadge active={sac.Komuni} label="Kom" />
                                                        <SakramenBadge active={sac.Krisma} label="Krs" />
                                                        <SakramenBadge active={sac.Perkawinan} label="Nkh" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                                <AlertCircle size={24} className="opacity-30 mb-2" />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Data anggota belum diinput</p>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function DetailRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-start justify-between px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors gap-1">
            <div className="flex items-center gap-2 w-full sm:w-2/5 shrink-0">
                <Icon size={12} className="text-brown-600" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {label}
                </span>
            </div>
            <span className="text-[11px] font-medium text-slate-800 text-left sm:text-right w-full sm:w-3/5 wrap-break-word">
                {value}
            </span>
        </div>
    );
}

function FasilitasBadge({ active, icon, label }: { active: boolean, icon: any, label: string }) {
    return (
        <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 border rounded-none text-[9px] font-bold uppercase tracking-wider transition-colors",
            active ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-white text-slate-400 border-slate-200"
        )}>
            {icon} {label}
        </div>
    );
}

function SakramenBadge({ active, label }: { active: boolean, label: string }) {
    return (
        <div className={cn(
            "px-1.5 py-0.5 border text-[8px] font-black uppercase tracking-widest rounded-sm",
            active ? "bg-brown-100 text-brown-800 border-brown-200" : "bg-slate-50 text-slate-300 border-slate-200"
        )}>
            {label}
        </div>
    );
}
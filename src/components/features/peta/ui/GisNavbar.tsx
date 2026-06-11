// src/components/features/peta/ui/GisNavbar.tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Cross, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useGisUmatStore } from "@/store/useGisUmatStore";

export default function GisNavbar() {
    const { user } = useAuth();
    const { clearPanels, resetMapContext } = useGisUmatStore();

    const handleLogoClick = () => {
        clearPanels();
        resetMapContext();
    };

    const initials = user?.username?.substring(0, 2).toUpperCase() || "AD";
    const roleLabel = user?.role || "Admin Paroki";

    return (
        <nav className="absolute top-0 left-0 right-0 h-16 px-6 flex items-center justify-between bg-white border-b border-slate-200 z-50 pointer-events-auto shadow-sm">

            {/* KIRI: Back Button & Branding */}
            <div className="flex items-center gap-5">
                <Link
                    href="/dashboard"
                    className="group flex items-center gap-2 text-slate-500 hover:text-brown-700 transition-all rounded-none outline-none"
                >
                    <div className="p-1.5 group-hover:bg-slate-100 transition-colors rounded-none">
                        <ChevronLeft size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">
                        Dashboard
                    </span>
                </Link>

                <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                <button
                    onClick={handleLogoClick}
                    className="flex items-center gap-3 active:scale-95 transition-transform group rounded-none outline-none text-left"
                >
                    <div className="w-8 h-8 bg-brown-600 flex items-center justify-center text-white rounded-none shadow-sm group-hover:bg-brown-700 transition-colors">
                        <Cross size={18} />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-black text-slate-800 tracking-tighter uppercase">
                            SIMATIKA <span className="text-brown-600">Pastoral</span>
                        </span>
                        <span className="text-[8px] text-slate-400 font-bold tracking-[0.2em] uppercase mt-0.5">
                            Command Center
                        </span>
                    </div>
                </button>
            </div>

            {/* KANAN: Identity */}
            <div className="flex items-center gap-3 pl-2 pr-2 py-1 group cursor-default">
                <div className="hidden sm:flex flex-col items-end text-right">
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-tight line-clamp-1 max-w-30">
                        {user?.username || "Guest User"}
                    </span>
                    <span className="text-[8px] text-brown-600 font-bold uppercase tracking-widest">
                        {roleLabel}
                    </span>
                </div>
                <div className="w-8 h-8 bg-brown-100 border border-brown-200 flex items-center justify-center text-[11px] font-black text-brown-700 rounded-none">
                    {user ? initials : <User size={14} />}
                </div>
            </div>

        </nav>
    );
}
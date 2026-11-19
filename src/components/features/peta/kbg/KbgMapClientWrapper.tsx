// src/components/features/peta/kbg/KbgMapClientWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import React from "react";

const KbgPastoralMap = dynamic(
  () => import("./KbgPastoralMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950">
        <div className="w-10 h-10 border-4 border-brown-600/30 border-t-brown-500 rounded-full animate-spin shadow-[0_0_15px_rgba(109,76,65,0.5)]"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-brown-500 mt-4 animate-pulse">
          Menyusun Komponen Peta KBG...
        </p>
      </div>
    )
  }
);

export default function KbgMapClientWrapper() {
  return (
    <div className="w-full h-full relative z-0">
      <KbgPastoralMap />
    </div>
  );
}

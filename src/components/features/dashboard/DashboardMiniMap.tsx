"use client";

import dynamic from "next/dynamic";
import React from "react";
import { DashboardStats } from "@/types/dashboard";

const DashboardMapInner = dynamic(
  () => import("./DashboardMapInner"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-2"></div>
        <p className="text-xs font-bold text-indigo-500 uppercase">Memuat Peta...</p>
      </div>
    )
  }
);

export default function DashboardMiniMap({ petaSebaran }: { petaSebaran: DashboardStats['petaSebaran'] }) {
  return (
    <div className="w-full h-full relative z-0 overflow-hidden">
      <DashboardMapInner petaSebaran={petaSebaran} />
    </div>
  );
}

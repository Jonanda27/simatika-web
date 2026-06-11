// src/components/features/peta/utils/gisColorMath.ts
import L from "leaflet";
import { KeluargaData } from "@/types/keluarga";
import { MarkerMode } from "@/types/gis";

/**
 * ============================================================================
 * PURE FABRICATION: GIS COLOR MATH ENGINE
 * ============================================================================
 * Memisahkan logika penentuan gaya (styling) marker dari komponen React UI.
 * Ini memastikan aturan warna (business rules) terisolasi dan mudah di-testing.
 */

interface MarkerStyleConfig {
    colorClass: string;
    ringClass: string;
}

/**
 * Resolver Warna Berdasarkan Mode Spasial yang Aktif
 */
export const resolveMarkerColors = (family: KeluargaData, mode: MarkerMode): MarkerStyleConfig => {
    let colorClass = "bg-brown-500";
    let ringClass = "border-brown-200 bg-brown-500/20";

    // MODE 1: STATUS EKONOMI / KEPEMILIKAN RUMAH
    if (mode === "ekonomi") {
        const status = family.status_rumah;
        if (status === "Milik Sendiri" || status === "Milik") {
            colorClass = "bg-emerald-500";
            ringClass = "border-emerald-200 bg-emerald-500/20";
        } else if (status === "Kontrak/Sewa" || status === "Kontrak") {
            colorClass = "bg-amber-500";
            ringClass = "border-amber-200 bg-amber-500/20";
        } else {
            // Menumpang / Lainnya (Dianggap rentan/butuh perhatian)
            colorClass = "bg-rose-500";
            ringClass = "border-rose-200 bg-rose-500/20";
        }
    }
    // MODE 2: KELENGKAPAN SAKRAMEN (Contoh Indikator Kesejahteraan Pastoral)
    else if (mode === "sakramen") {
        // Sebagai mock-up logika: Jika anggota keluarga banyak (>=3), diasumsikan komplit/aman (Hijau)
        // Jika tidak, butuh pembinaan pastoral (Merah)
        // Di masa depan, ini bisa divalidasi langsung dari kelengkapan sakramen masing-masing Umat
        const totalMembers = family.Umats?.length || 0;
        if (totalMembers >= 3) {
            colorClass = "bg-teal-500";
            ringClass = "border-teal-200 bg-teal-500/20";
        } else if (totalMembers === 2) {
            colorClass = "bg-amber-500";
            ringClass = "border-amber-200 bg-amber-500/20";
        } else {
            colorClass = "bg-rose-500";
            ringClass = "border-rose-200 bg-rose-500/20";
        }
    }

    return { colorClass, ringClass };
};

/**
 * Generator Ikon Marker Individual (Titik Rumah Umat)
 */
export const createPolymorphicMarker = (
    family: KeluargaData,
    mode: MarkerMode,
    isSelected: boolean
) => {
    const { colorClass, ringClass: baseRingClass } = resolveMarkerColors(family, mode);

    let finalRingClass = baseRingClass;
    let pulseClass = "";

    // Logika Visual Jika Sedang Disorot/Diklik
    if (isSelected) {
        finalRingClass = "border-slate-800 bg-slate-900/40";
        pulseClass = "animate-pulse"; // Tambahkan efek denyut
    }

    return L.divIcon({
        html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
          <span class="absolute inline-flex h-6 w-6 rounded-full border ${finalRingClass} ${pulseClass}"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 ${colorClass} border border-white shadow-sm"></span>
      </div>
    `,
        className: "custom-family-marker bg-transparent border-none outline-none",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

/**
 * Generator Ikon Klaster (Saat peta di-zoom out)
 */
export const createClusterIcon = (cluster: any) => {
    const count = cluster.getChildCount();

    // Ukuran dinamis berdasarkan jumlah titik yang diklaster
    const sizeClass = count > 50 ? "w-12 h-12 text-sm" : "w-10 h-10 text-xs";

    return L.divIcon({
        html: `
      <div class="${sizeClass} bg-slate-900 text-white flex items-center justify-center rounded-full border-2 border-slate-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] font-bold font-mono transition-transform hover:scale-110">
        ${count}
      </div>
    `,
        className: "custom-cluster-icon bg-transparent border-none outline-none",
        iconSize: count > 50 ? [48, 48] : [40, 40],
        iconAnchor: count > 50 ? [24, 24] : [20, 20],
    });
};
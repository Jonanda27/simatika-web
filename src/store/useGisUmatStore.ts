// src/store/useGisUmatStore.ts
import { create } from "zustand";
import { GisPanel, GisPanelType, MarkerMode, BasemapType } from "../types/gis";

interface GisUmatState {
    // ==========================================
    // 1. STATE: Manajemen Panel (UI Layout)
    // ==========================================
    activePanels: GisPanel[];

    // ==========================================
    // 2. STATE: Konteks Eksplorasi Spasial (Peta)
    // ==========================================
    mapOpacity: number;         // 0 - 100 (Transparansi Masking Poligon / Base Layer)
    maskOpacity: number;        // 0 - 100 (Transparansi area di luar yurisdiksi Paroki)
    activeBaseMap: BasemapType; // Jenis basemap aktif
    markerMode: MarkerMode;     // Mode visualisasi titik keluarga (Ekonomi/Sakramen/Default)

    selectedFamilyId: string | null; // ID keluarga yang sedang di-klik/difokuskan

    // Koordinat & Zoom Global (Single Source of Truth)
    mapCenter: [number, number];
    mapZoom: number;

    // ==========================================
    // ACTIONS: Manajemen Panel
    // ==========================================
    openPanel: (type: GisPanelType, title: string, data?: any) => void;
    closePanel: (id: string) => void;
    closePanelsToTheRight: (index: number) => void;
    clearPanels: () => void;

    // ==========================================
    // ACTIONS: Konteks Eksplorasi Spasial
    // ==========================================
    setMapOpacity: (opacity: number) => void;
    setMaskOpacity: (opacity: number) => void;
    setActiveBaseMap: (baseMap: BasemapType) => void;
    setMarkerMode: (mode: MarkerMode) => void;
    setSelectedFamilyId: (id: string | null) => void;

    // Aksi Pengubah Koordinat & Zoom Peta secara Global
    setMapCenter: (center: [number, number]) => void;
    setMapZoom: (zoom: number) => void;

    resetMapContext: () => void;
}

// Default center: Timika, Papua
const DEFAULT_CENTER: [number, number] = [-4.545, 136.885];
const DEFAULT_ZOOM = 13;

export const useGisUmatStore = create<GisUmatState>((set) => ({
    // Inisialisasi State Default
    activePanels: [],
    mapOpacity: 100,
    maskOpacity: 60, // Gelapkan area di luar batas Paroki sebesar 60%
    activeBaseMap: 'dark', // Peta gelap bagus untuk visualisasi titik
    markerMode: 'default',
    selectedFamilyId: null,
    mapCenter: DEFAULT_CENTER,
    mapZoom: DEFAULT_ZOOM,

    // ======================================================================
    // LOGIKA MUTUALLY EXCLUSIVE & STACKING (GFW PARADIGM)
    // ======================================================================
    openPanel: (type, title, data = null) =>
        set((state) => {
            const isDetailPanel = type === "detil-keluarga";
            let nextPanels = [...state.activePanels];

            // Aturan Eksklusivitas (Mutually Exclusive)
            if (isDetailPanel) {
                // Jika buka detail keluarga, tutup detail keluarga lama agar tidak tumpang tindih
                nextPanels = nextPanels.filter((p) => p.type !== "detil-keluarga");
            } else {
                // Jika buka panel menu utama (katalog, basemap), bersihkan panel melayang
                nextPanels = nextPanels.filter((p) => p.type !== "detil-keluarga");
                // Hapus panel sejenis agar tidak ada menu ganda
                nextPanels = nextPanels.filter((p) => p.type !== type);
            }

            // Buat instance panel baru
            const newPanel: GisPanel = {
                id: `${type}-${Date.now()}`,
                type,
                title,
                isVisible: true,
                data,
            };

            nextPanels.push(newPanel);

            return { activePanels: nextPanels };
        }),

    closePanel: (id) =>
        set((state) => {
            const closedPanel = state.activePanels.find((p) => p.id === id);
            if (!closedPanel) return {};

            const filteredPanels = state.activePanels.filter((p) => p.id !== id);

            // Jika panel detail keluarga ditutup, hilangkan fokus marker di peta
            const shouldClearSelection = closedPanel.type === "detil-keluarga";

            return {
                activePanels: filteredPanels,
                ...(shouldClearSelection && { selectedFamilyId: null })
            };
        }),

    closePanelsToTheRight: (index) =>
        set((state) => {
            const slicedPanels = state.activePanels.slice(0, index + 1);

            const isDetailStillOpen = slicedPanels.some((p) => p.type === "detil-keluarga");

            return {
                activePanels: slicedPanels,
                ...(!isDetailStillOpen && { selectedFamilyId: null })
            };
        }),

    clearPanels: () => set({
        activePanels: [],
        selectedFamilyId: null,
    }),

    // ======================================================================
    // LOGIKA KONTROL SPASIAL
    // ======================================================================
    setMapOpacity: (opacity) => set({ mapOpacity: opacity }),
    setMaskOpacity: (opacity) => set({ maskOpacity: opacity }),
    setActiveBaseMap: (activeBaseMap) => set({ activeBaseMap }),
    setMarkerMode: (markerMode) => set({ markerMode }),

    setSelectedFamilyId: (id) => set({ selectedFamilyId: id }),

    setMapCenter: (center) => set({ mapCenter: center }),
    setMapZoom: (zoom) => set({ mapZoom: zoom }),

    resetMapContext: () =>
        set({
            activePanels: [],
            selectedFamilyId: null,
            mapOpacity: 100,
            maskOpacity: 60,
            activeBaseMap: 'dark',
            markerMode: 'default',
            mapCenter: DEFAULT_CENTER,
            mapZoom: DEFAULT_ZOOM,
        }),
}));
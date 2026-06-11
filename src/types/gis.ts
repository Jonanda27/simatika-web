// src/types/gis.ts

/**
 * Definisi identitas panel untuk logika Shifting Panels (GFW Paradigm).
 * Membantu Orchestrator menentukan komponen mana yang harus dirender di stack.
 */
export type GisPanelType =
    | 'katalog-keluarga'   // Panel daftar keluarga (Flush List di kiri)
    | 'detil-keluarga'     // Panel melayang (floating) untuk detail info keluarga & anggota
    | 'basemap-layer'      // Panel untuk pengaturan peta dasar dan mode marker
    | 'hasil-pencarian'    // Panel untuk hasil pencarian global
    | 'tentang';           // Panel informasi sistem SIMATIKA GIS

/**
 * Mode representasi visual untuk marker di peta.
 * Membantu Pastor/Admin melihat demografi dari sudut pandang yang berbeda.
 */
export type MarkerMode =
    | 'default'   // Warna standar seragam
    | 'ekonomi'   // Warna berdasarkan status kepemilikan rumah / pendapatan
    | 'sakramen'; // Warna berdasarkan kelengkapan sakramen (baptis/nikah)

export type BasemapType = 'satellite' | 'street' | 'dark' | 'osm';

/**
 * Interface untuk mengelola state panel yang sedang terbuka.
 * Prinsip Larman (Information Expert): Objek ini tahu posisinya sendiri di dalam stack.
 */
export interface GisPanel {
    id: string;               // ID unik instance panel (mencegah React Key Conflict)
    type: GisPanelType;       // Jenis komponen panel
    title: string;            // Judul pada header panel
    isVisible: boolean;       // Status visibility untuk animasi transisi
    data?: any;               // Payload data dinamis (misal: ID Keluarga yang diklik)
}
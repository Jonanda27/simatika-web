// src/lib/dummyGisData.ts
import { KeluargaData } from "@/types/keluarga";

export const dummyKeluargaGis: KeluargaData[] = [
    // ==========================================
    // DISTRIK: MIMIKA BARU (Pusat Kota / Sempan)
    // ==========================================
    {
        id: "dummy-1", no_kk_paroki: "3301010001", status_rumah: "Milik Sendiri",
        fasilitas_kamar_mandi: true, fasilitas_kamar_cuci: true, fasilitas_wc: true,
        pendapatan_per_bulan: 15500000, asuransi_kesehatan: "Asuransi Swasta",
        foto_rumah_url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=400&h=300",
        latitude: -4.5421, longitude: 136.8945,
        Umats: [
            { id: "u-1a", nama_lengkap: "Yohanes Kogoya", fam: "Kogoya", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1980-05-12", pekerjaan: "Karyawan PT. FI", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }, { jenis_sakramen: "Krisma" }, { jenis_sakramen: "Perkawinan" }] },
            { id: "u-1b", nama_lengkap: "Maria Magai", fam: "Magai", status_dalam_keluarga: "Istri", jenis_kelamin: "P", tanggal_lahir: "1985-08-20", pekerjaan: "Ibu Rumah Tangga", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }, { jenis_sakramen: "Krisma" }, { jenis_sakramen: "Perkawinan" }] },
            { id: "u-1c", nama_lengkap: "Yosep Kogoya", fam: "Kogoya", status_dalam_keluarga: "Anak", jenis_kelamin: "L", tanggal_lahir: "2010-01-10", pekerjaan: "Pelajar", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }] }
        ]
    },
    {
        id: "dummy-2", no_kk_paroki: "3301010002", status_rumah: "Kontrak/Sewa",
        fasilitas_kamar_mandi: true, fasilitas_kamar_cuci: false, fasilitas_wc: true,
        pendapatan_per_bulan: 3000000, asuransi_kesehatan: "KIS",
        foto_rumah_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400&h=300",
        latitude: -4.5312, longitude: 136.8812,
        Umats: [
            { id: "u-2a", nama_lengkap: "Petrus Tabuni", fam: "Tabuni", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1975-03-15", pekerjaan: "Petani", Sacraments: [{ jenis_sakramen: "Baptis" }] },
            { id: "u-2b", nama_lengkap: "Elisabeth Wenda", fam: "Wenda", status_dalam_keluarga: "Istri", jenis_kelamin: "P", tanggal_lahir: "1980-11-20", pekerjaan: "Petani", Sacraments: [{ jenis_sakramen: "Baptis" }] }
        ]
    },
    {
        id: "dummy-3", no_kk_paroki: "3301010003", status_rumah: "Numpang",
        fasilitas_kamar_mandi: false, fasilitas_kamar_cuci: false, fasilitas_wc: true,
        pendapatan_per_bulan: 1500000, asuransi_kesehatan: "Tidak Ada",
        foto_rumah_url: null,
        latitude: -4.5589, longitude: 136.9015,
        Umats: [
            { id: "u-3a", nama_lengkap: "Agustinus Degei", fam: "Degei", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1960-11-10", pekerjaan: "Tukang Ojek", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }] },
            { id: "u-3b", nama_lengkap: "Martha Pigai", fam: "Pigai", status_dalam_keluarga: "Istri", jenis_kelamin: "P", tanggal_lahir: "1965-02-05", pekerjaan: "Tidak Bekerja", Sacraments: [{ jenis_sakramen: "Baptis" }] },
            { id: "u-3c", nama_lengkap: "Lukas Degei", fam: "Degei", status_dalam_keluarga: "Anak", jenis_kelamin: "L", tanggal_lahir: "1995-09-09", pekerjaan: "Buruh Bangunan", Sacraments: [] }
        ]
    },

    // ==========================================
    // DISTRIK: KUALA KENCANA (Kawasan Utara)
    // ==========================================
    {
        id: "dummy-4", no_kk_paroki: "3301020001", status_rumah: "Milik Sendiri",
        fasilitas_kamar_mandi: true, fasilitas_kamar_cuci: true, fasilitas_wc: true,
        pendapatan_per_bulan: 18000000, asuransi_kesehatan: "Asuransi Swasta",
        foto_rumah_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400&h=300",
        latitude: -4.4250, longitude: 136.8810,
        Umats: [
            { id: "u-4a", nama_lengkap: "Fransiskus Mote", fam: "Mote", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1982-07-22", pekerjaan: "Staf Manajemen PT. FI", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }, { jenis_sakramen: "Krisma" }, { jenis_sakramen: "Perkawinan" }] },
            { id: "u-4b", nama_lengkap: "Veronika Gobai", fam: "Gobai", status_dalam_keluarga: "Istri", jenis_kelamin: "P", tanggal_lahir: "1986-04-15", pekerjaan: "PNS Dinkes", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }, { jenis_sakramen: "Krisma" }, { jenis_sakramen: "Perkawinan" }] }
        ]
    },
    {
        id: "dummy-5", no_kk_paroki: "3301020002", status_rumah: "Dinas",
        fasilitas_kamar_mandi: true, fasilitas_kamar_cuci: true, fasilitas_wc: true,
        pendapatan_per_bulan: 7500000, asuransi_kesehatan: "BPJS Kesehatan",
        foto_rumah_url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=400&h=300",
        latitude: -4.4180, longitude: 136.8920,
        Umats: [
            { id: "u-5a", nama_lengkap: "Stepanus Nawipa", fam: "Nawipa", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1988-04-18", pekerjaan: "Guru Sekolah Yayasan", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }] },
            { id: "u-5b", nama_lengkap: "Agnes Tekege", fam: "Tekege", status_dalam_keluarga: "Istri", jenis_kelamin: "P", tanggal_lahir: "1990-11-20", pekerjaan: "Guru Honorer", Sacraments: [{ jenis_sakramen: "Baptis" }] }
        ]
    },

    // ==========================================
    // DISTRIK: WANIA (Kawasan Selatan/Suburban)
    // ==========================================
    {
        id: "dummy-6", no_kk_paroki: "3301030001", status_rumah: "Milik Sendiri",
        fasilitas_kamar_mandi: true, fasilitas_kamar_cuci: false, fasilitas_wc: true,
        pendapatan_per_bulan: 4500000, asuransi_kesehatan: "BPJS Kesehatan",
        foto_rumah_url: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?auto=format&fit=crop&q=80&w=400&h=300",
        latitude: -4.5820, longitude: 136.9150,
        Umats: [
            { id: "u-6a", nama_lengkap: "Monika Keiya", fam: "Keiya", status_dalam_keluarga: "KK", jenis_kelamin: "P", tanggal_lahir: "1950-02-14", pekerjaan: "Wiraswasta Warung", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }, { jenis_sakramen: "Perkawinan" }] },
            { id: "u-6b", nama_lengkap: "Paulus Nawipa", fam: "Nawipa", status_dalam_keluarga: "Anak", jenis_kelamin: "L", tanggal_lahir: "1998-10-12", pekerjaan: "Montir Bengkel", Sacraments: [{ jenis_sakramen: "Baptis" }, { jenis_sakramen: "Komuni Pertama" }] }
        ]
    },
    {
        id: "dummy-7", no_kk_paroki: "3301030002", status_rumah: "Kontrak/Sewa",
        fasilitas_kamar_mandi: false, fasilitas_kamar_cuci: false, fasilitas_wc: true,
        pendapatan_per_bulan: 3500000, asuransi_kesehatan: "BPJS Ketenagakerjaan",
        foto_rumah_url: null,
        latitude: -4.5950, longitude: 136.9300,
        Umats: [
            { id: "u-7a", nama_lengkap: "Titus Douw", fam: "Douw", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1995-05-10", pekerjaan: "Karyawan Logistik", Sacraments: [{ jenis_sakramen: "Baptis" }] }
        ]
    },

    // ==========================================
    // DISTRIK: MIMIKA TIMUR (Mapurujaya/Pesisir)
    // ==========================================
    {
        id: "dummy-8", no_kk_paroki: "3301040001", status_rumah: "Milik Sendiri",
        fasilitas_kamar_mandi: false, fasilitas_kamar_cuci: false, fasilitas_wc: false,
        pendapatan_per_bulan: 2500000, asuransi_kesehatan: "KIS",
        foto_rumah_url: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400&h=300",
        latitude: -4.6820, longitude: 136.9760,
        Umats: [
            { id: "u-8a", nama_lengkap: "Korneles Mimika", fam: "Mimika", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1970-12-01", pekerjaan: "Nelayan Tradisional", Sacraments: [{ jenis_sakramen: "Baptis" }] },
            { id: "u-8b", nama_lengkap: "Yosephina Tipagau", fam: "Tipagau", status_dalam_keluarga: "Istri", jenis_kelamin: "P", tanggal_lahir: "1975-03-22", pekerjaan: "Pengolah Sagu", Sacraments: [] }
        ]
    },
    {
        id: "dummy-9", no_kk_paroki: "3301040002", status_rumah: "Kontrak/Sewa",
        fasilitas_kamar_mandi: true, fasilitas_kamar_cuci: false, fasilitas_wc: true,
        pendapatan_per_bulan: 2000000, asuransi_kesehatan: "Tidak Ada",
        foto_rumah_url: null,
        latitude: -4.6600, longitude: 136.9600,
        Umats: [
            { id: "u-9a", nama_lengkap: "Damianus Gobai", fam: "Gobai", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1992-06-15", pekerjaan: "Motoris Speedboat", Sacraments: [{ jenis_sakramen: "Baptis" }] }
        ]
    },

    // ==========================================
    // DISTRIK: AGIMUGA (Kawasan Timur Jauh/Remote)
    // ==========================================
    {
        id: "dummy-10", no_kk_paroki: "3301050001", status_rumah: "Milik Sendiri",
        fasilitas_kamar_mandi: false, fasilitas_kamar_cuci: false, fasilitas_wc: false,
        pendapatan_per_bulan: 1800000, asuransi_kesehatan: "KIS",
        foto_rumah_url: "https://images.unsplash.com/photo-1472224310890-672de3c901e1?auto=format&fit=crop&q=80&w=400&h=300",
        latitude: -4.6470, longitude: 137.5560,
        Umats: [
            { id: "u-10a", nama_lengkap: "Markus Degei", fam: "Degei", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1972-06-05", pekerjaan: "Petani Sagu/Berburu", Sacraments: [{ jenis_sakramen: "Baptis" }] },
            { id: "u-10b", nama_lengkap: "Katarina Mote", fam: "Mote", status_dalam_keluarga: "Istri", jenis_kelamin: "P", tanggal_lahir: "1978-08-11", pekerjaan: "Ibu Rumah Tangga", Sacraments: [{ jenis_sakramen: "Baptis" }] }
        ]
    },
    {
        id: "dummy-11", no_kk_paroki: "3301050002", status_rumah: "Numpang",
        fasilitas_kamar_mandi: false, fasilitas_kamar_cuci: false, fasilitas_wc: false,
        pendapatan_per_bulan: 1200000, asuransi_kesehatan: "Tidak Ada",
        foto_rumah_url: null,
        latitude: -4.5070, longitude: 137.3530,
        Umats: [
            { id: "u-11a", nama_lengkap: "Yustinus Alom", fam: "Alom", status_dalam_keluarga: "KK", jenis_kelamin: "L", tanggal_lahir: "1985-04-20", pekerjaan: "Buruh Angkut Sungai", Sacraments: [] }
        ]
    }
];
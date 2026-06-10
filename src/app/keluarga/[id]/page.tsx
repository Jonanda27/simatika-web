"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  ArrowLeft, MapPin, Users, Home, CheckCircle2, 
  Activity, Briefcase, GraduationCap, ShieldCheck, 
  Droplets, Bath, UserCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { keluargaService } from "@/services/keluarga.service";

// Dynamic import untuk Leaflet agar terhindar dari SSR Error
const MapDisplay = dynamic(() => import("@/components/map/MapDisplay"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
      <MapPin className="w-8 h-8 mr-2 opacity-50" /> Memuat Peta...
    </div>
  )
});

export default function DetailKeluargaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [keluarga, setKeluarga] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await keluargaService.getById(id);
        if (res.success && res.data) {
          setKeluarga(res.data);
        } else {
          setError("Data keluarga tidak ditemukan.");
        }
      } catch (err) {
        setError("Gagal mengambil data dari server.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-16 h-16 border-4 border-brown-200 border-t-brown-600 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-bold">Memuat Detail Keluarga...</p>
        </div>
      </div>
    );
  }

  if (error || !keluarga) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-xl text-center max-w-lg">
          <ShieldCheck className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Ada Masalah</h2>
          <p className="text-slate-500 mb-8">{error || "Data tidak ditemukan."}</p>
          <Button onClick={() => router.push("/")} className="bg-slate-900 text-white rounded-full px-8">
            <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const hasGps = keluarga.latitude && keluarga.longitude;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-24">
      
      {/* HEADER NAV */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="hover:bg-slate-100 rounded-full">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </Button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="w-8 h-8 relative">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="font-extrabold text-slate-800 tracking-tight">SIMATIKA</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        
        {/* HERO SECTION DETAIL */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="h-48 sm:h-64 bg-slate-900 relative">
            {keluarga.foto_rumah_url ? (
              <Image 
                src={keluarga.foto_rumah_url} 
                alt="Foto Rumah" 
                fill 
                className="object-cover opacity-60 mix-blend-luminosity"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-brown-900 to-slate-900"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Data Aktif
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-1">
                Data Lengkap Keluarga
              </h1>
              <p className="text-slate-300 font-mono text-lg opacity-90 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" /> No. KK: {keluarga.no_kk_paroki}
              </p>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Status Kepemilikan</p>
                <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Home className="w-5 h-5 text-brown-600" />
                  {keluarga.status_rumah || "Milik Sendiri"}
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-1">Status Menumpang</p>
                <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                  <Users className="w-5 h-5 text-brown-600" />
                  {keluarga.status_numpang || "Keluarga Utama"}
                </div>
              </div>
              <div className="col-span-2 pt-4 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-3">Fasilitas Properti</p>
                <div className="flex flex-wrap gap-3">
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${keluarga.fasilitas_kamar_mandi ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                    <Bath className="w-4 h-4" /> Kamar Mandi
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${keluarga.fasilitas_wc ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                    <Droplets className="w-4 h-4" /> Toilet / WC
                  </span>
                  <span className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${keluarga.fasilitas_kamar_cuci ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                    <Droplets className="w-4 h-4" /> Tempat Cuci
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-center flex flex-col justify-center">
              <h3 className="text-5xl font-extrabold text-brown-600 mb-2">{keluarga.Umats?.length || 0}</h3>
              <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">Total Anggota</p>
            </div>
          </div>
        </div>

        {/* MAP & MEMBERS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MEMBERS LIST (Takes 2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <Users className="w-6 h-6 text-brown-600" /> Profil Anggota Keluarga
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {keluarga.Umats && keluarga.Umats.map((umat: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brown-300 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-brown-50 text-brown-600 rounded-full flex items-center justify-center shrink-0">
                      <UserCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{umat.nama_lengkap}</h3>
                      <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        {umat.status_dalam_keluarga || "Anggota"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{umat.pekerjaan || "Belum ada data pekerjaan"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{umat.pendidikan_terakhir || "Belum ada data pendidikan"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Activity className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">Kesehatan: <span className="font-medium text-slate-800">{umat.status_kesehatan || "Sehat"}</span></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {(!keluarga.Umats || keluarga.Umats.length === 0) && (
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300">
                <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Data anggota belum diinputkan oleh Pengurus.</p>
              </div>
            )}
          </div>

          {/* GPS LOCATION MAP (Takes 1 column) */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-brown-600" /> Titik Lokasi GPS
            </h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-[400px] flex flex-col">
              {hasGps ? (
                <div className="flex-1 w-full relative z-0">
                  <MapDisplay lat={keluarga.latitude} lng={keluarga.longitude} />
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50">
                  <MapPin className="w-12 h-12 text-slate-300 mb-3" />
                  <h4 className="font-bold text-slate-700 mb-1">Koordinat Belum Tersedia</h4>
                  <p className="text-sm text-slate-500">Ketua KBG belum mengatur titik lokasi GPS untuk keluarga ini.</p>
                </div>
              )}
              {hasGps && (
                <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs font-mono text-slate-500">
                    {keluarga.latitude.toFixed(6)}, {keluarga.longitude.toFixed(6)}
                  </div>
                  <a 
                    href={`https://www.google.com/maps?q=${keluarga.latitude},${keluarga.longitude}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Buka di Google Maps &rarr;
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

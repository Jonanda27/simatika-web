"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, ShieldCheck, Users, MapPin, 
  CheckCircle2, UserCircle2, ArrowRight, 
  ChevronDown, BookOpen, Database, BarChart3, Cross, Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { keluargaService } from "@/services/keluarga.service";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const searchSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchResult(null);

    try {
      const data = await keluargaService.getAll({ search: searchQuery });
      
      if (data.success && data.data && data.data.length > 0) {
        // Harus persis sama dengan database
        const exactMatch = data.data.find((k: any) => k.no_kk_paroki === searchQuery);
        setSearchResult(exactMatch || null);
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.error("Gagal melakukan pencarian:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col relative overflow-hidden">
      
      {/* FIXED HEADER */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`relative rounded-xl overflow-hidden shadow-sm transition-all ${scrolled ? 'w-10 h-10' : 'w-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20 p-1'}`}>
              <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-md" />
            </div>
            <div>
              <h1 className={`font-extrabold tracking-tight leading-none transition-colors ${scrolled ? 'text-slate-900 text-lg' : 'text-white text-xl drop-shadow-md'}`}>SIMATIKA</h1>
              <p className={`font-bold uppercase tracking-widest mt-0.5 transition-colors ${scrolled ? 'text-brown-600 text-[9px]' : 'text-brown-200 text-[10px] drop-shadow'}`}>Keuskupan Timika</p>
            </div>
          </div>
          <Link href="/login">
            <Button className={`rounded-full px-6 font-semibold transition-all ${scrolled ? 'bg-brown-600 hover:bg-brown-700 text-white shadow-md' : 'bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md'}`}>
              <UserCircle2 className="w-4 h-4 mr-2" />
              Portal Pengurus
            </Button>
          </Link>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section className="relative w-full h-screen min-h-[700px] flex items-center justify-center pt-20">
        <div className="absolute inset-0 w-full h-full z-0">
          <Image 
            src="/hero_church.png" 
            alt="Church Hero" 
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
          {/* Complex Gradient Overlays for readability and mood */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b132b]/80 via-[#0b132b]/60 to-transparent mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brown-500/20 backdrop-blur-md border border-brown-400/30 text-brown-100 text-sm font-bold mb-6 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck className="w-4 h-4" />
            <span>Sistem Informasi Manajemen Terpadu</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Tata Kelola Pastoral <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brown-300 to-amber-200">
              Lebih Modern & Akurat
            </span>
          </h2>
          
          <p className="text-slate-300 text-lg sm:text-xl font-medium max-w-2xl mx-auto mb-10 drop-shadow-lg leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            Platform terpadu Paroki untuk mendata umat, mengelola sakramen, hingga memetakan penyebaran keluarga berbasis GPS secara *real-time*.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Button 
              onClick={scrollToSearch}
              className="h-14 px-8 bg-brown-600 hover:bg-brown-700 text-white rounded-full text-lg font-bold shadow-[0_0_40px_rgba(147,51,23,0.4)] transition-all hover:scale-105"
            >
              Cek Status Pendataan
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/login">
              <Button 
                variant="outline" 
                className="h-14 px-8 bg-white/5 hover:bg-white/15 border-white/30 text-white rounded-full text-lg font-bold backdrop-blur-md transition-all"
              >
                Masuk sebagai Admin
              </Button>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce cursor-pointer opacity-70 hover:opacity-100 transition-opacity" onClick={scrollToSearch}>
          <ChevronDown className="w-10 h-10 text-white" />
        </div>
      </section>

      {/* SECTION 2: STATISTIK (DUMMY) */}
      <section className="relative z-20 w-full max-w-6xl mx-auto px-6 -mt-24 sm:-mt-16">
        <div className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-[2rem] p-8 sm:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-around gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
          <div className="w-full flex flex-col items-center pt-4 md:pt-0">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 text-blue-600 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-4xl font-extrabold text-slate-800 mb-1">5.200+</h3>
            <p className="text-slate-500 font-medium">Umat Terdaftar</p>
          </div>
          
          <div className="w-full flex flex-col items-center pt-8 md:pt-0">
            <div className="w-14 h-14 bg-brown-50 rounded-2xl flex items-center justify-center mb-4 text-brown-600 shadow-inner">
              <Database className="w-7 h-7" />
            </div>
            <h3 className="text-4xl font-extrabold text-slate-800 mb-1">1.150</h3>
            <p className="text-slate-500 font-medium">Keluarga Katolik (KK)</p>
          </div>

          <div className="w-full flex flex-col items-center pt-8 md:pt-0">
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-4 text-green-600 shadow-inner">
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-4xl font-extrabold text-slate-800 mb-1">12</h3>
            <p className="text-slate-500 font-medium">Stasi Terlayani</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="py-24 bg-slate-50 w-full max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">Pilar Layanan SIMATIKA</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">Aplikasi ini dirancang khusus untuk mempermudah pelayanan gereja melalui digitalisasi data terpusat.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: "Sensus Umat Mandiri", desc: "Ketua KBG dapat langsung mendata umat dan melengkapi dokumen KK melalui perangkat masing-masing.", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Map, title: "Pemetaan Geospasial", desc: "Integrasi peta untuk mengetahui sebaran lokasi rumah umat beserta detail fasilitasnya secara visual.", color: "text-green-600", bg: "bg-green-50" },
            { icon: BookOpen, title: "Buku Sakramen Digital", desc: "Manajemen pencatatan Sakramen Baptis, Krisma, hingga Perkawinan secara rapi dan aman.", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: ArrowRight, title: "Mutasi Antar Paroki", desc: "Proses kepindahan umat dari dan ke paroki lain kini terpantau secara transparan dan terekam.", color: "text-orange-600", bg: "bg-orange-50" },
            { icon: ShieldCheck, title: "Verifikasi Berjenjang", desc: "Setiap data yang masuk akan divalidasi oleh Admin Stasi dan Paroki demi keabsahan data.", color: "text-brown-600", bg: "bg-brown-50" },
            { icon: BarChart3, title: "Statistik Real-time", desc: "Laporan demografi umat instan untuk membantu Pastor mengambil keputusan pastoral.", color: "text-rose-600", bg: "bg-rose-50" },
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group">
              <div className={`w-14 h-14 ${feat.bg} ${feat.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feat.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">{feat.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: SEARCH PORTAL */}
      <section ref={searchSectionRef} className="py-24 bg-white border-y border-slate-200/60 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brown-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-brown-50 rounded-full flex items-center justify-center text-brown-600 mb-8 shadow-sm border border-brown-100">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-4 text-center">
            Pencarian Data Umat
          </h2>
          <p className="text-slate-500 text-lg text-center max-w-2xl mb-12 font-medium">
            Masukkan Nomor Kartu Keluarga Paroki untuk mengecek status pendataan keluarga Anda. Pastikan Anda menghubungi Ketua KBG jika terdapat kekeliruan data.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brown-400 to-amber-300 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-xl overflow-hidden p-2 border border-slate-100">
              <div className="hidden sm:flex pl-4 pr-2 text-brown-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <Input 
                type="text"
                placeholder="Masukkan 16 Digit No. KK Paroki..."
                className="flex-1 h-14 sm:h-16 bg-transparent border-0 focus-visible:ring-0 text-lg sm:text-xl font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-semibold text-center sm:text-left"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="w-full sm:w-auto mt-2 sm:mt-0 h-14 sm:h-16 px-8 bg-slate-900 hover:bg-black text-white rounded-xl text-lg font-bold transition-all active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? "Mencari..." : "Cek Status"}
              </Button>
            </div>
          </form>

          {/* SEARCH RESULTS */}
          <div className="w-full mt-16 min-h-[300px] flex flex-col items-center">
            {hasSearched && isLoading && (
              <div className="flex flex-col items-center justify-center p-12 animate-pulse text-brown-600">
                <div className="w-12 h-12 border-4 border-brown-200 border-t-brown-600 rounded-full animate-spin mb-4"></div>
                <p className="font-bold text-lg">Mencari data ke database pusat...</p>
              </div>
            )}

            {hasSearched && !isLoading && !searchResult && (
              <div className="w-full max-w-2xl bg-rose-50/50 rounded-3xl p-10 shadow-lg border border-rose-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mb-6 text-rose-500">
                  <Cross className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Data Tidak Ditemukan</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Kami tidak menemukan data dengan Nomor KK <span className="font-bold text-slate-800">"{searchQuery}"</span>. 
                  Jika Anda merasa ini keliru, segera hubungi Ketua KBG Anda untuk melakukan pendataan ulang atau sinkronisasi.
                </p>
              </div>
            )}

            {hasSearched && !isLoading && searchResult && (
              <div className="w-full bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-white mb-1">Keluarga Terdaftar</h3>
                    <p className="text-slate-300 font-medium font-mono text-lg opacity-80">
                      KK: {searchResult.no_kk_paroki}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center relative z-10">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Family Details */}
                <div className="p-8 sm:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brown-600 shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">Status Tempat Tinggal</p>
                        <p className="text-slate-800 font-bold text-lg">{searchResult.status_numpang || "Keluarga Utama"}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-brown-600 shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">Status Kepemilikan Rumah</p>
                        <p className="text-slate-800 font-bold text-lg">{searchResult.status_rumah || "Milik Sendiri"}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                      <h4 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Users className="w-6 h-6 text-slate-400" />
                        Daftar Anggota Keluarga
                      </h4>
                      <span className="bg-brown-100 text-brown-800 text-sm font-bold px-4 py-1.5 rounded-full">
                        {searchResult.Umats?.length || 0} Orang
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResult.Umats && searchResult.Umats.map((umat: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-5 rounded-2xl border border-slate-200 hover:border-brown-400 hover:shadow-md transition-all group bg-white">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 group-hover:bg-brown-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-brown-600 transition-colors">
                              <UserCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-lg mb-0.5">{umat.nama_lengkap}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase">
                                  {umat.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                <span className="text-xs font-bold text-brown-600 uppercase bg-brown-50 px-2 py-0.5 rounded-sm">
                                  {umat.status_dalam_keluarga || "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {(!searchResult.Umats || searchResult.Umats.length === 0) && (
                        <div className="col-span-2 text-center p-8 text-slate-500 font-medium bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                          Data anggota belum diinputkan secara detail oleh pengurus.
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <Link href={`/keluarga/${searchResult.id}`}>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 font-bold shadow-md hover:shadow-lg transition-all">
                          Lihat Detail Lengkap
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 relative z-10 border-t border-slate-900">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 relative bg-white/5 rounded-xl border border-white/10 p-1">
                <Image src="/logo.png" alt="Logo" fill className="object-contain p-1 opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">SIMATIKA</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm mb-6">
              Sistem Informasi Manajemen Tata Laksana & Pastoral. Mendukung digitalisasi layanan Paroki demi pelayanan umat yang lebih cepat, transparan, dan akurat.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Tautan Penting</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li><a href="#" className="hover:text-brown-400 transition-colors">Beranda</a></li>
              <li><a href="#" className="hover:text-brown-400 transition-colors">Cek Status KK</a></li>
              <li><Link href="/login" className="hover:text-brown-400 transition-colors">Login Pengurus</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Kontak Sekretariat</h4>
            <ul className="space-y-3 text-sm font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-brown-500" />
                <span>Jl. Cendrawasih No. 45, Sempan, Timika, Papua Tengah</span>
              </li>
              <li className="flex items-start gap-3">
                <Database className="w-5 h-5 shrink-0 text-brown-500" />
                <span>sekretariat@simatika.id</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-full max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs font-medium">
          <p>&copy; {new Date().getFullYear()} Paroki St. Stefanus Sempan - Keuskupan Timika.</p>
          <p className="mt-2 sm:mt-0">Dibuat dengan ❤️ untuk Umat.</p>
        </div>
      </footer>
    </div>
  );
}

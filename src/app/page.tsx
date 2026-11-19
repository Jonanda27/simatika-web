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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (scrollContainerRef.current) {
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // adjust scroll speed
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);
    setSearchResult(null);

    try {
      const data = await keluargaService.publicSearch(searchQuery);
      
      if (data.success && data.data && data.data.length > 0) {
        // Karena endpoint publicSearch sudah melakukan pencocokan persis di backend, kita bisa langsung ambil data pertama
        setSearchResult(data.data[0]);
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
    <div className="min-h-screen bg-white font-sans flex flex-col relative overflow-x-hidden z-0">
      
      {/* GLOBAL AMBIENT SPLASHES */}
      <div className="absolute top-[50vh] -left-[20%] w-[80%] h-[800px] bg-brown-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[130vh] -right-[20%] w-[80%] h-[800px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-[210vh] left-1/4 w-1/2 h-[600px] bg-brown-600/5 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      
      {/* FIXED HEADER (LIGHT THEME) */}
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`relative transition-all ${scrolled ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-md" />
            </div>
            <div>
              <h1 className="font-extrabold tracking-tight leading-none text-black text-xl">
                SIMATIKA
              </h1>
            </div>
          </div>
          


          <Link href="/login">
            <Button className="rounded-none px-8 bg-brown-600 hover:bg-brown-700 text-white font-bold shadow-md shadow-brown-600/30">
              Masuk
            </Button>
          </Link>
        </div>
      </header>

      {/* SECTION 1: HERO (REFERENCE LAYOUT) */}
      <section className="relative w-full min-h-[100vh] pt-36 pb-24 overflow-visible bg-transparent flex items-center">

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start text-left">
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6 animate-in fade-in slide-in-from-bottom-6">
              Kelola Data <br className="hidden md:block" />
              <span className="relative inline-block">
                <span className="text-brown-600">Paroki</span> Anda
                {/* Brown Underline SVG */}
                <svg className="absolute w-full h-4 -bottom-1 left-0 text-brown-600" viewBox="0 0 200 20" preserveAspectRatio="none">
                  <path d="M0,10 Q100,20 200,5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span> <br className="hidden md:block" />
              Lebih Mudah.
            </h2>
            
            <p className="text-slate-500 text-lg sm:text-xl font-medium max-w-lg mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 delay-150">
              Sistem informasi terpadu untuk mendata umat, mengelola sakramen, dan memetakan penyebaran keluarga secara real-time demi pelayanan pastoral yang lebih baik.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full animate-in fade-in slide-in-from-bottom-10 delay-300">
              <Button 
                onClick={scrollToSearch}
                className="w-full sm:w-auto h-14 px-8 bg-brown-600 hover:bg-brown-700 text-white rounded-none text-lg font-bold shadow-lg shadow-brown-600/30 transition-transform hover:-translate-y-1"
              >
                Cari Data Umat
              </Button>
            </div>
          </div>

          {/* Right Column: 3 Pill Images Layout */}
          <div className="relative h-[550px] hidden lg:block animate-in zoom-in-95 duration-1000 -mt-32">
            {/* Left Pill */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-[350px] rounded-[100px] border-[12px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-10 translate-y-6 bg-slate-100">
              <Image src="/church_pill_left.png" alt="Church left" fill className="object-cover" />
            </div>

            {/* Center Pill (Largest, Overlaps) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-[450px] rounded-[120px] border-[12px] border-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-20 bg-slate-200">
              <Image src="/church_pill_center.png" alt="Church center" fill className="object-cover" />
            </div>

            {/* Right Pill */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-64 h-[350px] rounded-[100px] border-[12px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-10 translate-y-6 bg-slate-100">
              <Image src="/church_pill_right.png" alt="Church right" fill className="object-cover" />
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: TENTANG SIMATIKA */}
      <section className="py-12 bg-transparent relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative">
            <div className="absolute -inset-4 bg-brown-100/50 rounded-none blur-xl -z-10"></div>
            <div className="bg-white p-8 sm:p-10 rounded-none border border-slate-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brown-50 rounded-none -z-10"></div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-brown-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-brown-600/30">
                  <Database className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800">Basis Data Terpadu</h3>
                  <p className="text-slate-500 font-medium">Satu pintu untuk semua layanan</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Akurasi Data Tinggi</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">Mencegah duplikasi data dan memastikan setiap umat tercatat dengan valid melalui verifikasi berjenjang.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">Keputusan Tepat Sasaran</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">Membantu Pastor Paroki dalam mengambil keputusan pastoral berbasis data demografi yang terpusat.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 font-bold text-sm mb-6 shadow-sm">
              <BookOpen className="w-4 h-4" /> Tentang SIMATIKA
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight">
              Membangun Jemaat <br/>
              <span className="text-brown-600">Berbasis Data Terpadu</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Sistem Informasi Manajemen Tata Laksana & Pastoral (SIMATIKA) adalah inisiatif strategis gereja untuk mendigitalisasi administrasi umat. 
              Mulai dari sensus keluarga, pemetaan wilayah, hingga pencatatan sakramen, semuanya kini terintegrasi dalam satu platform cerdas yang aman dan mudah diakses oleh pengurus di setiap tingkatan.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="py-12 bg-transparent relative z-10 w-full max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-6 leading-tight">
              Pilar Layanan SIMATIKA
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">
              Aplikasi ini dirancang khusus untuk mempermudah pelayanan gereja melalui digitalisasi data terpusat secara akurat, cepat, dan transparan.
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-3 text-slate-500 font-medium bg-white px-5 py-3 rounded-full border border-slate-200 shadow-sm shrink-0">
            <span className="text-sm font-bold">Geser untuk melihat</span>
            <ArrowRight className="w-5 h-5 text-brown-500 animate-pulse" />
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex overflow-x-auto gap-6 pb-8 pt-4 -mx-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}`}
        >
          {[
            { icon: Users, title: "Sensus Umat Mandiri", desc: "Ketua KBG dapat langsung mendata umat dan melengkapi dokumen KK melalui perangkat masing-masing.", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Map, title: "Pemetaan Geospasial", desc: "Integrasi peta untuk mengetahui sebaran lokasi rumah umat beserta detail fasilitasnya secara visual.", color: "text-green-600", bg: "bg-green-50" },
            { icon: BookOpen, title: "Buku Sakramen Digital", desc: "Manajemen pencatatan Sakramen Baptis, Krisma, hingga Perkawinan secara rapi dan aman.", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: ArrowRight, title: "Mutasi Antar Paroki", desc: "Proses kepindahan umat dari dan ke paroki lain kini terpantau secara transparan dan terekam.", color: "text-orange-600", bg: "bg-orange-50" },
            { icon: ShieldCheck, title: "Verifikasi Berjenjang", desc: "Setiap data yang masuk akan divalidasi oleh Admin Stasi dan Paroki demi keabsahan data.", color: "text-brown-600", bg: "bg-brown-50" },
            { icon: BarChart3, title: "Statistik Real-time", desc: "Laporan demografi umat instan untuk membantu Pastor mengambil keputusan pastoral.", color: "text-rose-600", bg: "bg-rose-50" },
          ].map((feat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-none border border-slate-100 shadow-sm hover:shadow-xl transition-shadow group shrink-0 w-[85vw] sm:w-[380px] snap-center">
              <div className={`w-14 h-14 ${feat.bg} ${feat.color} rounded-none flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feat.icon className="w-7 h-7" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-3">{feat.title}</h4>
              <p className="text-slate-500 font-medium leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION: ALUR PENDATAAN */}
      <section className="py-12 bg-transparent border-t border-slate-200/60 relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-right mb-20 max-w-2xl ml-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 font-bold text-sm mb-6 shadow-sm">
              <ArrowRight className="w-4 h-4" /> Cara Kerja
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-4">Bagaimana SIMATIKA Bekerja?</h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed">Alur pendataan dirancang berjenjang untuk memastikan setiap informasi yang masuk ke basis data adalah valid dan dapat dipertanggungjawabkan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-1 bg-slate-200 -z-10 translate-y-[-50%]"></div>
            
            {[
              { step: "01", title: "Pendataan KBG", desc: "Ketua KBG mendata umat di lingkungannya melalui perangkat masing-masing.", icon: Users },
              { step: "02", title: "Validasi Stasi", desc: "Data diverifikasi kelengkapannya oleh admin di tingkat Stasi.", icon: ShieldCheck },
              { step: "03", title: "Persetujuan Paroki", desc: "Admin Paroki menyetujui data untuk masuk ke dalam Buku Induk.", icon: CheckCircle2 },
              { step: "04", title: "Data Terintegrasi", desc: "Data kini siap diakses untuk pencetakan, statistik, dan pemetaan.", icon: Database },
            ].map((item, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-slate-50 shadow-lg flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-transform duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-brown-500 to-amber-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <item.icon className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors relative z-10" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-sm z-20">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed px-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: SEARCH PORTAL */}
      <section ref={searchSectionRef} className="py-16 bg-transparent border-y border-slate-200/60 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brown-500/5 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="w-full max-w-4xl mx-auto px-6 flex flex-col items-center">
          <div className="w-20 h-20 bg-brown-50 rounded-none flex items-center justify-center text-brown-600 mb-8 shadow-sm border border-brown-100">
            <Search className="w-10 h-10" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mb-4 text-center">
            Pencarian Data Umat
          </h2>
          <p className="text-slate-500 text-lg text-center max-w-2xl mb-12 font-medium">
            Masukkan Nomor KK Paroki, Kode Unik Keluarga, atau Kode Unik Umat untuk mengecek status pendataan. Pastikan Anda menghubungi Ketua KBG jika terdapat kekeliruan data.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="w-full max-w-3xl relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brown-400 to-amber-300 rounded-none blur-md opacity-30 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-none shadow-xl overflow-hidden p-2 border border-slate-100">
              <div className="hidden sm:flex pl-4 pr-2 text-brown-600">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <Input 
                type="text"
                placeholder="Masukkan No. KK, Kode Keluarga, atau Kode Umat..."
                className="flex-1 h-14 sm:h-16 bg-transparent border-0 focus-visible:ring-0 text-lg sm:text-[17px] font-bold text-slate-800 placeholder:text-slate-300 placeholder:font-semibold text-center sm:text-left"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="w-full sm:w-auto mt-2 sm:mt-0 h-14 sm:h-16 px-8 bg-black hover:bg-slate-900 text-white rounded-none text-lg font-bold transition-all active:scale-95"
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
              <div className="w-full max-w-2xl bg-rose-50/50 rounded-none p-10 shadow-lg border border-rose-100 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-rose-100 rounded-none flex items-center justify-center mb-6 text-rose-500">
                  <Cross className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Data Tidak Ditemukan</h3>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Kami tidak menemukan data dengan Nomor/Kode <span className="font-bold text-slate-800">"{searchQuery}"</span>. 
                  Jika Anda merasa ini keliru, segera hubungi Ketua KBG Anda untuk melakukan pendataan ulang atau sinkronisasi.
                </p>
              </div>
            )}

            {hasSearched && !isLoading && searchResult && (
              <div className="w-full bg-white rounded-none shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-200/60 overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Result Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-none uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Terverifikasi
                      </div>
                    </div>
                    <h3 className="text-3xl font-extrabold text-white mb-1">Keluarga Terdaftar</h3>
                    <p className="text-slate-300 font-medium font-mono text-lg opacity-80">
                      No. KK: {searchResult.no_kk_paroki || '-'}
                    </p>
                    <p className="text-slate-400 font-medium font-mono text-sm mt-1">
                      Kode Keluarga: {searchResult.kode_unik_keluarga || '-'}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-none border border-white/20 flex items-center justify-center relative z-10">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Family Details */}
                <div className="p-8 sm:p-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    <div className="bg-slate-50 rounded-none p-5 border border-slate-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-none shadow-sm flex items-center justify-center text-brown-600 shrink-0">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-0.5">Status Tempat Tinggal</p>
                        <p className="text-slate-800 font-bold text-lg">{searchResult.status_numpang || "Keluarga Utama"}</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-none p-5 border border-slate-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-none shadow-sm flex items-center justify-center text-brown-600 shrink-0">
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
                      <span className="bg-brown-100 text-brown-800 text-sm font-bold px-4 py-1.5 rounded-none">
                        {searchResult.Umats?.length || 0} Orang
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResult.Umats && searchResult.Umats.map((umat: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-5 rounded-none border border-slate-200 hover:border-brown-400 hover:shadow-md transition-all group bg-white">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 group-hover:bg-brown-50 rounded-none flex items-center justify-center text-slate-400 group-hover:text-brown-600 transition-colors">
                              <UserCircle2 className="w-7 h-7" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-lg mb-0.5">{umat.nama_lengkap}</p>
                              <div className="text-[11px] font-mono font-medium text-brown-600 bg-brown-50 px-2 py-0.5 inline-block mb-1.5 border border-brown-100">
                                Kode Umat: {umat.nomor_induk_umat || '-'}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase">
                                  {umat.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                </span>
                                <span className="w-1 h-1 bg-slate-300 rounded-none"></span>
                                <span className="text-xs font-bold text-brown-600 uppercase bg-brown-50 px-2 py-0.5 rounded-none">
                                  {umat.status_dalam_keluarga || "-"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {(!searchResult.Umats || searchResult.Umats.length === 0) && (
                        <div className="col-span-2 text-center p-8 text-slate-500 font-medium bg-slate-50 rounded-none border border-dashed border-slate-200">
                          Data anggota belum diinputkan secara detail oleh pengurus.
                        </div>
                      )}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <Link href={`/keluarga/detail?id=${searchResult.id}`}>
                        <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-none px-8 h-12 font-bold shadow-md hover:shadow-lg transition-all">
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
      <footer className="bg-black text-slate-400 py-16 relative z-10 border-t border-white/10">
        <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 relative">
                <Image src="/logo.png" alt="Logo" fill className="object-contain opacity-80 hover:opacity-100 transition-opacity" />
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


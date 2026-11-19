"use client";

import { useState, useEffect } from "react";
import { 
  Users, Calendar, Save, Plus, Trash2, Shield, UserCircle2, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StyledSelect } from "@/components/ui/StyledSelect";
import { kepengurusanService } from "@/services/kepengurusan.service";
import { KepengurusanPayload } from "@/types/kepengurusan";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRef } from "react";

interface Pengurus {
  id: string; // temporary unique id for rendering
  jabatan: string;
  umat_id: string;
  nama: string;
  telepon: string;
}

const JABATAN_OPTIONS = [
  "Ketua",
  "Wakil Ketua",
  "Sekretaris",
  "Bendahara",
  "Seksi Liturgi",
  "Seksi Katekese/Pewartaan",
  "Seksi Sosial-Karitatif",
  "Seksi Keluarga",
  "Seksi Kepemudaan",
  "Seksi Kerasulan Awam",
  "Seksi Pengembangan Sosial Ekonomi (PSE)"
];

// Helper untuk men-generate array tahun
const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear - 5; i <= currentYear + 10; i++) {
    years.push(i.toString());
  }
  return years;
};

function SearchableUmatSelect({ 
  value, 
  onChange, 
  options, 
  placeholder 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: any[]; 
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = options.filter(opt => 
    opt.nama_lengkap.toLowerCase().includes(search.toLowerCase()) || 
    (opt.nomor_induk_umat && opt.nomor_induk_umat.toLowerCase().includes(search.toLowerCase()))
  ).slice(0, 50);

  const selected = options.find(o => o.id === value);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="h-11 w-full pl-11 pr-8 bg-white hover:bg-slate-50 border border-slate-200 focus:border-brown-500 rounded-none text-[14px] font-medium shadow-sm transition-all cursor-pointer flex items-center overflow-hidden"
      >
        <span className={selected ? "text-slate-900 truncate" : "text-slate-400 truncate"}>
          {selected ? `${selected.nama_lengkap} ${selected.nomor_induk_umat ? `(${selected.nomor_induk_umat})` : ''}` : placeholder}
        </span>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[9999] w-full mt-1 bg-white border border-slate-200 shadow-xl max-h-64 flex flex-col rounded-b-md">
          <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
            <input 
              type="text" 
              autoFocus
              className="w-full text-sm px-3 py-2 border border-slate-200 rounded-sm focus:outline-none focus:border-brown-500"
              placeholder="Ketik nama atau NIU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-y-auto flex-1 p-1 scrollbar-thin">
            {filtered.length === 0 ? (
              <div className="p-3 text-sm text-slate-500 text-center">Umat tidak ditemukan</div>
            ) : (
              filtered.map(opt => (
                <div 
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id);
                    setIsOpen(false);
                    setSearch("");
                  }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-brown-50 rounded-sm truncate ${value === opt.id ? 'bg-brown-100 text-brown-700 font-bold' : 'text-slate-700'}`}
                >
                  {opt.nama_lengkap} {opt.nomor_induk_umat && <span className="text-slate-400 text-xs ml-1">({opt.nomor_induk_umat})</span>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function KepengurusanKBGPage() {
  const { user } = useAuth();
  const [periodeMulai, setPeriodeMulai] = useState(new Date().getFullYear().toString());
  const [periodeSelesai, setPeriodeSelesai] = useState((new Date().getFullYear() + 3).toString());
  const [skFile, setSkFile] = useState<File | null>(null);
  const [resubmitId, setResubmitId] = useState<string | null>(null);
  
  const [daftarPengurus, setDaftarPengurus] = useState<Pengurus[]>([
    { id: crypto.randomUUID(), jabatan: "Ketua KBG", umat_id: "", nama: "", telepon: "" }
  ]);
  const [daftarUmat, setDaftarUmat] = useState<any[]>([]);

  useEffect(() => {
    // Ambil daftar umat yang berada dalam cakupan user
    const fetchUrl = user?.id_kbg ? `/umat?limit=1000&kbg_id=${user.id_kbg}` : '/umat?limit=1000';
    api.get(fetchUrl).then((res: any) => {
      if (res.data) {
        setDaftarUmat(res.data);
      }
    }).catch(console.error);
    
    const params = new URLSearchParams(window.location.search);
    const rId = params.get('resubmitId');
    if (rId) {
      setResubmitId(rId);
      // Fetch data
      api.get(`/verification/${rId}`)
      .then((res: any) => {
        if (res.data && res.data.payload_data) {
          const data = res.data.payload_data;
          setPeriodeMulai(data.periode_mulai || new Date().getFullYear().toString());
          setPeriodeSelesai(data.periode_selesai || (new Date().getFullYear() + 3).toString());
          if (data.pengurus && data.pengurus.length > 0) {
            setDaftarPengurus(data.pengurus.map((p: any) => ({
              id: crypto.randomUUID(),
              jabatan: p.jabatan,
              umat_id: p.umat_id || "",
              nama: p.nama,
              telepon: p.telepon
            })));
          }
        }
      }).catch((err: any) => {
        console.error("Gagal memuat data resubmit:", err);
      });
    } else if (user?.id_kbg) {
      // PRE-FILL JIKA SUDAH ADA PENGURUS AKTIF (Mode Update)
      api.get(`/kbg-pengurus/${user.id_kbg}`)
        .then((res: any) => {
          if (res.success && res.data && res.data.length > 0) {
            // Ambil data pengurus yang aktif saja
            const activePengurus = res.data.filter((p: any) => p.is_active);
            if (activePengurus.length > 0) {
              setPeriodeMulai(activePengurus[0].periode_mulai);
              setPeriodeSelesai(activePengurus[0].periode_selesai);
              
              setDaftarPengurus(activePengurus.map((p: any) => ({
                id: crypto.randomUUID(),
                jabatan: p.jabatan,
                umat_id: p.umat_id || "",
                nama: p.Umat?.nama_lengkap || p.nama_manual || "",
                telepon: p.nomor_telepon || ""
              })));
            }
          }
        }).catch(console.error);
    }
  }, [user?.id_kbg]);

  const addPengurus = () => {
    setDaftarPengurus([
      ...daftarPengurus,
      { id: crypto.randomUUID(), jabatan: "", umat_id: "", nama: "", telepon: "" }
    ]);
  };

  const removePengurus = (id: string) => {
    if (daftarPengurus.length === 1) return; // minimal 1
    setDaftarPengurus(daftarPengurus.filter(p => p.id !== id));
  };

  const updatePengurus = (id: string, field: keyof Pengurus, value: string) => {
    setDaftarPengurus(daftarPengurus.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: KepengurusanPayload = {
        kbg_id: user?.id_kbg || null,
        periode_mulai: periodeMulai,
        periode_selesai: periodeSelesai,
        type: 'KEPENGURUSAN',
        pengurus: daftarPengurus.map(p => ({
          jabatan: p.jabatan,
          umat_id: p.umat_id || undefined,
          nama: p.nama,
          telepon: p.telepon
        }))
      };

      if (resubmitId) {
        const formData = new FormData();
        formData.append("payload", JSON.stringify(payload));
        if (skFile) {
          formData.append("sk_file", skFile);
        }
        
        await api.put(`/sync/${resubmitId}`, formData);
        alert("Struktur Kepengurusan berhasil diperbarui dan dikirim ulang!");
      } else {
        await kepengurusanService.sync(payload, skFile);
        alert("Struktur Kepengurusan berhasil dikirim ke Verifikasi Paroki!");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  const yearOptions = getYearOptions();

  return (
    <div className="p-4 sm:p-8 min-h-full">
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* Header Text (optional, but requested to remove "header". I will just provide a clean title or just start with cards) */}
        <div className="flex flex-col mb-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-brown-50 border border-brown-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brown-600" />
            </div>
            Data Kepengurusan KBG
          </h2>
          <p className="text-sm text-slate-500 mt-2 ml-[3.25rem] font-medium">
            Perbarui struktur organisasi dan masa bakti pengurus KBG.
          </p>
        </div>

        {/* Periode Jabatan Card */}
        <div className="bg-white rounded-none shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-brown-50 border border-brown-100 rounded-none text-brown-700">
              <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Masa Bakti (Periode Jabatan)</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Mulai</Label>
              <StyledSelect 
                value={periodeMulai}
                onChange={setPeriodeMulai}
                options={yearOptions}
                placeholder="Pilih Tahun"
                icon={Calendar}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tahun Selesai</Label>
              <StyledSelect 
                value={periodeSelesai}
                onChange={setPeriodeSelesai}
                options={yearOptions}
                placeholder="Pilih Tahun"
                icon={Calendar}
              />
            </div>
          </div>
          
          <div className="px-6 pb-6 pt-2">
            <div className="bg-blue-50/30 border border-blue-100 rounded-none p-5">
              <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Bukti Verifikasi (Opsional)
              </Label>
              <div className="relative group">
                <Input 
                  type="file" 
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setSkFile(file);
                  }}
                  className="h-12 bg-white hover:bg-slate-50 border-blue-200 focus:border-blue-500 rounded-none text-[15px] font-medium transition-all file:bg-blue-100 file:text-blue-700 file:border-0 file:rounded-none file:px-4 file:py-1 file:mr-4 file:text-sm file:font-bold cursor-pointer"
                />
                {skFile && (
                  <p className="text-xs text-emerald-600 mt-2 font-bold flex items-center">
                    <span className="w-2 h-2 rounded-none bg-emerald-500 mr-2"></span>
                    File dilampirkan: {skFile.name}
                  </p>
                )}
                <p className="text-xs text-blue-600/70 mt-2 font-medium">Unggah Surat Keputusan (SK) Pengangkatan yang ditandatangani Pastor Paroki untuk memvalidasi kepengurusan ini.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Pengurus Card */}
        <div className="bg-white rounded-none shadow-sm border border-slate-200/80 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 border border-blue-100 rounded-none text-blue-700">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Susunan Pengurus</h2>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {daftarPengurus.map((pengurus, index) => (
              <div 
                key={pengurus.id} 
                className="relative bg-white border border-slate-200 rounded-none p-5 sm:p-6 shadow-sm transition-all hover:border-brown-300 hover:bg-slate-50/50 group"
              >
                <div className="absolute top-0 left-0 w-8 h-8 rounded-none bg-brown-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {index + 1}
                </div>
                
                {daftarPengurus.length > 1 && (
                  <button 
                    onClick={() => removePengurus(pengurus.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-none hover:bg-rose-50 border border-transparent hover:border-rose-200"
                    title="Hapus Pengurus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-4 sm:mt-2">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jabatan</Label>
                    <StyledSelect 
                      value={pengurus.jabatan}
                      onChange={(val) => updatePengurus(pengurus.id, "jabatan", val)}
                      options={JABATAN_OPTIONS}
                      placeholder="Pilih Jabatan..."
                      icon={Shield}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Umat</Label>
                    <div className="relative group/input">
                      <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-brown-600 transition-colors pointer-events-none z-10" />
                      <SearchableUmatSelect 
                        value={pengurus.umat_id || ""}
                        options={daftarUmat.filter(u => 
                          !daftarPengurus.some(p => p.umat_id === u.id && p.id !== pengurus.id)
                        )}
                        placeholder="-- Cari Nama Umat --"
                        onChange={(selectedId: string) => {
                          const selectedUmat = daftarUmat.find(u => u.id === selectedId);
                          setDaftarPengurus(daftarPengurus.map(p => 
                            p.id === pengurus.id ? { 
                              ...p, 
                              umat_id: selectedId, 
                              nama: selectedUmat?.nama_lengkap || "",
                              telepon: selectedUmat?.nomor_telepon || p.telepon
                            } : p
                          ));
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nomor WhatsApp</Label>
                    <div className="relative group/input">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-brown-600 transition-colors" />
                      <Input 
                        type="tel"
                        value={pengurus.telepon}
                        onChange={(e) => updatePengurus(pengurus.id, "telepon", e.target.value)}
                        placeholder="Contoh: 0812..."
                        className="h-11 pl-11 bg-white hover:bg-slate-50 border-slate-200 focus:border-brown-500 rounded-none text-[15px] font-medium shadow-sm transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center pt-4">
              <Button 
                onClick={addPengurus}
                variant="outline" 
                className="rounded-none text-brown-600 hover:text-brown-800 hover:bg-brown-50 font-bold border-2 border-dashed border-brown-200 w-full py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Pengurus Baru
              </Button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 pb-10">
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="rounded-none bg-brown-600 hover:bg-brown-700 text-white shadow-sm px-8 h-12 font-bold w-full sm:w-auto"
          >
            <Save className="h-5 w-5 mr-2" />
            {isLoading ? "Mengirim..." : "Simpan Struktur Kepengurusan"}
          </Button>
        </div>

      </div>
    </div>
  );
}


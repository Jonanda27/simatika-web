"use client";

import { useState } from "react";
import { 
  Users, Calendar, Save, Plus, Trash2, Shield, UserCircle2, Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StyledSelect } from "@/components/ui/StyledSelect";
import { kepengurusanService } from "@/services/kepengurusan.service";
import { KepengurusanPayload } from "@/types/kepengurusan";

interface Pengurus {
  id: string; // temporary unique id for rendering
  jabatan: string;
  nama: string;
  telepon: string;
}

const JABATAN_OPTIONS = [
  "Pastor Paroki",
  "Ketua DPP",
  "Wakil Ketua DPP",
  "Sekretaris",
  "Bendahara",
  "Bidang Liturgi (Pengudusan)",
  "Bidang Pewartaan (Kerygma)",
  "Bidang Persekutuan (Koinonia)",
  "Bidang Pelayanan (Diakonia)",
  "Bidang Kesaksian (Martiria)",
  "Dewan Keuangan Paroki (DKP)",
  "Koordinator Wilayah (Korwil)",
  "Ketua KBG",
  "Pengurus Tingkat Basis"
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

export default function KepengurusanKBGPage() {
  const [periodeMulai, setPeriodeMulai] = useState(new Date().getFullYear().toString());
  const [periodeSelesai, setPeriodeSelesai] = useState((new Date().getFullYear() + 3).toString());
  const [skFile, setSkFile] = useState<File | null>(null);
  
  const [daftarPengurus, setDaftarPengurus] = useState<Pengurus[]>([
    { id: crypto.randomUUID(), jabatan: "Ketua", nama: "", telepon: "" }
  ]);

  const addPengurus = () => {
    setDaftarPengurus([
      ...daftarPengurus,
      { id: crypto.randomUUID(), jabatan: "", nama: "", telepon: "" }
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
        kbg_id: null, // TODO: Ambil dari konteks/user saat ini
        periode_mulai: periodeMulai,
        periode_selesai: periodeSelesai,
        pengurus: daftarPengurus.map(p => ({
          jabatan: p.jabatan,
          nama: p.nama,
          telepon: p.telepon
        }))
      };

      await kepengurusanService.sync(payload, skFile);
      alert("Struktur Kepengurusan berhasil dikirim ke Karantina Paroki!");
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan saat menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  const yearOptions = getYearOptions();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      
      {/* Header Sticky */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-brown-600" />
            Data Kepengurusan KBG
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Perbarui struktur organisasi dan masa bakti pengurus KBG</p>
        </div>
        <div>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-brown-600 hover:bg-brown-700 text-white shadow-md shadow-brown-900/20 px-6 h-11 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Mengirim..." : "Simpan Struktur"}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full px-6 py-8 space-y-8">
        
        {/* Periode Jabatan Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
            <div className="p-2 bg-brown-100 rounded-lg text-brown-700">
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
            <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5">
              <Label className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-3 block flex items-center gap-2">
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
                  className="h-12 bg-white hover:bg-slate-50 border-blue-200 focus:border-blue-500 rounded-md text-[15px] font-medium transition-all file:bg-blue-100 file:text-blue-700 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:text-sm file:font-semibold cursor-pointer"
                />
                {skFile && (
                  <p className="text-xs text-green-600 mt-2 font-medium flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    File dilampirkan: {skFile.name}
                  </p>
                )}
                <p className="text-[11px] text-blue-600/70 mt-2 font-medium">Unggah Surat Keputusan (SK) Pengangkatan yang ditandatangani Pastor Paroki untuk memvalidasi kepengurusan ini.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daftar Pengurus Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Susunan Pengurus</h2>
            </div>
            <Button 
              onClick={addPengurus}
              variant="outline" 
              className="border-brown-200 text-brown-700 hover:bg-brown-50 hover:border-brown-300 transition-colors h-9"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tambah Baris
            </Button>
          </div>
          
          <div className="p-6 space-y-6">
            {daftarPengurus.map((pengurus, index) => (
              <div 
                key={pengurus.id} 
                className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:border-brown-300 hover:shadow-md group"
              >
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                
                {daftarPengurus.length > 1 && (
                  <button 
                    onClick={() => removePengurus(pengurus.id)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-md hover:bg-rose-50"
                    title="Hapus Pengurus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <div className="pl-12 grid grid-cols-1 md:grid-cols-3 gap-5">
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
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</Label>
                    <div className="relative group/input">
                      <UserCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within/input:text-brown-600 transition-colors" />
                      <Input 
                        value={pengurus.nama}
                        onChange={(e) => updatePengurus(pengurus.id, "nama", e.target.value)}
                        placeholder="Nama Pengurus..."
                        className="h-12 pl-11 bg-slate-50/50 hover:bg-slate-50 border-slate-200 focus:border-brown-500 rounded-md text-[15px] font-medium"
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
                        className="h-12 pl-11 bg-slate-50/50 hover:bg-slate-50 border-slate-200 focus:border-brown-500 rounded-md text-[15px] font-medium"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex justify-center pt-2">
              <Button 
                onClick={addPengurus}
                variant="ghost" 
                className="text-brown-600 hover:text-brown-800 hover:bg-brown-50 font-bold border border-dashed border-brown-200 w-full py-6"
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Pengurus Baru
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

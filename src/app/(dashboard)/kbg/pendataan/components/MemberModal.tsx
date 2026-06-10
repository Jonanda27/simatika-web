"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  X, User, Activity, Cross, Church, ChevronDown, 
  MapPin, Calendar, HeartPulse, GraduationCap, Briefcase, Users, Heart
} from "lucide-react";
import { StyledSelect } from "@/components/ui/StyledSelect";

export interface MemberFormData {
  id?: string;
  nama_lengkap?: string;
  fam?: string;
  suku?: string;
  tempat_lahir?: string;
  tgl_lahir?: string;
  jenis_kelamin?: string;
  status_keluarga?: string;
  pendidikan?: string;
  pekerjaan?: string;
  pendapatan?: string;
  asuransi?: string;
  kesehatan?: string;
  misa_frekuensi?: string;
  keaktifan?: string;
  petugas_liturgi?: string;
  status_pindah?: string;
  kursus_pastoral?: string;
  status_hidup?: string;
  meninggal_tempat?: string;
  meninggal_tgl?: string;
  
  has_baptis?: boolean;
  baptis_no_surat?: string;
  baptis_tempat?: string;
  baptis_tgl?: string;
  baptis_pastor?: string;
  baptis_wali?: string;

  has_komuni?: boolean;
  komuni_tempat?: string;
  komuni_tgl?: string;

  has_krisma?: boolean;
  krisma_nama?: string;
  krisma_tempat?: string;
  krisma_tgl?: string;

  has_perkawinan?: boolean;
  nikah_kategori?: string;
  nikah_tempat?: string;
  nikah_tgl?: string;

  has_imamat?: boolean;
  imamat_tempat?: string;
  imamat_tgl?: string;

  has_minyak_suci?: boolean;
  minyak_suci_tempat?: string;
  minyak_suci_tgl?: string;

  // File Uploads
  baptis_sertifikat_file?: File;
  komuni_sertifikat_file?: File;
  krisma_sertifikat_file?: File;
  nikah_sertifikat_file?: File;
}

interface Props {
  initialData: MemberFormData | null;
  onClose: () => void;
  onSave: (data: MemberFormData) => void;
}
interface StyledInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ElementType;
  prefix?: string;
}

const StyledInput = ({ value, onChange, placeholder, type = "text", icon: Icon, prefix }: StyledInputProps) => (
  <div className="relative group">
    {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brown-600 transition-colors" />}
    {prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">{prefix}</span>}
    <Input
      type={type}
      className={`h-12 bg-slate-50/50 hover:bg-slate-50 border-slate-200 focus:border-brown-500 focus:ring-4 focus:ring-brown-500/10 rounded-md text-[15px] font-medium transition-all ${Icon ? 'pl-11' : prefix ? 'pl-12' : 'pl-4'}`}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

// Reusable Sakramen Card Component
interface SakramenField {
  key: keyof MemberFormData;
  label: string;
  type?: string;
  placeholder?: string;
  fullWidth?: boolean;
  options?: string[];
}

interface SakramenCardProps {
  id: keyof MemberFormData;
  label: string;
  fields: SakramenField[];
  formData: MemberFormData;
  updateField: (key: keyof MemberFormData, value: any) => void;
}

const SakramenCard = ({ id, label, fields, formData, updateField }: SakramenCardProps) => {
  const isChecked = formData[id];
  return (
    <div className={`rounded-md border-2 transition-all duration-300 overflow-hidden ${isChecked ? 'border-brown-500 bg-brown-50/20 shadow-md' : 'border-slate-200 hover:border-slate-300 bg-white'}`}>
      <label className="flex items-center gap-4 p-5 cursor-pointer select-none">
        <div className="relative flex items-center justify-center">
          <Checkbox 
            id={id} 
            checked={(isChecked as boolean) || false} 
            onCheckedChange={(c: boolean) => updateField(id, c)}
            className="w-6 h-6 border-2 border-slate-300 data-[state=checked]:bg-brown-600 data-[state=checked]:border-brown-600 transition-all rounded-md"
          />
        </div>
        <div className="flex-1">
          <h4 className={`text-lg font-extrabold tracking-tight transition-colors ${isChecked ? 'text-brown-700' : 'text-slate-700'}`}>{label}</h4>
          <p className="text-xs font-medium text-slate-400 mt-0.5">Centang jika sudah menerima sakramen ini</p>
        </div>
      </label>
      
      {isChecked && (
        <div className="p-5 pt-0 border-t border-brown-100 bg-brown-50/30 animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field: SakramenField, idx: number) => (
              <div key={idx} className={field.fullWidth ? "sm:col-span-2" : ""}>
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">{field.label}</Label>
                {field.type === "select" ? (
                  <StyledSelect value={formData[field.key] as string | undefined} onChange={(v: string) => updateField(field.key, v)} options={field.options || []} placeholder={field.placeholder || `Pilih ${field.label}`} />
                ) : (
                  <StyledInput value={formData[field.key] as string | undefined} onChange={(v: string) => updateField(field.key, v)} type={field.type} placeholder={field.placeholder || `Masukkan ${field.label}`} />
                )}
              </div>
            ))}
            
            {/* Upload PDF Sertifikat (Hanya untuk Baptis, Komuni, Krisma, Perkawinan) */}
            {['has_baptis', 'has_komuni', 'has_krisma', 'has_perkawinan'].includes(id) && (
              <div className="sm:col-span-2 mt-2">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Upload Sertifikat (PDF)</Label>
                <div className="relative group">
                  <Input 
                    type="file" 
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const jenis = id.replace('has_', ''); // baptis, komuni, krisma, perkawinan
                        const mappedJenis = jenis === 'perkawinan' ? 'nikah' : jenis;
                        updateField(`${mappedJenis}_sertifikat_file` as keyof MemberFormData, file);
                      }
                    }}
                    className="h-12 bg-slate-50/50 hover:bg-slate-50 border-slate-200 focus:border-brown-500 rounded-md text-[15px] font-medium transition-all file:bg-brown-50 file:text-brown-700 file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:text-sm file:font-semibold cursor-pointer"
                  />
                  {(formData[`${id.replace('has_', '') === 'perkawinan' ? 'nikah' : id.replace('has_', '')}_sertifikat_file` as keyof MemberFormData] as File) && (
                    <p className="text-xs text-green-600 mt-2 font-medium flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      File dipilih: {(formData[`${id.replace('has_', '') === 'perkawinan' ? 'nikah' : id.replace('has_', '')}_sertifikat_file` as keyof MemberFormData] as File).name}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export function MemberModal({ initialData, onClose, onSave }: Props) {
  const [formData, setFormData] = useState<MemberFormData>(initialData || {});
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    { id: 0, label: "Profil Pribadi", icon: User },
    { id: 1, label: "Sosial Fisik", icon: Activity },
    { id: 2, label: "Data Sakramen", icon: Cross },
    { id: 3, label: "Gereja & Mutasi", icon: Church },
  ];

  const updateField = (key: keyof MemberFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleCurrencyChange = (val: string, key: keyof MemberFormData) => {
    const numericVal = val.replace(/\D/g, "");
    if (!numericVal) {
      updateField(key, "");
      return;
    }
    const formatted = parseInt(numericVal, 10).toLocaleString('id-ID');
    updateField(key, formatted);
  };

  const handleSave = () => {
    onSave(formData);
  };



  const renderTabProfil = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap Sesuai KTP</Label>
          <StyledInput 
            value={formData.nama_lengkap} 
            onChange={(v: string) => updateField("nama_lengkap", v.toUpperCase())} 
            placeholder="Masukkan nama lengkap..." 
            icon={User}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fam / Marga</Label>
          <StyledInput 
            value={formData.fam} 
            onChange={(v: string) => updateField("fam", v)} 
            placeholder="Contoh: Magai, Pigai..." 
            icon={Users}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Suku Asal</Label>
          <StyledSelect 
            value={formData.suku} 
            onChange={(v: string) => updateField("suku", v)} 
            placeholder="Pilih Suku"
            options={["Papua", "Luar Papua"]}
            icon={MapPin}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tempat Lahir</Label>
          <StyledInput 
            value={formData.tempat_lahir} 
            onChange={(v: string) => updateField("tempat_lahir", v)} 
            placeholder="Kota kelahiran..." 
            icon={MapPin}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Lahir</Label>
          <StyledInput 
            type="date"
            value={formData.tgl_lahir} 
            onChange={(v: string) => updateField("tgl_lahir", v)} 
            icon={Calendar}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis Kelamin</Label>
          <div className="flex gap-4 h-12">
            <label className={`flex-1 flex items-center justify-center gap-2 rounded-md border-2 cursor-pointer transition-all ${formData.jenis_kelamin === 'Laki-Laki' ? 'border-blue-500 bg-blue-50/50 text-blue-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
              <input type="radio" name="jk" className="hidden" checked={formData.jenis_kelamin === 'Laki-Laki'} onChange={() => updateField("jenis_kelamin", "Laki-Laki")} />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.jenis_kelamin === 'Laki-Laki' ? 'border-blue-500' : 'border-slate-300'}`}>
                {formData.jenis_kelamin === 'Laki-Laki' && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
              </div>
              <span className="font-bold">Laki-Laki</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-2 rounded-md border-2 cursor-pointer transition-all ${formData.jenis_kelamin === 'Perempuan' ? 'border-pink-500 bg-pink-50/50 text-pink-700' : 'border-slate-200 hover:bg-slate-50 text-slate-600'}`}>
              <input type="radio" name="jk" className="hidden" checked={formData.jenis_kelamin === 'Perempuan'} onChange={() => updateField("jenis_kelamin", "Perempuan")} />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.jenis_kelamin === 'Perempuan' ? 'border-pink-500' : 'border-slate-300'}`}>
                {formData.jenis_kelamin === 'Perempuan' && <div className="w-2 h-2 bg-pink-500 rounded-full" />}
              </div>
              <span className="font-bold">Perempuan</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status dalam Keluarga</Label>
          <StyledSelect 
            value={formData.status_keluarga} 
            onChange={(v: string) => updateField("status_keluarga", v)} 
            placeholder="Pilih Status"
            options={["Kepala Keluarga", "Istri", "Anak", "Suami", "Istri 2", "Duda", "Janda", "Lainnya"]}
            icon={Users}
          />
        </div>
      </div>
    </div>
  );

  const renderTabFisik = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendidikan Terakhir</Label>
          <StyledSelect 
            value={formData.pendidikan} 
            onChange={(v: string) => updateField("pendidikan", v)} 
            placeholder="Pilih Pendidikan"
            options={["Tidak Sekolah", "SD", "SMP", "SMA/SMK", "D1/D2/D3", "S1/D4", "S2", "S3"]}
            icon={GraduationCap}
          />
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pekerjaan Utama</Label>
          <StyledSelect 
            value={formData.pekerjaan} 
            onChange={(v: string) => updateField("pekerjaan", v)} 
            placeholder="Pilih Pekerjaan"
            options={["Petani", "Nelayan", "PNS", "Polisi", "TNI", "Dosen", "Guru", "Tukang Ojek", "Wiraswasta", "Dokter", "Perawat", "Karyawan Swasta", "Buruh", "Pensiunan", "Belum/Tidak Bekerja", "Lainnya"]}
            icon={Briefcase}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimasi Pendapatan/Bulan</Label>
          <StyledInput 
            type="text"
            value={formData.pendapatan} 
            onChange={(v: string) => handleCurrencyChange(v, "pendapatan")} 
            placeholder="1.000.000" 
            prefix="Rp."
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asuransi Kesehatan</Label>
          <StyledSelect 
            value={formData.asuransi} 
            onChange={(v: string) => updateField("asuransi", v)} 
            placeholder="Pilih Asuransi"
            options={["BPJS Ketenagakerjaan", "BPJS Kesehatan", "KIS", "Asuransi Swasta", "Tidak Ada"]}
            icon={HeartPulse}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Kesehatan Fisik</Label>
          <StyledSelect 
            value={formData.kesehatan} 
            onChange={(v: string) => updateField("kesehatan", v)} 
            placeholder="Pilih Kondisi"
            options={["Normal / Sehat", "Gangguan Fisik", "Sakit Kronis", "Disabilitas M/Mental"]}
            icon={Activity}
          />
        </div>
      </div>
    </div>
  );



  const renderTabSakramen = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500 pb-4">
      <SakramenCard 
        id="has_baptis" 
        label="Sakramen Baptis" 
        formData={formData}
        updateField={updateField}
        fields={[
          { key: "baptis_no_surat", label: "Nomor Surat Baptis", placeholder: "Contoh: 123/BPT/2020", fullWidth: true },
          { key: "baptis_tempat", label: "Tempat/Paroki Baptis", placeholder: "Nama Paroki" },
          { key: "baptis_tgl", label: "Tanggal Baptis", type: "date" },
          { key: "baptis_pastor", label: "Nama Pastor Pembangptis", placeholder: "P. Stefanus, OFM" },
          { key: "baptis_wali", label: "Nama Wali Baptis", placeholder: "Nama Wali" },
        ]}
      />
      <SakramenCard 
        id="has_komuni" 
        label="Komuni Pertama" 
        formData={formData}
        updateField={updateField}
        fields={[
          { key: "komuni_tempat", label: "Tempat/Paroki", placeholder: "Nama Paroki", fullWidth: true },
          { key: "komuni_tgl", label: "Tanggal Komuni", type: "date", fullWidth: true },
        ]}
      />
      <SakramenCard 
        id="has_krisma" 
        label="Sakramen Krisma" 
        formData={formData}
        updateField={updateField}
        fields={[
          { key: "krisma_nama", label: "Nama Pelindung Krisma", placeholder: "Contoh: Paulus", fullWidth: true },
          { key: "krisma_tempat", label: "Tempat/Paroki", placeholder: "Nama Paroki" },
          { key: "krisma_tgl", label: "Tanggal Krisma", type: "date" },
        ]}
      />
      <SakramenCard 
        id="has_perkawinan" 
        label="Sakramen Perkawinan" 
        formData={formData}
        updateField={updateField}
        fields={[
          { key: "nikah_kategori", label: "Kategori Perkawinan", type: "select", options: ["Katolik - Katolik", "Katolik - Protestan", "Katolik - Islam", "Dispensasi", "Perkawinan KUA", "Catatan Sipil", "Tradisional"], fullWidth: true },
          { key: "nikah_tempat", label: "Tempat/Paroki", placeholder: "Nama Paroki" },
          { key: "nikah_tgl", label: "Tanggal Perkawinan", type: "date" },
        ]}
      />
      <SakramenCard 
        id="has_imamat" 
        label="Sakramen Imamat / Kaul Kekal" 
        formData={formData}
        updateField={updateField}
        fields={[
          { key: "imamat_tempat", label: "Tempat/Paroki", placeholder: "Nama Paroki", fullWidth: true },
          { key: "imamat_tgl", label: "Tanggal Tahbisan/Kaul", type: "date", fullWidth: true },
        ]}
      />
      <SakramenCard 
        id="has_minyak_suci" 
        label="Sakramen Minyak Suci" 
        formData={formData}
        updateField={updateField}
        fields={[
          { key: "minyak_suci_tempat", label: "Tempat/Paroki", placeholder: "Nama Paroki", fullWidth: true },
          { key: "minyak_suci_tgl", label: "Tanggal Penerimaan", type: "date", fullWidth: true },
        ]}
      />
    </div>
  );

  const renderTabGereja = () => {
    const isDeceased = formData.status_hidup === "Meninggal Dunia";
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frekuensi Misa</Label>
            <StyledSelect value={formData.misa_frekuensi} onChange={(v: string) => updateField("misa_frekuensi", v)} options={["Harian", "Mingguan", "Hari Raya", "Jarang", "Tidak Pernah"]} placeholder="Pilih Frekuensi" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Keaktifan Bergereja</Label>
            <StyledSelect value={formData.keaktifan} onChange={(v: string) => updateField("keaktifan", v)} options={["Aktif Paroki", "Aktif Lingkungan", "Aktif Wilayah", "Aktif Kategorial", "Tidak Aktif"]} placeholder="Pilih Keaktifan" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Petugas Liturgi</Label>
            <StyledSelect value={formData.petugas_liturgi} onChange={(v: string) => updateField("petugas_liturgi", v)} options={["Lektor", "Prodiakon", "Koor/Dirigen", "Misdinar", "Bukan Petugas"]} placeholder="Pilih Status" />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status Perpindahan</Label>
            <StyledSelect value={formData.status_pindah} onChange={(v: string) => updateField("status_pindah", v)} options={["Menetap", "Pindah Basis", "Pindah Stasi", "Pindah Paroki", "Pindah Dekenat", "Pindah Keuskupan"]} placeholder="Pilih Status" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Riwayat Kursus Pastoral</Label>
            <StyledInput value={formData.kursus_pastoral} onChange={(v: string) => updateField("kursus_pastoral", v)} placeholder="Contoh: Kursus Evangelisasi Pribadi (KEP)" />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <h4 className="font-extrabold text-slate-800 text-lg flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-rose-500" /> Status Kehidupan
          </h4>
          <div className="flex gap-4 h-14">
            <label className={`flex-1 flex items-center justify-center gap-3 rounded-md border-2 cursor-pointer transition-all ${formData.status_hidup !== 'Meninggal Dunia' ? 'border-green-500 bg-green-50/50 text-green-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}>
              <input type="radio" name="sh" className="hidden" checked={formData.status_hidup !== 'Meninggal Dunia'} onChange={() => updateField("status_hidup", "Hidup")} />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.status_hidup !== 'Meninggal Dunia' ? 'border-green-500' : 'border-slate-300'}`}>
                {formData.status_hidup !== 'Meninggal Dunia' && <div className="w-2.5 h-2.5 bg-green-500 rounded-full" />}
              </div>
              <span className="font-bold text-lg">Masih Hidup</span>
            </label>
            <label className={`flex-1 flex items-center justify-center gap-3 rounded-md border-2 cursor-pointer transition-all ${formData.status_hidup === 'Meninggal Dunia' ? 'border-rose-500 bg-rose-50/50 text-rose-700 shadow-sm' : 'border-slate-200 hover:bg-slate-50 text-slate-500'}`}>
              <input type="radio" name="sh" className="hidden" checked={formData.status_hidup === 'Meninggal Dunia'} onChange={() => updateField("status_hidup", "Meninggal Dunia")} />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.status_hidup === 'Meninggal Dunia' ? 'border-rose-500' : 'border-slate-300'}`}>
                {formData.status_hidup === 'Meninggal Dunia' && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />}
              </div>
              <span className="font-bold text-lg">Meninggal Dunia</span>
            </label>
          </div>

          {isDeceased && (
            <div className="mt-6 bg-rose-50 p-6 border-2 border-rose-100 rounded-md animate-in zoom-in-95 duration-300">
              <h3 className="font-extrabold text-rose-800 text-lg mb-4 flex items-center gap-2">Detail Kematian</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-rose-600/70 uppercase tracking-wider">Tempat Meninggal</Label>
                  <StyledInput value={formData.meninggal_tempat} onChange={(v: string) => updateField("meninggal_tempat", v)} placeholder="Rumah Sakit / Rumah" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-rose-600/70 uppercase tracking-wider">Tanggal Meninggal</Label>
                  <StyledInput type="date" value={formData.meninggal_tgl} onChange={(v: string) => updateField("meninggal_tgl", v)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-md shadow-[0_30px_100px_rgba(0,0,0,0.3)] w-full max-w-3xl max-h-[95vh] flex flex-col overflow-hidden ring-1 ring-slate-900/10 animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="relative px-8 py-6 bg-gradient-to-r from-brown-900 to-slate-900 text-white flex items-center justify-between shrink-0 overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-extrabold tracking-tight mb-1">
              {initialData ? "Ubah Data Anggota" : "Registrasi Anggota Baru"}
            </h2>
            <p className="text-brown-200 text-sm font-medium">Lengkapi form di bawah ini dengan data yang valid.</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="relative z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex border-b border-slate-200 px-4 bg-slate-50 shrink-0 overflow-x-auto scrollbar-hide shadow-inner">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 whitespace-nowrap px-4 py-4 text-sm font-bold transition-all relative min-w-[150px] ${
                activeTab === tab.id
                  ? "text-brown-700 bg-white"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-brown-600' : 'text-slate-400'}`} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brown-600 rounded-t-full shadow-[0_-2px_10px_rgba(139,92,24,0.4)]" />
              )}
            </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {activeTab === 0 && renderTabProfil()}
          {activeTab === 1 && renderTabFisik()}
          {activeTab === 2 && renderTabSakramen()}
          {activeTab === 3 && renderTabGereja()}
        </div>

        {/* FOOTER ACTION */}
        <div className="p-6 border-t border-slate-200 bg-white shrink-0 flex justify-between items-center gap-4 rounded-b-md">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="rounded-md px-6 h-12 font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            Batalkan
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-brown-600 hover:bg-brown-700 active:bg-brown-800 text-white rounded-md px-10 h-12 shadow-lg shadow-brown-600/20 font-bold transition-all hover:translate-y-[-2px]"
          >
            {initialData ? "Simpan Perubahan" : "Tambahkan Anggota"}
          </Button>
        </div>

      </div>
    </div>
  );
}

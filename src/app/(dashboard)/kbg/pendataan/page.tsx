"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle } from "lucide-react";
import { StepIdentitas } from "./components/StepIdentitas";
import { StepFasilitas } from "./components/StepFasilitas";
import { StepAnggota } from "./components/StepAnggota";
import { api } from "@/lib/api";
import { useDrafts } from "@/hooks/useDrafts";
import { FamilyFormData } from "@/types/family";

export default function PendataanPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FamilyFormData>({
    no_kk_paroki: "",
    status_numpang: "",
    lat: null,
    lng: null,
    foto_rumah_path: null,
    foto_rumah_file: null,
    fasilitas_kamar_mandi: false,
    fasilitas_kamar_cuci: false,
    fasilitas_wc: false,
    status_rumah: "",
    pendapatan_per_bulan: "",
    asuransi_kesehatan: "",
    members: []
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { drafts, deleteDraft } = useDrafts();

  useEffect(() => {
    // Membaca draftId dari URL
    const params = new URLSearchParams(window.location.search);
    const id = params.get('draftId');
    if (id) {
      setDraftId(id);
      const found = drafts.find((d: any) => d.id === id);
      if (found && found.data) {
        const loadedData = { ...found.data };
        if (loadedData.anggota && !loadedData.members) {
          loadedData.members = loadedData.anggota;
        }
        setFormData((prev) => ({ ...prev, ...loadedData }));
      }
    }
  }, [drafts]);

  const updateField = (field: keyof FamilyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setError(null);

    // Validasi
    if (!formData.no_kk_paroki) return setError("Nomor KK Paroki wajib diisi!");
    if (!formData.status_numpang) return setError("Status Menumpang wajib dipilih!");
    if (!formData.status_rumah) return setError("Status Kepemilikan Rumah wajib dipilih!");
    if (!formData.members || formData.members.length === 0) return setError("Minimal harus ada 1 anggota keluarga!");

    setIsSaving(true);
    
    try {
      const dataToSend = new FormData();
      
      // Ambil file foto jika ada
      if (formData.foto_rumah_file) {
        dataToSend.append("foto_rumah", formData.foto_rumah_file);
      } else if (!formData.foto_rumah_path) {
        // Jika tidak ada file baru dan tidak ada preview
        return setError("Foto Rumah wajib diunggah!");
      }

      // Buat payload JSON dari formData (kecuali file)
      const payloadObj = JSON.parse(JSON.stringify(formData)); // Deep copy sederhana
      
      // Bersihkan properti file foto rumah
      delete payloadObj.foto_rumah_file;
      delete payloadObj.foto_rumah_path;

      // Sisipkan file sertifikat anggota ke FormData & hapus dari JSON payload
      if (payloadObj.members && payloadObj.members.length > 0) {
        payloadObj.members.forEach((member: any, index: number) => {
          const sakramens = ['baptis', 'komuni', 'krisma', 'nikah'];
          sakramens.forEach((sakramen) => {
            const fileKey = `${sakramen}_sertifikat_file`;
            const file = (formData.members[index] as any)[fileKey] as File;
            if (file) {
              dataToSend.append(`sertifikat_${sakramen}_${index}`, file);
            }
            // Hapus referensi file agar tidak terbawa ke JSON text
            delete member[fileKey];
          });
        });
      }

      dataToSend.append("payload", JSON.stringify(payloadObj));

      // Kirim ke API backend
      await api.post("/sync", dataToSend);

      alert("Sensus Keluarga Berhasil Disimpan ke Database!");
      
      // Hapus dari draft lokal jika berasal dari draft
      if (draftId) {
        deleteDraft(draftId);
      }

      // Reset form
      setFormData({
        no_kk_paroki: "",
        status_numpang: "",
        lat: null,
        lng: null,
        foto_rumah_path: null,
        foto_rumah_file: null,
        fasilitas_kamar_mandi: false,
        fasilitas_kamar_cuci: false,
        fasilitas_wc: false,
        status_rumah: "",
        pendapatan_per_bulan: "",
        asuransi_kesehatan: "",
        members: []
      });
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Sticky */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-6 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-slate-800">Pendataan Umat</h1>
          <p className="text-sm text-slate-500">Input Data Sensus Keluarga (Ketua KBG)</p>
        </div>
        <div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-brown-600 hover:bg-brown-700 text-white shadow-md shadow-brown-900/20 px-6"
          >
            {isSaving ? (
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Simpan & Kirim
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Kolom Kiri: Identitas & Fasilitas */}
          <div className="xl:col-span-1 space-y-6">
            <StepIdentitas data={formData} updateField={updateField} />
            <StepFasilitas data={formData} updateField={updateField} />
          </div>

          {/* Kolom Kanan: Anggota Keluarga */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-md shadow-sm border border-slate-200 p-8 h-full min-h-[600px] ring-1 ring-slate-900/5">
              <StepAnggota data={formData} updateField={updateField} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

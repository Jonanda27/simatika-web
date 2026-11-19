"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle, UserPlus, GitBranch } from "lucide-react";
import { StepIdentitas } from "./components/StepIdentitas";
import { StepFasilitas } from "./components/StepFasilitas";
import { StepAnggota } from "./components/StepAnggota";
import { SearchUmatModal } from "./components/SearchUmatModal";
import { api } from "@/lib/api";
import { useDrafts } from "@/hooks/useDrafts";
import { FamilyFormData } from "@/types/family";
import { UmatData } from "@/types/umat";
import { keluargaService } from "@/services/keluarga.service";

export default function PendataanPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [resubmitId, setResubmitId] = useState<string | null>(null);
  const [isPecahKkMode, setIsPecahKkMode] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const [formData, setFormData] = useState<FamilyFormData & { type?: string }>({
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
    const params = new URLSearchParams(window.location.search);
    const dId = params.get('draftId');
    const rId = params.get('resubmitId');

    if (dId) {
      setDraftId(dId);
      const found = drafts.find((d: any) => d.id === dId);
      if (found && found.data) {
        const loadedData = { ...found.data };
        if (loadedData.anggota && !loadedData.members) {
          loadedData.members = loadedData.anggota;
        }
        setFormData((prev) => ({ ...prev, ...loadedData }));
      }
    } else if (rId) {
      setResubmitId(rId);
      // Fetch data from backend for resubmission
      api.get(`/verification/${rId}`).then((res) => {
        if (res.data && res.data.payload_data) {
          const loadedData = res.data.payload_data;
          // Set preview image if exists
          if (loadedData.foto_rumah_url) {
            loadedData.foto_rumah_path = loadedData.foto_rumah_url;
          }
          if (loadedData.kk_url) {
            loadedData.kk_url_path = loadedData.kk_url;
          }
          if (loadedData.type === 'PECAH_KK') {
            setIsPecahKkMode(true);
          }
          setFormData((prev) => ({ ...prev, ...loadedData }));
        }
      }).catch(err => {
        console.error("Gagal memuat data resubmit:", err);
        setError("Gagal memuat data yang akan diperbaiki.");
      });
    }

    const uId = params.get('updateFamilyId');
    if (uId) {
      keluargaService.getById(uId).then((res) => {
        if (res.data) {
          const family = res.data;
          const members = (family.Umats || []).map((u: any) => ({
            existing_umat_id: u.id,
            nama_lengkap: u.nama_lengkap,
            tempat_lahir: u.tempat_lahir,
            tanggal_lahir: u.tanggal_lahir,
            jenis_kelamin: u.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
            status_dalam_keluarga: u.status_dalam_keluarga,
            pekerjaan: u.pekerjaan,
            pendidikan_terakhir: u.pendidikan_terakhir,
            suku: u.suku,
            status_kesehatan: u.status_kesehatan
          }));

          setFormData((prev) => ({
            ...prev,
            type: 'UPDATE_KELUARGA',
            existing_family_id: family.id,
            no_kk_paroki: family.no_kk_paroki || "",
            status_rumah: family.status_rumah || "",
            fasilitas_kamar_mandi: !!family.fasilitas_kamar_mandi,
            fasilitas_kamar_cuci: !!family.fasilitas_kamar_cuci,
            fasilitas_wc: !!family.fasilitas_wc,
            lat: family.latitude || null,
            lng: family.longitude || null,
            foto_rumah_path: family.foto_rumah_url || null,
            kk_url_path: family.kk_url || null,
            members
          } as any));
        }
      }).catch(err => {
        console.error("Gagal memuat data keluarga:", err);
        setError("Gagal memuat data keluarga yang akan diupdate.");
      });
    }
  }, [drafts]);

  const updateField = (field: keyof FamilyFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectUmat = (umat: UmatData) => {
    setIsPecahKkMode(true);
    setFormData(prev => ({
      ...prev,
      type: 'PECAH_KK',
      members: [{
        existing_umat_id: umat.id,
        nama_lengkap: umat.nama_lengkap,
        tempat_lahir: umat.tempat_lahir,
        tanggal_lahir: umat.tanggal_lahir,
        jenis_kelamin: umat.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan',
        status_dalam_keluarga: "KK",
        pendidikan_terakhir: umat.pendidikan_terakhir,
        pekerjaan: umat.pekerjaan,
        is_katolik: true
      } as any]
    }));
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
        return setError("Foto Rumah wajib diunggah!");
      }

      if (formData.file_kk) {
        dataToSend.append("file_kk", formData.file_kk);
      }

      // Buat payload JSON dari formData (kecuali file)
      const payloadObj = JSON.parse(JSON.stringify(formData));
      
      // Bersihkan properti file
      delete payloadObj.foto_rumah_file;
      delete payloadObj.foto_rumah_path;
      delete payloadObj.file_kk;
      delete payloadObj.kk_url_path;

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
            delete member[fileKey];
          });
        });
      }

      dataToSend.append("payload", JSON.stringify(payloadObj));

      // Jika resubmit, gunakan PUT /sync/:id, else POST /sync
      if (resubmitId) {
        await api.put(`/sync/${resubmitId}`, dataToSend);
        alert("Data Sensus Berhasil Diperbarui dan dikirim ulang!");
      } else {
        await api.post("/sync", dataToSend);
        alert(isPecahKkMode ? "Pengajuan Pecah KK Berhasil Disimpan ke Database!" : "Sensus Keluarga Berhasil Disimpan ke Database!");
      }
      
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
        kk_url_path: null,
        file_kk: null,
        members: []
      });
      setIsPecahKkMode(false);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] bg-transparent relative">
      

      {/* Main Content Area */}
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-none flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {isPecahKkMode && !resubmitId && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-none flex flex-col gap-1">
            <span className="font-bold flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Mode Pecah KK Aktif
            </span>
            <span className="text-sm">Anda sedang membuat KK baru berdasarkan data umat yang telah terdaftar. Lengkapi data rumah tangga baru di bawah ini.</span>
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
            <div className="bg-white rounded-none border border-slate-200/80 p-6 sm:p-8 h-full min-h-[600px]">
              <StepAnggota data={formData as any} updateField={updateField} />
            </div>
          </div>

        </div>

        {/* Floating Action Buttons di Bawah */}
        <div className="mt-8 flex justify-end gap-4 border-t border-slate-200/60 pt-6">
          {!resubmitId && !isPecahKkMode && (
            <Button
              variant="outline"
              onClick={() => setShowSearchModal(true)}
              className="text-brown-700 border-brown-300 hover:bg-brown-50 rounded-none h-12 px-6"
            >
              <GitBranch className="h-5 w-5 mr-2" />
              Pecah KK (Pilih Umat)
            </Button>
          )}
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-brown-600 to-brown-700 hover:from-brown-700 hover:to-brown-800 text-white   px-8 h-12 rounded-none font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSaving ? (
              <div className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin mr-2" />
            ) : (
              <Save className="h-5 w-5 mr-2" />
            )}
            Simpan & Kirim
          </Button>
        </div>
      </div>

      <SearchUmatModal 
        open={showSearchModal} 
        onOpenChange={setShowSearchModal}
        onSelectUmat={handleSelectUmat}
      />
    </div>
  );
}


"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, MapPin, Camera, Home, Crosshair, Map } from "lucide-react";
import dynamic from "next/dynamic";
import { FamilyFormData } from "@/types/family";

const MapPickerModal = dynamic(() => import("./MapPickerModal"), { 
  ssr: false, 
  loading: () => <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 sm:p-6 backdrop-blur-sm"><div className="bg-white p-8 rounded-md shadow-xl flex items-center gap-3"><div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div><span className="font-semibold text-slate-700">Memuat Peta...</span></div></div> 
});

interface Props {
  data: FamilyFormData;
  updateField: (key: keyof FamilyFormData, value: any) => void;
}

export function StepIdentitas({ data, updateField }: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const hasGps = data.lat && data.lng;

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateField("lat", position.coords.latitude);
          updateField("lng", position.coords.longitude);
        },
        (error) => {
          alert("Gagal mendapatkan lokasi GPS: " + error.message);
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser ini.");
    }
  };

  const handleMapSave = (lat: number, lng: number) => {
    updateField("lat", lat);
    updateField("lng", lng);
    setIsMapOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateField("foto_rumah_path", url); // for preview
      updateField("foto_rumah_file", file); // for upload
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 border-0 shadow-sm ring-1 ring-slate-900/5 rounded-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-brown-50 to-brown-100 rounded-xl text-brown-600 shadow-inner">
            <CreditCard className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 tracking-tight">Identitas Utama</h2>
            <p className="text-sm text-slate-500">Nomor KK & Status Tempat Tinggal</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="no_kk_paroki">Nomor Kartu Keluarga (KK)</Label>
            <Input
              id="no_kk_paroki"
              type="number"
              placeholder="Masukkan nomor KK"
              value={data.no_kk_paroki || ""}
              onChange={(e) => updateField("no_kk_paroki", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status_numpang">Status Tinggal</Label>
            <div className="relative">
              <Home className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                id="status_numpang"
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 pl-10 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brown-600 focus:ring-offset-2"
                value={data.status_numpang || ""}
                onChange={(e) => updateField("status_numpang", e.target.value)}
              >
                <option value="" disabled>
                  Pilih status tinggal
                </option>
                <option value="Keluarga Utama">Keluarga Utama</option>
                <option value="Numpang (Keluarga)">Numpang (Keluarga)</option>
                <option value="Numpang (Orang Luar)">Numpang (Orang Luar)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm ring-1 ring-slate-900/5 rounded-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl text-orange-600 shadow-inner">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 tracking-tight">Verifikasi Lapangan</h2>
            <p className="text-sm text-slate-500">Foto Rumah & Koordinat Geografis</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Foto Rumah */}
          <div className="space-y-2">
            <Label>Foto Rumah</Label>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors relative overflow-hidden">
              {data.foto_rumah_path ? (
                <img
                  src={data.foto_rumah_path}
                  alt="Foto Rumah"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                    <Camera className="w-6 h-6 text-brown-600" />
                  </div>
                  <p className="text-sm text-slate-500 font-medium">Klik untuk upload foto</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* GPS */}
          <div className="space-y-3">
            <Label>Lokasi GPS pada Peta</Label>
            
            <div 
              onClick={() => setIsMapOpen(true)}
              className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                hasGps ? "bg-blue-50/40 border-blue-200 hover:border-blue-300" : "bg-white border-slate-200 hover:border-blue-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-full transition-colors ${
                    hasGps ? "bg-blue-500 text-white shadow-md shadow-blue-500/20" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Map className="h-5 w-5" />
                </div>
                <div>
                  <h3 className={`font-bold ${hasGps ? "text-blue-700" : "text-slate-700"}`}>
                    {hasGps ? "Lokasi Telah Dipilih" : "Titik Lokasi Belum Diatur"}
                  </h3>
                  {hasGps ? (
                    <p className="text-sm font-medium text-blue-600 mt-1">
                      Lat: {data.lat?.toFixed(5)} &nbsp;|&nbsp; Lng: {data.lng?.toFixed(5)}
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 mt-1">Ketuk untuk membuka peta interaktif</p>
                  )}
                </div>
              </div>
              <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
                Buka Peta
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Map Modal */}
      {isMapOpen && (
        <MapPickerModal
          initialLat={data.lat ?? undefined}
          initialLng={data.lng ?? undefined}
          onClose={() => setIsMapOpen(false)}
          onSave={handleMapSave}
        />
      )}
    </div>
  );
}

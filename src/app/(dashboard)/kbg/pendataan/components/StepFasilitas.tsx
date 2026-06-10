"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Home, Bath, Key } from "lucide-react";
import { FamilyFormData } from "@/types/family";

interface Props {
  data: FamilyFormData;
  updateField: (key: keyof FamilyFormData, value: any) => void;
}

export function StepFasilitas({ data, updateField }: Props) {
  const fasilitasItems = [
    { id: "fasilitas_kamar_mandi", label: "Kamar Mandi Sendiri" },
    { id: "fasilitas_kamar_cuci", label: "Kamar Cuci" },
    { id: "fasilitas_wc", label: "WC / Jamban" },
    { id: "fasilitas_listrik", label: "Listrik" },
    { id: "fasilitas_air", label: "Sumber Air Bersih" },
    { id: "fasilitas_internet", label: "Internet / Wi-Fi" },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 border-0 shadow-sm ring-1 ring-slate-900/5 rounded-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-brown-50 to-brown-100 rounded-xl text-brown-600 shadow-inner">
            <Home className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 tracking-tight">Data Properti</h2>
            <p className="text-sm text-slate-500">Status Kepemilikan Hunian</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status_rumah">Status Kepemilikan Rumah</Label>
            <div className="relative">
              <Key className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <select
                id="status_rumah"
                className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 pl-10 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brown-600 focus:ring-offset-2"
                value={data.status_rumah || ""}
                onChange={(e) => updateField("status_rumah", e.target.value)}
              >
                <option value="" disabled>
                  Pilih status rumah
                </option>
                <option value="Milik Sendiri">Milik Sendiri</option>
                <option value="Dinas">Dinas</option>
                <option value="Kontrak/Sewa">Kontrak/Sewa</option>
                <option value="Numpang">Numpang</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-0 shadow-sm ring-1 ring-slate-900/5 rounded-md">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl text-teal-600 shadow-inner">
            <Bath className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800 tracking-tight">Fasilitas Tersedia</h2>
            <p className="text-sm text-slate-500">Kelengkapan Rumah & Utilitas</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/60 bg-slate-50 overflow-hidden divide-y divide-slate-200/60 shadow-inner">
          {fasilitasItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50/50 transition-colors">
              <Label
                htmlFor={item.id}
                className="flex-1 cursor-pointer text-sm font-medium leading-none text-slate-700"
              >
                {item.label}
              </Label>
              <Checkbox
                id={item.id}
                checked={data[item.id as keyof FamilyFormData] === true}
                onCheckedChange={(checked) => updateField(item.id as keyof FamilyFormData, checked)}
                className="data-[state=checked]:bg-teal-600 data-[state=checked]:text-white border-slate-300 h-5 w-5 rounded"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

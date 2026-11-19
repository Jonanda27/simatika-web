"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Search, Building2, Hash, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LocationPicker from "@/components/map/LocationPicker";
import { Badge } from "@/components/ui/badge";
import { stasiService, StasiData } from "@/services/stasi.service";


export default function ManajemenStasiPage() {
  const [stasis, setStasis] = useState<StasiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStasi, setEditingStasi] = useState<StasiData | null>(null);
  const [formData, setFormData] = useState({
    nama_stasi: "",
    kode_stasi: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchStasi();
  }, []);

  const fetchStasi = async () => {
    setIsLoading(true);
    try {
      const response = await stasiService.getAll();
      if (response.success) {
        setStasis(response.data);
      } else {
        alert("Gagal mengambil data Stasi");
      }
    } catch (error) {
      console.error("Error fetching stasi:", error);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredStasi = stasis.filter(
    (s) =>
      s.nama_stasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.kode_stasi.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDialog = (stasi?: StasiData) => {
    if (stasi) {
      setEditingStasi(stasi);
      setFormData({
        nama_stasi: stasi.nama_stasi,
        kode_stasi: stasi.kode_stasi,
        latitude: stasi.latitude?.toString() || "",
        longitude: stasi.longitude?.toString() || "",
      });
    } else {
      setEditingStasi(null);
      setFormData({ nama_stasi: "", kode_stasi: "", latitude: "", longitude: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingStasi(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        nama_stasi: formData.nama_stasi,
        kode_stasi: formData.kode_stasi,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (editingStasi) {
        const res = await stasiService.update(editingStasi.id, payload);
        if (res.success) alert(res.message);
        else alert(res.message || "Gagal memperbarui data");
      } else {
        const res = await stasiService.create(payload);
        if (res.success) alert(res.message);
        else alert(res.message || "Gagal menambahkan data");
      }
      handleCloseDialog();
      fetchStasi();
    } catch (error: any) {
      alert(error.response?.data?.message || "Terjadi kesalahan server");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus Stasi ini?")) return;
    try {
      const res = await stasiService.delete(id);
      if (res.success) {
        alert(res.message);
        fetchStasi();
      } else {
        alert(res.message || "Gagal menghapus stasi");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Terjadi kesalahan server");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Data Stasi</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola pembagian wilayah tingkat Stasi di paroki Anda.</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Stasi Baru
        </Button>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari nama atau kode stasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>
          <Badge variant="outline" className="text-slate-500 bg-white">
            Total: {filteredStasi.length} Stasi
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[120px] font-semibold text-slate-700">Kode Stasi</TableHead>
                <TableHead className="font-semibold text-slate-700">Nama Stasi</TableHead>
                <TableHead className="font-semibold text-slate-700">Lokasi Geografis</TableHead>
                <TableHead className="w-[150px] text-right font-semibold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredStasi.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                    Data stasi tidak ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStasi.map((stasi) => (
                  <TableRow key={stasi.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <Badge variant="secondary" className="font-mono bg-slate-100 text-slate-700 border-slate-200">
                        {stasi.kode_stasi}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {stasi.nama_stasi}
                    </TableCell>
                    <TableCell>
                      {stasi.latitude && stasi.longitude ? (
                        <div className="flex items-center text-sm text-slate-600 bg-slate-50 w-fit px-2.5 py-1 rounded-none border border-slate-200">
                          <MapPin className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                          <span className="font-mono">{stasi.latitude}, {stasi.longitude}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Belum diatur</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDialog(stasi)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(stasi.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-none p-0 overflow-hidden border-0 shadow-2xl">
          <div className="bg-amber-600 p-6 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">{editingStasi ? "Edit Data Stasi" : "Tambah Stasi Baru"}</DialogTitle>
              <DialogDescription className="text-amber-100 mt-1">
                Masukkan detail informasi stasi. Pastikan kode stasi unik.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="p-6 bg-white space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-600" /> Nama Stasi <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: Santo Petrus"
                  required
                  className="rounded-none bg-slate-50 border-slate-200 focus-visible:ring-amber-500 focus-visible:bg-white transition-colors"
                  value={formData.nama_stasi}
                  onChange={(e) => setFormData({ ...formData, nama_stasi: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-amber-600" /> Kode Stasi <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: S1"
                  required
                  className="uppercase rounded-none bg-slate-50 border-slate-200 focus-visible:ring-amber-500 focus-visible:bg-white transition-colors font-mono"
                  value={formData.kode_stasi}
                  onChange={(e) => setFormData({ ...formData, kode_stasi: e.target.value })}
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-none space-y-4">
              <div className="flex items-center gap-2 mb-2">
                 <Map className="w-4 h-4 text-slate-500" />
                 <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Pemetaan Geografis (Opsional)</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Latitude</label>
                  <Input
                    placeholder="-4.5678"
                    type="number"
                    step="any"
                    className="rounded-none text-sm bg-white border-slate-200 focus-visible:ring-amber-500"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-slate-700">Longitude</label>
                  <Input
                    placeholder="136.1234"
                    type="number"
                    step="any"
                    className="rounded-none text-sm bg-white border-slate-200 focus-visible:ring-amber-500"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  />
                </div>
              </div>
              <div className="h-[200px] w-full border border-slate-200 mt-2 relative z-0">
                  <LocationPicker 
                      position={formData.latitude && formData.longitude ? [parseFloat(formData.latitude), parseFloat(formData.longitude)] : null}
                      onPositionSelect={(pos) => setFormData({...formData, latitude: pos[0].toString(), longitude: pos[1].toString()})}
                  />
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                * Klik pada peta untuk memilih titik lokasi secara otomatis.
              </p>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog} className="rounded-none border-slate-300 hover:bg-slate-50 text-slate-700">Batal</Button>
              <Button type="submit" className="rounded-none bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/10">
                {editingStasi ? "Simpan Perubahan" : "Tambahkan Stasi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

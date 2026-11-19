"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, MapPin, Search, Filter, Users, Hash, Map, Building2 } from "lucide-react";
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
import { kbgService, KbgData } from "@/services/kbg.service";
import { stasiService, StasiData } from "@/services/stasi.service";


export default function ManajemenKbgPage() {
  const [kbgs, setKbgs] = useState<KbgData[]>([]);
  const [stasis, setStasis] = useState<StasiData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilterStasi, setSelectedFilterStasi] = useState<string>("ALL");

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingKbg, setEditingKbg] = useState<KbgData | null>(null);
  const [formData, setFormData] = useState({
    nama_kbg: "",
    kode_kbg: "",
    stasi_id: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [kbgRes, stasiRes] = await Promise.all([
        kbgService.getAll(),
        stasiService.getAll()
      ]);
      
      if (kbgRes.success) setKbgs(kbgRes.data);
      if (stasiRes.success) setStasis(stasiRes.data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to get Stasi name from ID
  const getStasiName = (stasiId: string | null) => {
    if (!stasiId) return "Tidak Ada Stasi Induk";
    const stasi = stasis.find(s => s.id === stasiId);
    return stasi ? stasi.nama_stasi : "Stasi Tidak Diketahui";
  };

  const filteredKbg = kbgs.filter(k => {
    const matchesSearch = k.nama_kbg.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          k.kode_kbg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStasi = selectedFilterStasi === "ALL" || k.stasi_id === selectedFilterStasi;
    
    return matchesSearch && matchesStasi;
  });

  const handleOpenDialog = (kbg?: KbgData) => {
    if (kbg) {
      setEditingKbg(kbg);
      setFormData({
        nama_kbg: kbg.nama_kbg,
        kode_kbg: kbg.kode_kbg,
        stasi_id: kbg.stasi_id || "",
        latitude: kbg.latitude?.toString() || "",
        longitude: kbg.longitude?.toString() || "",
      });
    } else {
      setEditingKbg(null);
      setFormData({ nama_kbg: "", kode_kbg: "", stasi_id: "", latitude: "", longitude: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingKbg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.stasi_id) {
      alert("Silakan pilih Stasi Induk terlebih dahulu");
      return;
    }
    
    try {
      const payload = {
        nama_kbg: formData.nama_kbg,
        kode_kbg: formData.kode_kbg,
        stasi_id: formData.stasi_id,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      if (editingKbg) {
        const res = await kbgService.update(editingKbg.id, payload);
        if (res.success) alert(res.message);
        else alert(res.message || "Gagal memperbarui data");
      } else {
        const res = await kbgService.create(payload);
        if (res.success) alert(res.message);
        else alert(res.message || "Gagal menambahkan data");
      }
      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Terjadi kesalahan server");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus KBG ini?")) return;
    try {
      const res = await kbgService.delete(id);
      if (res.success) {
        alert(res.message);
        fetchData();
      } else {
        alert(res.message || "Gagal menghapus KBG");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Terjadi kesalahan server");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Data KBG</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola pembagian wilayah basis (Lingkungan/KBG) di seluruh Paroki.</p>
        </div>
        <Button 
          onClick={() => handleOpenDialog()}
          className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah KBG Baru
        </Button>
      </div>

      <div className="bg-white rounded-none shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari KBG..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
            
            <div className="relative w-full max-w-[200px] flex items-center bg-white border border-slate-200 rounded-none shadow-sm">
              <Filter className="w-4 h-4 ml-3 text-slate-400 shrink-0" />
              <select 
                value={selectedFilterStasi}
                onChange={(e) => setSelectedFilterStasi(e.target.value)}
                className="w-full bg-transparent border-none text-sm focus:ring-0 text-slate-700 py-2 px-2"
              >
                <option value="ALL">Semua Stasi</option>
                {stasis.map(s => (
                  <option key={s.id} value={s.id}>{s.nama_stasi}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex items-center">
            <Badge variant="outline" className="text-slate-500 bg-white px-3 py-1">
              Menampilkan {filteredKbg.length} KBG
            </Badge>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[110px] font-semibold text-slate-700">Kode KBG</TableHead>
                <TableHead className="font-semibold text-slate-700">Nama KBG</TableHead>
                <TableHead className="font-semibold text-slate-700">Stasi Induk</TableHead>
                <TableHead className="font-semibold text-slate-700">Ketua KBG</TableHead>
                <TableHead className="w-[120px] text-right font-semibold text-slate-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    Memuat data KBG...
                  </TableCell>
                </TableRow>
              ) : filteredKbg.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                    Tidak ada KBG yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredKbg.map((kbg) => (
                  <TableRow key={kbg.id} className="hover:bg-slate-50/80 transition-colors">
                    <TableCell>
                      <Badge variant="secondary" className="font-mono bg-amber-50 text-amber-700 border-amber-200">
                        {kbg.kode_kbg}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium text-slate-800">
                      {kbg.nama_kbg}
                      {kbg.latitude && kbg.longitude && (
                        <div className="flex items-center text-[10px] text-slate-400 mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          Titik Koordinat Tersedia
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-slate-100 text-slate-600 border-slate-200">
                        {getStasiName(kbg.stasi_id)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {kbg.Pengurus && kbg.Pengurus.length > 0 ? (
                        <span className="text-sm font-medium text-slate-700">
                          {kbg.Pengurus[0].Umat?.nama_lengkap || kbg.Pengurus[0].nama_manual || "Nama Tidak Diketahui"}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-400 italic">Belum Ada Ketua</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleOpenDialog(kbg)}
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(kbg.id)}
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
              <DialogTitle className="text-2xl text-white">{editingKbg ? "Edit Data KBG" : "Tambah KBG Baru"}</DialogTitle>
              <DialogDescription className="text-amber-100 mt-1">
                Lengkapi informasi wilayah KBG. KBG wajib terikat dengan satu Stasi Induk.
              </DialogDescription>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="p-6 bg-white space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-600" /> Nama KBG <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Contoh: KBG Santa Maria"
                  required
                  className="rounded-none bg-slate-50 border-slate-200 focus-visible:ring-amber-500 focus-visible:bg-white transition-colors"
                  value={formData.nama_kbg}
                  onChange={(e) => setFormData({ ...formData, nama_kbg: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-amber-600" /> Kode KBG <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="Contoh: K1"
                    required
                    className="uppercase rounded-none bg-slate-50 border-slate-200 focus-visible:ring-amber-500 focus-visible:bg-white transition-colors font-mono"
                    value={formData.kode_kbg}
                    onChange={(e) => setFormData({ ...formData, kode_kbg: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" /> Stasi Induk <span className="text-red-500">*</span>
                  </label>
                  <div className="relative border border-slate-200 rounded-none bg-slate-50 focus-within:ring-2 focus-within:ring-amber-500 focus-within:bg-white transition-colors">
                     <select 
                        required
                        value={formData.stasi_id}
                        onChange={(e) => setFormData({ ...formData, stasi_id: e.target.value })}
                        className="w-full bg-transparent text-sm text-slate-700 py-2.5 px-3 rounded-none appearance-none outline-none"
                      >
                        <option value="" disabled>-- Pilih Stasi --</option>
                        {stasis.map(s => (
                          <option key={s.id} value={s.id}>{s.nama_stasi}</option>
                        ))}
                      </select>
                  </div>
                </div>
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
                <p className="text-[11px] text-slate-500 leading-relaxed italic mt-1">
                  * Klik pada peta untuk memilih titik lokasi secara otomatis.
                </p>
            </div>
            
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={handleCloseDialog} className="rounded-none border-slate-300 hover:bg-slate-50 text-slate-700">Batal</Button>
              <Button type="submit" className="rounded-none bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-900/10">
                {editingKbg ? "Simpan Perubahan" : "Tambahkan KBG"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

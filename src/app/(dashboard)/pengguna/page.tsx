"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Shield, User, UserPlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/user.service";
import { stasiService, StasiData } from "@/services/stasi.service";
import { kbgService, KbgData } from "@/services/kbg.service";
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
  DialogTrigger,
} from "@/components/ui/dialog";

// Definisikan tipe untuk pengguna
interface UserData {
  id: string;
  username: string;
  role: string;
  stasi_id?: string;
  Stasi?: { nama_stasi: string };
  Kbg?: { id: string, nama_kbg: string };
  createdAt: string;
}

export default function PenggunaPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    password: "",
    role: "ADMIN_STASI",
    stasi_id: "",
    kbg_id: ""
  });
  const [stasis, setStasis] = useState<StasiData[]>([]);
  const [kbgs, setKbgs] = useState<KbgData[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    stasiService.getAll().then(res => {
      if (res.success) setStasis(res.data);
    });
    kbgService.getAll().then(res => {
      if (res.success) setKbgs(res.data);
    });
  }, []);

  const handleOpenDialog = (user?: UserData) => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        password: "", // Password kosong saat edit
        role: user.role,
        stasi_id: user.stasi_id || "",
        kbg_id: user.Kbg?.id || ""
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: "",
        username: "",
        password: "",
        role: "ADMIN_STASI",
        stasi_id: "",
        kbg_id: ""
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        // Jika password kosong, jangan kirim
        const payload: any = { username: formData.username, role: formData.role };
        if (formData.password) payload.password = formData.password;
        if (formData.role === "ADMIN_STASI") payload.stasi_id = formData.stasi_id;
        if (formData.role === "KETUA_KBG") payload.kbg_id = formData.kbg_id;
        
        await userService.updateUser(formData.id, payload);
      } else {
        const payload: any = { ...formData };
        if (payload.role !== "ADMIN_STASI") delete payload.stasi_id;
        if (payload.role !== "KETUA_KBG") delete payload.kbg_id;
        await userService.createUser(payload);
      }
      setIsDialogOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("Gagal menyimpan pengguna:", error);
      alert("Gagal menyimpan pengguna. Pastikan username belum digunakan.");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error("Gagal menghapus pengguna:", error);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    const baseClass = "rounded-none text-xs font-bold px-2.5 py-1 text-white border-0 shadow-sm";
    switch (role) {
      case "ADMIN_GEREJA":
        return <Badge className={`${baseClass} bg-blue-600 hover:bg-blue-700`}>Admin Gereja</Badge>;
      case "SUPER_ADMIN":
        return <Badge className={`${baseClass} bg-purple-600 hover:bg-purple-700`}>Super Admin</Badge>;
      case "ADMIN_PAROKI":
        return <Badge className={`${baseClass} bg-brown-600 hover:bg-brown-700`}>Admin Paroki</Badge>;
      case "ADMIN_STASI":
        return <Badge className={`${baseClass} bg-emerald-600 hover:bg-emerald-700`}>Admin Stasi</Badge>;
      case "KETUA_KBG":
        return <Badge className={`${baseClass} bg-orange-600 hover:bg-orange-700`}>Ketua KBG</Badge>;
      default:
        return <Badge className={`${baseClass} bg-slate-600 hover:bg-slate-700`}>{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-brown-50 border border-brown-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brown-600" />
            </div>
            Manajemen Pengguna
          </h2>
          <p className="text-sm text-slate-500 mt-2 ml-[3.25rem] font-medium">
            Kelola akun pengguna, peran (role), dan akses sistem.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger 
            onClick={() => handleOpenDialog()} 
            className={buttonVariants({ className: "bg-brown-600 hover:bg-brown-700 cursor-pointer rounded-none font-bold shadow-sm" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] p-0 flex flex-col overflow-hidden bg-white rounded-none border-0 shadow-2xl">
            <DialogHeader className="p-6 pr-12 border-b border-slate-200 bg-slate-50/50">
              <DialogTitle className="flex items-center gap-3 text-lg font-bold text-slate-900">
                <div className="w-10 h-10 bg-brown-50 border border-brown-100 rounded-none flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-brown-600" />
                </div>
                {isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-sm mt-1.5 font-medium">
                {isEditing 
                  ? "Ubah detail informasi pengguna di bawah ini."
                  : "Lengkapi formulir di bawah ini untuk menambahkan pengguna."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-5 p-6 bg-white">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan username"
                  className="h-11 px-4 rounded-none border-slate-200 focus:border-brown-500 focus:ring-1 focus:ring-brown-500/20 bg-slate-50/50 focus:bg-white font-medium transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                  Password {isEditing && <span className="text-xs text-slate-400 font-normal ml-1">(Opsional)</span>}
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isEditing ? "Kosongkan jika tidak diubah" : "Buat password (min. 6 karakter)"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 px-4 rounded-none border-slate-200 focus:border-brown-500 focus:ring-1 focus:ring-brown-500/20 bg-slate-50/50 focus:bg-white font-medium transition-colors"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="role" className="text-sm font-semibold text-slate-700">
                  Peran Akses (Role)
                </Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="h-11 w-full rounded-none border border-slate-200 bg-slate-50/50 focus:bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brown-500/20 focus:border-brown-500 transition-colors cursor-pointer font-medium"
                >
                  <option value="ADMIN_GEREJA">Admin Gereja</option>
                  <option value="ADMIN_PAROKI">Admin Paroki</option>
                  <option value="ADMIN_STASI">Admin Stasi</option>
                  <option value="KETUA_KBG">Ketua KBG</option>
                </select>
              </div>

              {formData.role === "ADMIN_STASI" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="stasi_id" className="text-sm font-semibold text-slate-700">
                    Stasi yang Dikelola <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="stasi_id"
                    value={formData.stasi_id}
                    onChange={(e) => setFormData({ ...formData, stasi_id: e.target.value })}
                    className="h-11 w-full rounded-none border border-slate-200 bg-slate-50/50 focus:bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brown-500/20 focus:border-brown-500 transition-colors cursor-pointer font-medium"
                    required
                  >
                    <option value="" disabled>-- Pilih Stasi --</option>
                    {stasis.map((stasi) => (
                      <option key={stasi.id} value={stasi.id}>{stasi.nama_stasi}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.role === "KETUA_KBG" && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="kbg_id" className="text-sm font-semibold text-slate-700">
                    KBG yang Dipimpin <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="kbg_id"
                    value={formData.kbg_id}
                    onChange={(e) => setFormData({ ...formData, kbg_id: e.target.value })}
                    className="h-11 w-full rounded-none border border-slate-200 bg-slate-50/50 focus:bg-white px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-brown-500/20 focus:border-brown-500 transition-colors cursor-pointer font-medium"
                    required
                  >
                    <option value="" disabled>-- Pilih KBG --</option>
                    {kbgs
                      .filter(kbg => !kbg.ketua_id || (isEditing && kbg.ketua_id === formData.id))
                      .map((kbg) => (
                        <option key={kbg.id} value={kbg.id}>{kbg.nama_kbg}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <DialogFooter className="p-4 border-t border-slate-200 bg-slate-50/80 flex gap-3 sm:gap-3 w-full">
              <Button variant="outline" className="flex-1 h-11 rounded-none font-bold text-slate-600 border-slate-200 hover:bg-slate-100" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSave} className="flex-1 h-11 rounded-none font-bold bg-brown-600 hover:bg-brown-700 text-white shadow-sm border-0">
                {isEditing ? "Simpan Perubahan" : "Simpan Pengguna"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-none shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/80 border-b border-slate-200">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[80px] font-bold text-slate-600 uppercase text-xs tracking-wider">No</TableHead>
                <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Username</TableHead>
                <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Role / Peran</TableHead>
                <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Tgl Dibuat</TableHead>
                <TableHead className="text-right font-bold text-slate-600 uppercase text-xs tracking-wider pr-5">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                    Belum ada data pengguna.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user, index) => (
                  <TableRow key={user.id} className="group hover:bg-transparent">
                    <TableCell className="text-slate-400 text-sm font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">
                          {user.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {getRoleBadge(user.role)}
                        {user.role === "ADMIN_STASI" && user.Stasi && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            Stasi: {user.Stasi.nama_stasi}
                          </span>
                        )}
                        {user.role === "KETUA_KBG" && user.Kbg && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            KBG: {user.Kbg.nama_kbg}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm font-medium">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenDialog(user)}
                          className="h-8 w-8 rounded-none text-slate-500 border-slate-200 hover:border-brown-200 hover:bg-brown-50 hover:text-brown-700 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          className="h-8 w-8 rounded-none text-slate-500 border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                          title="Hapus"
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
    </div>
  );
}


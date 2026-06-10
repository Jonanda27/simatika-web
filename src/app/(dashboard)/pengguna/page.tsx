"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Shield, User, UserPlus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { userService } from "@/services/user.service";
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
    role: "ADMIN_STASI"
  });
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
  }, []);

  const handleOpenDialog = (user?: UserData) => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username,
        password: "", // Password kosong saat edit
        role: user.role
      });
      setIsEditing(true);
    } else {
      setFormData({
        id: "",
        username: "",
        password: "",
        role: "ADMIN_STASI"
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
        
        await userService.updateUser(formData.id, payload);
      } else {
        await userService.createUser(formData);
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
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge className="bg-purple-500 hover:bg-purple-600">Super Admin</Badge>;
      case "ADMIN_PAROKI":
        return <Badge className="bg-brown-500 hover:bg-brown-600">Admin Paroki</Badge>;
      case "ADMIN_STASI":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Admin Stasi</Badge>;
      case "KETUA_KBG":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Ketua KBG</Badge>;
      default:
        return <Badge className="bg-slate-500 hover:bg-slate-600">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Shield className="w-6 h-6 text-brown-600" />
            Manajemen Pengguna
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola akun pengguna, peran (role), dan akses sistem.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger 
            onClick={() => handleOpenDialog()} 
            className={buttonVariants({ className: "bg-brown-600 hover:bg-brown-700 cursor-pointer" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Pengguna
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] p-6">
            <DialogHeader className="mb-2">
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <div className="p-2 bg-brown-100 dark:bg-brown-900/30 rounded-lg">
                  <UserPlus className="w-5 h-5 text-brown-600 dark:text-brown-500" />
                </div>
                {isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
              </DialogTitle>
              <DialogDescription className="pt-1">
                {isEditing 
                  ? "Ubah detail informasi pengguna di bawah ini. Kosongkan kolom password jika Anda tidak ingin mengganti password lama."
                  : "Lengkapi formulir di bawah ini untuk menambahkan pengguna baru ke dalam sistem."}
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex flex-col gap-5 py-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Masukkan username"
                  className="h-11 px-3"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="password" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={isEditing ? "Biarkan kosong jika tidak diubah" : "Buat password pengguna (min. 6 karakter)"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-11 px-3"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <Label htmlFor="role" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Peran Akses (Role)
                </Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-brown-600 focus:border-brown-600 transition-colors cursor-pointer"
                >
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN_PAROKI">Admin Paroki</option>
                  <option value="ADMIN_STASI">Admin Stasi</option>
                  <option value="KETUA_KBG">Ketua KBG</option>
                  <option value="UMAT">Umat (Pengguna Biasa)</option>
                </select>
              </div>
            </div>
            
            <DialogFooter className="mt-4 gap-3 sm:gap-3 flex w-full">
              <Button variant="outline" className="flex-1 h-11" onClick={() => setIsDialogOpen(false)}>Batal</Button>
              <Button onClick={handleSave} className="flex-1 h-11 bg-brown-600 hover:bg-brown-700 text-white shadow-sm">
                {isEditing ? "Simpan Perubahan" : "Simpan Pengguna"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50 dark:bg-slate-800/50">
              <TableRow>
                <TableHead className="w-[80px]">No</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role / Peran</TableHead>
                <TableHead>Tgl Dibuat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
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
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {user.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-slate-500 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(user)}
                        className="text-slate-500 hover:text-brown-600"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        className="text-slate-500 hover:text-red-600"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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

"use client";

import React, { useState, useEffect } from "react";
import { Users, Plus, Pencil, Trash2, Shield, Calendar, Phone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { kbgPengurusService, KbgPengurusData } from "@/services/kbgPengurus.service";
import { api } from "@/lib/api";

import Link from "next/link";
import * as XLSX from "xlsx";
import { Download } from "lucide-react";

export default function PengurusKbgPage() {
    const { user } = useAuth();
    const [pengurus, setPengurus] = useState<KbgPengurusData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [kbgId, setKbgId] = useState<string>("");
    const [exporting, setExporting] = useState(false);
    
    // For Admin to select KBG
    const [kbgs, setKbgs] = useState<any[]>([]);

    useEffect(() => {
        if (user?.role?.includes('ADMIN')) {
            api.get('/kbgs').then((res: any) => {
                if (res.success) setKbgs(res.data);
            });
        }
        
        // Jika KETUA_KBG, otomatis set kbgId dari auth token
        if (user?.role === 'KETUA_KBG' && user?.id_kbg) {
            setKbgId(user.id_kbg);
        }
    }, [user]);

    useEffect(() => {
        if (kbgId) {
            setIsLoading(true);
            kbgPengurusService.getByKbgId(kbgId)
                .then(res => {
                    if (res.success) setPengurus(res.data);
                })
                .catch(err => console.error(err))
                .finally(() => setIsLoading(false));
        } else {
            setPengurus([]);
            setIsLoading(false);
        }
    }, [kbgId]);

    const handleDelete = async (id: string) => {
        if (confirm("Hapus data pengurus ini?")) {
            try {
                const res = await kbgPengurusService.delete(id);
                if (res.success) {
                    setPengurus(prev => prev.filter(p => p.id !== id));
                    alert("Berhasil dihapus!");
                }
            } catch (error) {
                alert("Gagal menghapus pengurus");
            }
        }
    };

    const handleExportExcel = async () => {
        if (pengurus.length === 0) {
            alert("Tidak ada data untuk diekspor");
            return;
        }
        setExporting(true);
        try {
            const excelData = pengurus.map((p, index) => ({
                "No": index + 1,
                "Nama Pengurus": p.Umat?.nama_lengkap || p.nama_manual || "Tidak Diketahui",
                "NIU": p.Umat?.nomor_induk_umat || "-",
                "Jabatan": p.jabatan,
                "Periode Mulai": p.periode_mulai,
                "Periode Selesai": p.periode_selesai,
                "Nomor Telepon": p.nomor_telepon || "-",
                "Status": p.is_active ? 'Aktif' : 'Non-Aktif'
            }));

            const worksheet = XLSX.utils.json_to_sheet(excelData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Pengurus KBG");
            
            const kbgName = kbgs.find(k => k.id === kbgId)?.nama_kbg || 'Semua';
            const fileName = `Data_Pengurus_KBG_${kbgName.replace(/\s+/g, '_')}_${new Date().getTime()}.xlsx`;
            XLSX.writeFile(workbook, fileName);
        } catch (error) {
            console.error("Gagal export excel:", error);
            alert("Gagal mengekspor data");
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-3 bg-brown-100 text-brown-600 rounded-none">
                    <Shield size={24} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Daftar Pengurus KBG Aktif</h1>
                    <p className="text-sm text-slate-500">Lihat dan kelola langsung daftar pengurus yang sedang menjabat di KBG.</p>
                </div>
            </div>

            {/* Filter KBG (Hanya untuk Admin) */}
            {user?.role?.includes('ADMIN') && (
                <div className="bg-white p-4 rounded-none border border-slate-200 shadow-sm flex items-center gap-4">
                    <label className="text-sm font-bold text-slate-700">Pilih KBG:</label>
                    <select 
                        className="flex-1 max-w-sm px-3 py-2 border border-slate-300 rounded-none focus:outline-none focus:ring-2 focus:ring-brown-500"
                        value={kbgId}
                        onChange={(e) => setKbgId(e.target.value)}
                    >
                        <option value="">-- Silakan Pilih KBG --</option>
                        {kbgs.map(kbg => (
                            <option key={kbg.id} value={kbg.id}>{kbg.nama_kbg}</option>
                        ))}
                    </select>
                </div>
            )}

            {!kbgId && user?.role?.includes('ADMIN') ? (
                <div className="text-center py-12 bg-slate-50 rounded-none border border-dashed border-slate-300 text-slate-500">
                    <Users size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Pilih KBG terlebih dahulu untuk melihat daftar pengurusnya.</p>
                </div>
            ) : (
                <div className="bg-white rounded-none border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                            <Users size={18} className="text-brown-600" />
                            Data Pengurus
                        </h2>
                        <div className="flex items-center gap-2">
                            {pengurus.length > 0 && (
                                <button 
                                    onClick={handleExportExcel}
                                    disabled={exporting}
                                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-none text-sm font-semibold transition-colors"
                                >
                                    <Download size={16} />
                                    {exporting ? 'Mengekspor...' : 'Export Excel'}
                                </button>
                            )}
                            {user?.role === 'KETUA_KBG' && (
                                <Link href="/kbg/kepengurusan">
                                    <button className="flex items-center gap-2 bg-brown-600 hover:bg-brown-700 text-white px-4 py-2 rounded-none text-sm font-semibold transition-colors">
                                        <Plus size={16} /> Assign Pengurus Langsung
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-100 text-slate-700 text-xs uppercase font-bold">
                                <tr>
                                    <th className="px-4 py-3">Nama Pengurus</th>
                                    <th className="px-4 py-3">Jabatan</th>
                                    <th className="px-4 py-3">Periode</th>
                                    <th className="px-4 py-3">Kontak</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan={6} className="text-center py-8">Memuat data...</td></tr>
                                ) : pengurus.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center py-8 text-slate-500">Belum ada pengurus aktif yang terdata di KBG ini.</td></tr>
                                ) : (
                                    pengurus.map((p) => (
                                        <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-slate-800">
                                                {p.Umat?.nama_lengkap || p.nama_manual || "Tidak Diketahui"}
                                                {p.Umat?.nomor_induk_umat && (
                                                    <div className="text-[10px] text-slate-500 font-normal">NIU: {p.Umat.nomor_induk_umat}</div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-bold text-brown-700 uppercase text-[10px]">{p.jabatan}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                    <Calendar size={12} />
                                                    {p.periode_mulai} - {p.periode_selesai}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                                                    <Phone size={12} />
                                                    {p.nomor_telepon || "-"}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 text-[9px] font-bold rounded-none uppercase ${p.is_active ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                                                    {p.is_active ? 'Aktif' : 'Non-Aktif'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-none transition-colors mr-1">
                                                    <Pencil size={14} />
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-none transition-colors">
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

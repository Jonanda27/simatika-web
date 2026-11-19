"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Plus, Search, Eye, ChevronLeft, ChevronRight, Edit, Trash2,
  User, Home, BookOpen, Users, Activity, AlertCircle,
  Phone, MapPin, X, Download
} from "lucide-react";
import * as XLSX from "xlsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { umatService } from "@/services/umat.service";
import { UmatData } from "@/types/umat";
import { format, differenceInYears } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { getStatusInfo, getAge, sacramentsColorMap } from "@/components/features/umat/utils";
import { UmatDetailModal } from "@/components/features/umat/UmatDetailModal";
import { keluargaService } from "@/services/keluarga.service";
import { KeluargaDetailModal } from "@/components/features/keluarga/KeluargaDetailModal";
import { useAuth } from "@/context/AuthContext";
import { useSearchParams } from "next/navigation";

// ================== MAIN PAGE ==================
export default function DataUmatPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [umatList, setUmatList] = useState<UmatData[]>([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1, limit: 15 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [jkFilter, setJkFilter] = useState('');
  const [selectedUmat, setSelectedUmat] = useState<UmatData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  const [selectedKeluarga, setSelectedKeluarga] = useState<any | null>(null);
  const [keluargaModalOpen, setKeluargaModalOpen] = useState(false);

  const [exporting, setExporting] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await umatService.getAll({ page, limit: 15, search, jk: jkFilter });
      setUmatList(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, jkFilter]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setSearch(val);
    }, 500);
  };

  const openDetail = async (umat: UmatData) => {
    setSelectedUmat(umat);
    setModalOpen(true);
    // Fetch full detail
    try {
      const res = await umatService.getById(umat.id);
      setSelectedUmat(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const openKeluargaDetail = async (familyId: string) => {
    setKeluargaModalOpen(true);
    try {
      const res = await keluargaService.getById(familyId);
      setSelectedKeluarga(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await umatService.getAll({ page: 1, limit: 10000, search, jk: jkFilter });
      const allData = res.data;

      if (!allData || allData.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
      }

      const excelData = allData.map((item, index) => {
        const status = getStatusInfo(item);
        const age = getAge(item.tanggal_lahir);
        return {
          "No": index + 1,
          "Nama Lengkap": item.nama_lengkap || "-",
          "No Induk Umat": item.nomor_induk_umat || "-",
          "FAM": item.fam || "-",
          "Jenis Kelamin": item.jenis_kelamin === 'L' ? 'Laki-laki' : item.jenis_kelamin === 'P' ? 'Perempuan' : "-",
          "Umur": age,
          "Status Dalam Keluarga": item.status_dalam_keluarga || "-",
          "Pekerjaan": item.pekerjaan || "-",
          "Pendidikan Terakhir": item.pendidikan_terakhir || "-",
          "Suku": item.suku || "-",
          "Status Kesehatan": item.status_kesehatan || "-",
          "Status": status.label,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Umat");

      const wscols = [
        {wch: 5}, {wch: 30}, {wch: 20}, {wch: 15}, {wch: 15}, {wch: 10}, {wch: 25}, {wch: 25}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 15}
      ];
      worksheet['!cols'] = wscols;

      XLSX.writeFile(workbook, `Data_Umat_Admin.xlsx`);
    } catch (error) {
      console.error("Gagal export excel:", error);
      alert("Gagal melakukan export data");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-brown-50 border border-brown-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-brown-600" />
            </div>
            Data Umat
          </h2>
          <p className="text-sm text-slate-500 mt-2 ml-[3.25rem] font-medium">
            Total <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> umat terdaftar dari Database.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleExportExcel} variant="outline" className="rounded-none border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors font-bold" disabled={exporting || loading}>
            <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-bounce' : ''}`} />
            {exporting ? 'Mengekspor...' : 'Export Excel'}
          </Button>
        </div>
      </div>

      {/* MAIN CARD */}
      <Card className="shadow-sm border-slate-200/80 rounded-none overflow-hidden bg-white">
        <CardContent className="p-0">

          {/* FILTER BAR */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row gap-4 bg-slate-50/50 rounded-none items-center">
            {/* Search */}
            <div className="relative flex-1 w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Cari nama umat..."
                className="w-full pl-10 pr-4 h-11 text-sm border border-slate-200 rounded-none bg-white shadow-sm focus:outline-none focus:border-brown-500 focus:ring-1 focus:ring-brown-500/20 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Filter JK */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { label: 'Semua', value: '' },
                { label: '♂ Laki-laki', value: 'L' },
                { label: '♀ Perempuan', value: 'P' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setJkFilter(opt.value)}
                  className={`px-5 h-11 rounded-none text-sm font-bold transition-all border shadow-sm shrink-0 ${
                    jkFilter === opt.value
                      ? 'bg-brown-600 text-white border-brown-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] font-bold text-slate-600 uppercase text-xs tracking-wider">No</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Nama Lengkap</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">FAM</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">JK</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Umur</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Sakramen</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center">Status</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center pr-5">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <TableCell key={j} className="py-4">
                          <div className="h-4 bg-slate-200/60 rounded-none animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : umatList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16 text-slate-500">
                      <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">Tidak ada data umat ditemukan</p>
                      <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  umatList.map((umat, index) => {
                    const status = getStatusInfo(umat);
                    const age = getAge(umat.tanggal_lahir);
                    const sacramentCount = umat.Sacraments?.length || 0;
                    const rowNum = (pagination.currentPage - 1) * pagination.limit + index + 1;

                    return (
                      <TableRow key={umat.id} className="group hover:bg-transparent">
                        <TableCell className="text-slate-500 text-sm">{rowNum}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-none bg-brown-50 border border-brown-100 text-brown-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {umat.nama_lengkap?.charAt(0) || 'U'}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800 text-sm capitalize lowercase">{umat.nama_lengkap}</span>
                              {umat.nomor_induk_umat && (
                                <span className="text-xs font-mono text-slate-500 mt-0.5">{umat.nomor_induk_umat}</span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm font-medium">{umat.fam || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs rounded-none font-bold border-0 px-2 py-1 ${umat.jenis_kelamin === 'L' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'}`}>
                            {umat.jenis_kelamin === 'L' ? 'L' : umat.jenis_kelamin === 'P' ? 'P' : '-'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">{age}</TableCell>
                        <TableCell>
                          {sacramentCount > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {umat.Sacraments?.slice(0, 2).map(s => (
                                <Badge key={s.id} variant="outline" className={`text-[10px] rounded-none px-1.5 py-0 border-0 font-bold ${sacramentsColorMap[s.jenis_sakramen] || ''}`}>
                                  {s.jenis_sakramen.split(' ')[0]}
                                </Badge>
                              ))}
                              {sacramentCount > 2 && <span className="text-xs text-slate-400">+{sacramentCount - 2}</span>}
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className={`text-xs rounded-none font-bold border-0 px-2 py-1 ${status.color}`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center pr-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openDetail(umat)}
                              title="Lihat Detail"
                              className="h-8 w-8 text-slate-500 hover:text-brown-700 border-slate-200 hover:border-brown-200 hover:bg-brown-50 rounded-none transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {umat.Family?.id && (
                                <Button
                                  variant="outline"
                                  size="icon"
                                  title="Lihat Keluarga"
                                  onClick={() => openKeluargaDetail(umat.Family!.id)}
                                  className="h-8 w-8 text-slate-500 hover:text-emerald-700 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-none transition-colors"
                                >
                                  <Home className="h-4 w-4" />
                                </Button>
                            )}
                            <Button
                              variant="outline"
                              size="icon"
                              title="Hapus Data"
                              className="h-8 w-8 text-slate-500 hover:text-rose-700 border-slate-200 hover:border-rose-200 hover:bg-rose-50 rounded-none transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* PAGINATION */}
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30 rounded-none">
            <p className="text-sm text-slate-500 font-medium">
              Menampilkan <span className="font-bold text-slate-800">{(pagination.currentPage - 1) * pagination.limit + 1}</span>–
              <span className="font-bold text-slate-800">{Math.min(pagination.currentPage * pagination.limit, pagination.total)}</span> dari{' '}
              <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> data
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-none text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
                disabled={pagination.currentPage === 1 || loading}
                onClick={() => fetchData(pagination.currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {Array.from({ length: Math.min(5, pagination.totalPages) }).map((_, i) => {
                let page: number;
                const totalPages = pagination.totalPages;
                const cur = pagination.currentPage;

                if (totalPages <= 5) {
                  page = i + 1;
                } else if (cur <= 3) {
                  page = i + 1;
                } else if (cur >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = cur - 2 + i;
                }

                return (
                  <Button
                    key={page}
                    variant={pagination.currentPage === page ? 'default' : 'outline'}
                    size="icon"
                    className={`h-9 w-9 rounded-none text-sm font-bold ${pagination.currentPage === page ? 'bg-brown-600 text-white hover:bg-brown-700 border-transparent' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}
                    onClick={() => fetchData(page)}
                    disabled={loading}
                  >
                    {page}
                  </Button>
                );
              })}

              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-none text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
                disabled={pagination.currentPage === pagination.totalPages || loading}
                onClick={() => fetchData(pagination.currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* DETAIL MODAL UMAT */}
      <UmatDetailModal
        umat={selectedUmat}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedUmat(null); }}
      />

      {/* DETAIL MODAL KELUARGA */}
      <KeluargaDetailModal
        keluarga={selectedKeluarga}
        open={keluargaModalOpen}
        onClose={() => { setKeluargaModalOpen(false); setSelectedKeluarga(null); }}
      />
    </div>
  );
}


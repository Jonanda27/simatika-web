"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Search, Eye, ChevronLeft, ChevronRight, Trash2,
  Home, Users, MapPin, ShieldCheck, X, Plus, Download
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData, KeluargaAnggota } from "@/types/keluarga";
import { differenceInYears } from "date-fns";
import { getKepalaKeluarga, statusRumahColor } from "@/components/features/keluarga/utils";
import { KeluargaDetailModal } from "@/components/features/keluarga/KeluargaDetailModal";
import { umatService } from "@/services/umat.service";
import { UmatData } from "@/types/umat";
import { UmatDetailModal } from "@/components/features/umat/UmatDetailModal";

// ================== MAIN PAGE ==================
export default function DataKeluargaPage() {
  const [list, setList] = useState<KeluargaData[]>([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1, limit: 15 });
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [selectedKeluarga, setSelectedKeluarga] = useState<KeluargaData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUmat, setSelectedUmat] = useState<UmatData | null>(null);
  const [umatModalOpen, setUmatModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await keluargaService.getAll({ page, limit: 15, search });
      setList(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchData(1); }, [fetchData]);

  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => setSearch(val), 500);
  };

  const openDetail = async (keluarga: KeluargaData) => {
    setSelectedKeluarga(keluarga);
    setModalOpen(true);
    try {
      const res = await keluargaService.getById(keluarga.id);
      setSelectedKeluarga(res.data);
    } catch (e) { console.error(e); }
  };

  const handleUmatClick = async (id: string) => {
    try {
      const res = await umatService.getById(id);
      setSelectedUmat(res.data);
      setUmatModalOpen(true);
    } catch (e) { console.error(e); }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await keluargaService.getAll({ page: 1, limit: 10000, search });
      const allData = res.data;

      if (!allData || allData.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
      }

      const excelData = allData.map((item, index) => {
        const kepala = getKepalaKeluarga(item.Umats);
        return {
          "No": index + 1,
          "No KK Paroki": item.no_kk_paroki || "-",
          "Kode Unik Keluarga": item.kode_unik_keluarga || "-",
          "Kepala Keluarga": kepala,
          "KBG": item.Kbg?.nama_kbg || "-",
          "Status Rumah": item.status_rumah || "-",
          "Pendapatan/Bulan": item.pendapatan_per_bulan ? `Rp ${item.pendapatan_per_bulan.toLocaleString('id-ID')}` : "-",
          "Jumlah Anggota": item.Umats?.length || 0,
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Keluarga");

      const wscols = [
        {wch: 5}, {wch: 25}, {wch: 20}, {wch: 30}, {wch: 20}, {wch: 20}, {wch: 20}, {wch: 15}
      ];
      worksheet['!cols'] = wscols;

      XLSX.writeFile(workbook, `Data_Keluarga_Admin.xlsx`);
    } catch (error) {
      console.error("Gagal export excel:", error);
      alert("Gagal melakukan export data");
    } finally {
      setExporting(false);
    }
  };

  const totalPages = pagination.totalPages;
  const curPage = pagination.currentPage;

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (curPage <= 3) return [1, 2, 3, 4, 5];
    if (curPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [curPage - 2, curPage - 1, curPage, curPage + 1, curPage + 2];
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Home className="w-5 h-5 text-emerald-600" />
            </div>
            Data Keluarga
          </h2>
          <p className="text-sm text-slate-500 mt-2 ml-[3.25rem] font-medium">
            Total <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> keluarga Katolik terdaftar.
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
            <div className="relative flex-1 w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Cari No. KK Paroki..."
                className="w-full pl-10 pr-4 h-11 text-sm border border-slate-200 rounded-none bg-white shadow-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            {search && (
              <button
                onClick={() => { setSearch(''); setSearchInput(''); }}
                className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" /> Hapus filter
              </button>
            )}
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[50px] font-bold text-slate-600 uppercase text-xs tracking-wider">No</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">No. KK & Kode Unik</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Kepala Keluarga</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center">Anggota</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Status Rumah</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Pendapatan</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center pr-5">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <TableCell key={j} className="py-4">
                          <div className="h-4 bg-slate-200/60 rounded-none animate-pulse" style={{ width: `${50 + Math.random() * 50}%` }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-slate-500">
                      <Home className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">Tidak ada data keluarga ditemukan</p>
                      <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci pencarian</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((kk, index) => {
                    const kepala = getKepalaKeluarga(kk.Umats);
                    const jumlah = kk.Umats?.length || 0;
                    const rowNum = (pagination.currentPage - 1) * pagination.limit + index + 1;

                    return (
                      <TableRow key={kk.id} className="group hover:bg-transparent">
                        <TableCell className="text-slate-400 text-sm">{rowNum}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-none border border-slate-200/60 w-fit" title="No. KK Paroki">
                              {kk.no_kk_paroki || '-'}
                            </span>
                            <span className="font-mono text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-100 w-fit" title="Kode Unik Keluarga">
                              {kk.kode_unik_keluarga || '-'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-none bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {kepala.charAt(0)}
                            </div>
                            <span className="font-bold text-slate-800 text-sm capitalize lowercase">{kepala}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 border border-slate-200/60 px-3 py-1 rounded-none text-sm font-bold text-slate-600">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            {jumlah}
                          </div>
                        </TableCell>
                        <TableCell>
                          {kk.status_rumah ? (
                            <Badge variant="outline" className={`text-xs rounded-none font-bold border-0 px-2 py-1 ${statusRumahColor[kk.status_rumah] || 'bg-slate-50 text-slate-600'}`}>
                              {kk.status_rumah}
                            </Badge>
                          ) : <span className="text-slate-400 text-sm font-bold">-</span>}
                        </TableCell>
                        <TableCell className="text-sm font-bold text-slate-700">
                          {kk.pendapatan_per_bulan
                            ? `Rp ${Number(kk.pendapatan_per_bulan).toLocaleString('id-ID')}`
                            : <span className="text-slate-400">-</span>}
                        </TableCell>
                        <TableCell className="text-center pr-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openDetail(kk)}
                              title="Lihat Detail"
                              className="h-8 w-8 text-slate-500 hover:text-emerald-700 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 rounded-none transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
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
              Menampilkan <span className="font-bold text-slate-800">{list.length > 0 ? (curPage - 1) * pagination.limit + 1 : 0}</span>–
              <span className="font-bold text-slate-800">{Math.min(curPage * pagination.limit, pagination.total)}</span> dari{' '}
              <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> keluarga
            </p>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-none text-slate-600 border-slate-200 bg-white hover:bg-slate-50" disabled={curPage === 1 || loading} onClick={() => fetchData(curPage - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={curPage === page ? 'default' : 'outline'}
                  size="icon"
                  className={`h-9 w-9 rounded-none text-sm font-bold ${curPage === page ? 'bg-emerald-600 border-transparent text-white hover:bg-emerald-700' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}
                  onClick={() => fetchData(page)}
                  disabled={loading}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-none text-slate-600 border-slate-200 bg-white hover:bg-slate-50" disabled={curPage === totalPages || loading || totalPages === 0} onClick={() => fetchData(curPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* DETAIL MODAL KELUARGA */}
      <KeluargaDetailModal
        keluarga={selectedKeluarga}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedKeluarga(null); }}
        onUmatClick={handleUmatClick}
      />

      {/* DETAIL MODAL UMAT (Ditumpuk di atas) */}
      <UmatDetailModal
        umat={selectedUmat}
        open={umatModalOpen}
        onClose={() => { setUmatModalOpen(false); setSelectedUmat(null); }}
      />
    </div>
  );
}


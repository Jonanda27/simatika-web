"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Search, Eye, ChevronLeft, ChevronRight, Trash2, X, Plus, User, FileText, Calendar, MapPin, Download
} from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { sakramenService } from "@/services/sakramen.service";
import { SakramenData } from "@/types/sakramen";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { SakramenDetailModal } from "@/components/features/sakramen/SakramenDetailModal";
import { sacramentsColorMap } from "@/components/features/sakramen/utils";
// ================== PAGE COMPONENT ==================
export default function SakramenPage() {
  const [list, setList] = useState<SakramenData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSakramen, setSelectedSakramen] = useState<SakramenData | null>(null);
  const [exporting, setExporting] = useState(false);
  
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1, limit: 15 });

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await sakramenService.getAll(page, pagination.limit, search, jenisFilter);
      setList(res.data);
      setPagination(res.pagination);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, jenisFilter, pagination.limit]);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  // Handle Enter on search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== searchInput) setSearch(searchInput);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput, search]);

  const openDetail = (sakramen: SakramenData) => {
    setSelectedSakramen(sakramen);
    setModalOpen(true);
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      const res = await sakramenService.getAll(1, 10000, search, jenisFilter);
      const allData = res.data;

      if (!allData || allData.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
      }

      const excelData = allData.map((item, index) => {
        return {
          "No": index + 1,
          "Nama Umat": item.Umat?.nama_lengkap || "-",
          "Jenis Sakramen": item.jenis_sakramen || "-",
          "Nomor Surat": item.nomor_surat || "-",
          "Tanggal Penerimaan": item.tanggal_penerimaan ? format(new Date(item.tanggal_penerimaan), 'dd MMM yyyy', { locale: localeId }) : "-",
          "Tempat Pelaksanaan": item.tempat_pelaksanaan || "-",
          "Nama Pastor": item.nama_pastor || "-",
          "Nama Wali Saksi": item.nama_wali_saksi || "-",
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Sakramen");

      const wscols = [
        {wch: 5}, {wch: 30}, {wch: 20}, {wch: 25}, {wch: 20}, {wch: 30}, {wch: 30}, {wch: 30}
      ];
      worksheet['!cols'] = wscols;

      XLSX.writeFile(workbook, `Data_Sakramen.xlsx`);
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
            <div className="w-10 h-10 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            Data Sakramen
          </h2>
          <p className="text-sm text-slate-500 mt-2 ml-[3.25rem] font-medium">
            Total <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> riwayat sakramen tercatat.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button onClick={handleExportExcel} variant="outline" className="rounded-none border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors font-bold" disabled={exporting || loading}>
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
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari nama umat..."
                className="w-full pl-10 pr-4 h-11 text-sm border border-slate-200 rounded-none bg-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400 font-medium"
              />
            </div>
            
            <select
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
              className="px-4 h-11 text-sm border border-slate-200 rounded-none bg-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 w-full sm:w-auto font-medium"
            >
              <option value="">Semua Sakramen</option>
              <option value="Baptis">Baptis</option>
              <option value="Komuni Pertama">Komuni Pertama</option>
              <option value="Krisma">Krisma</option>
              <option value="Perkawinan">Perkawinan</option>
              <option value="Imamat/Kaul Kekal">Imamat/Kaul Kekal</option>
            </select>

            {(search || jenisFilter) && (
              <button
                onClick={() => { setSearch(''); setSearchInput(''); setJenisFilter(''); }}
                className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-1 ml-auto sm:ml-0"
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
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Nama Umat</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Jenis Sakramen</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">No. Surat</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Tanggal</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Tempat</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center pr-5">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 7 }).map((_, j) => (
                        <TableCell key={j} className="py-4">
                          <div className="h-4 bg-slate-200/60 rounded-none animate-pulse" style={{ width: `${50 + Math.random() * 50}%` }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-16 text-slate-500">
                      <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">Tidak ada data sakramen ditemukan</p>
                      <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci pencarian atau jenis filter</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((s, index) => {
                    const rowNum = (pagination.currentPage - 1) * pagination.limit + index + 1;

                    return (
                      <TableRow key={s.id} className="group hover:bg-transparent">
                        <TableCell className="text-slate-400 text-sm">{rowNum}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-800 text-sm capitalize lowercase">{s.Umat?.nama_lengkap || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs rounded-none font-bold border-0 px-2 py-1 ${sacramentsColorMap[s.jenis_sakramen] || 'bg-slate-50 text-slate-600'}`}>
                            {s.jenis_sakramen}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-none border border-slate-200/60">
                            {s.nomor_surat || '-'}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {s.tanggal_penerimaan ? format(new Date(s.tanggal_penerimaan), 'dd MMM yyyy', { locale: localeId }) : '-'}
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-600 truncate max-w-[150px]">
                          {s.tempat_pelaksanaan || '-'}
                        </TableCell>
                        <TableCell className="text-center pr-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => openDetail(s)}
                              title="Lihat Detail"
                              className="h-8 w-8 text-slate-500 hover:text-indigo-700 border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 rounded-none transition-colors"
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
              <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> data sakramen
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
                  className={`h-9 w-9 rounded-none text-sm font-bold ${curPage === page ? 'bg-indigo-600 border-transparent text-white hover:bg-indigo-700' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50'}`}
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

      {/* DETAIL MODAL */}
      <SakramenDetailModal
        sakramen={selectedSakramen}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedSakramen(null); }}
      />
    </div>
  );
}


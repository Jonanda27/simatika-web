"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, Eye, ChevronLeft, ChevronRight, Trash2, X, ArrowRightLeft, UserX, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { mutasiService } from "@/services/mutasi.service";
import { MutasiData } from "@/types/mutasi";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

import { MutasiDetailModal } from "@/components/features/mutasi/MutasiDetailModal";
import { mutasiColorMap } from "@/components/features/mutasi/utils";
// ================== PAGE COMPONENT ==================
export default function MutasiPage() {
  const [list, setList] = useState<MutasiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMutasi, setSelectedMutasi] = useState<MutasiData | null>(null);
  
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1, limit: 15 });

  const fetchData = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const res = await mutasiService.getAll(page, pagination.limit, search, jenisFilter);
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

  const openDetail = (mutasi: MutasiData) => {
    setSelectedMutasi(mutasi);
    setModalOpen(true);
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brown-100 flex items-center justify-center">
              <ArrowRightLeft className="w-4.5 h-4.5 text-brown-600" />
            </div>
            Mutasi Umat
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-[2.6rem]">
            Total <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> riwayat perpindahan tercatat.
          </p>
        </div>
      </div>

      {/* MAIN CARD */}
      <Card className="shadow-md border-slate-200 rounded-xl overflow-hidden">
        <CardContent className="p-0">

          {/* FILTER BAR */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 bg-white items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Cari nama umat..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brown-500 transition-shadow placeholder:text-slate-400"
              />
            </div>
            
            <select
              value={jenisFilter}
              onChange={(e) => setJenisFilter(e.target.value)}
              className="px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brown-500 w-full sm:w-auto"
            >
              <option value="">Semua Mutasi</option>
              <option value="Pindah Basis">Pindah Basis</option>
              <option value="Pindah Stasi">Pindah Stasi</option>
              <option value="Pindah Paroki">Pindah Paroki</option>
              <option value="Pindah Dekenat">Pindah Dekenat</option>
              <option value="Pindah Keuskupan">Pindah Keuskupan</option>
              <option value="Meninggal">Meninggal</option>
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
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Jenis Mutasi</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Tanggal Kejadian</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider">Keterangan</TableHead>
                  <TableHead className="font-bold text-slate-600 uppercase text-xs tracking-wider text-center pr-5">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <TableRow key={i}>
                      {Array.from({ length: 6 }).map((_, j) => (
                        <TableCell key={j}>
                          <div className="h-4 bg-slate-100 rounded animate-pulse" style={{ width: `${50 + Math.random() * 50}%` }} />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-16 text-slate-500">
                      <ArrowRightLeft className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p className="font-medium">Tidak ada data mutasi ditemukan</p>
                      <p className="text-sm text-slate-400 mt-1">Coba ubah kata kunci pencarian atau jenis filter</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((m, index) => {
                    const rowNum = (pagination.currentPage - 1) * pagination.limit + index + 1;

                    return (
                      <TableRow key={m.id} className="hover:bg-slate-100/60 transition-colors group">
                        <TableCell className="text-slate-400 text-sm">{rowNum}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <span className="font-semibold text-slate-900 text-sm capitalize lowercase">{m.Umat?.nama_lengkap || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${mutasiColorMap[m.jenis_mutasi] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {m.jenis_mutasi}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {m.tanggal_kejadian ? format(new Date(m.tanggal_kejadian), 'dd MMM yyyy', { locale: localeId }) : '-'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600 truncate max-w-[200px]">
                          {m.keterangan || '-'}
                        </TableCell>
                        <TableCell className="text-center pr-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetail(m)}
                              title="Lihat Detail"
                              className="h-8 w-8 text-slate-400 hover:text-brown-600 hover:bg-brown-50 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Hapus Data"
                              className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white">
            <p className="text-sm text-slate-500">
              Menampilkan{' '}
              <span className="font-semibold text-slate-800">{list.length > 0 ? (curPage - 1) * pagination.limit + 1 : 0}</span>–
              <span className="font-semibold text-slate-800">{Math.min(curPage * pagination.limit, pagination.total)}</span> dari{' '}
              <span className="font-semibold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> data mutasi
            </p>

            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled={curPage === 1 || loading} onClick={() => fetchData(curPage - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {getPageNumbers().map((page) => (
                <Button
                  key={page}
                  variant={curPage === page ? 'default' : 'outline'}
                  size="icon"
                  className={`h-8 w-8 rounded-lg text-xs font-medium ${curPage === page ? 'bg-brown-600 border-brown-600 text-white hover:bg-brown-700' : ''}`}
                  onClick={() => fetchData(page)}
                  disabled={loading}
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" disabled={curPage === totalPages || loading || totalPages === 0} onClick={() => fetchData(curPage + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* DETAIL MODAL */}
      <MutasiDetailModal
        mutasi={selectedMutasi}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedMutasi(null); }}
      />
    </div>
  );
}

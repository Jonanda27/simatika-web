"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { 
  Plus, Search, Eye, ChevronLeft, ChevronRight, Edit, Trash2,
  User, Home, BookOpen, Users, Activity, AlertCircle,
  Phone, MapPin, X
} from "lucide-react";
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
// ================== MAIN PAGE ==================
export default function DataUmatPage() {
  const [umatList, setUmatList] = useState<UmatData[]>([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1, limit: 15 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [jkFilter, setJkFilter] = useState('');
  const [selectedUmat, setSelectedUmat] = useState<UmatData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
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

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brown-100 flex items-center justify-center">
              <Users className="w-4.5 h-4.5 text-brown-600" />
            </div>
            Data Umat
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-[2.6rem]">
            Total <span className="font-bold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> umat terdaftar dari Database.
          </p>
        </div>
      </div>

      {/* MAIN CARD */}
      <Card className="shadow-md border-slate-200">
        <CardContent className="p-0">

          {/* FILTER BAR */}
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 bg-white rounded-t-lg">
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Cari nama umat..."
                className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brown-500 transition-shadow placeholder:text-slate-400"
              />
            </div>

            {/* Filter JK */}
            <div className="flex items-center gap-2">
              {[
                { label: 'Semua', value: '' },
                { label: '♂ Laki-laki', value: 'L' },
                { label: '♀ Perempuan', value: 'P' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setJkFilter(opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border shadow-sm ${
                    jkFilter === opt.value
                      ? 'bg-brown-600 text-white border-brown-600 shadow-md shadow-brown-600/20'
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
                        <TableCell key={j}>
                          <div className="h-4 bg-slate-200 rounded animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
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
                      <TableRow key={umat.id} className="hover:bg-slate-100/60 transition-colors group">
                        <TableCell className="text-slate-500 text-sm">{rowNum}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-brown-100 text-brown-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {umat.nama_lengkap?.charAt(0) || 'U'}
                            </div>
                            <span className="font-semibold text-slate-900 text-sm capitalize lowercase">{umat.nama_lengkap}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">{umat.fam || '-'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-xs ${umat.jenis_kelamin === 'L' ? 'border-brown-200 bg-brown-50 text-brown-700' : 'border-pink-200 bg-pink-50 text-pink-700'}`}>
                            {umat.jenis_kelamin === 'L' ? 'L' : umat.jenis_kelamin === 'P' ? 'P' : '-'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-600 text-sm">{age}</TableCell>
                        <TableCell>
                          {sacramentCount > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {umat.Sacraments?.slice(0, 2).map(s => (
                                <Badge key={s.id} variant="outline" className={`text-[10px] px-1.5 py-0 ${sacramentsColorMap[s.jenis_sakramen] || ''}`}>
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
                          <Badge variant="outline" className={`text-xs ${status.color}`}>
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center pr-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDetail(umat)}
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
          <div className="p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-lg">
            <p className="text-sm text-slate-500">
              Menampilkan <span className="font-semibold text-slate-800">{(pagination.currentPage - 1) * pagination.limit + 1}</span>–
              <span className="font-semibold text-slate-800">{Math.min(pagination.currentPage * pagination.limit, pagination.total)}</span> dari{' '}
              <span className="font-semibold text-slate-800">{pagination.total.toLocaleString('id-ID')}</span> data
            </p>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-lg"
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
                    className={`h-8 w-8 rounded-lg text-xs font-medium ${pagination.currentPage === page ? 'bg-brown-600 text-white hover:bg-brown-700 border-brown-600' : ''}`}
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
                className="h-8 w-8 rounded-lg"
                disabled={pagination.currentPage === pagination.totalPages || loading}
                onClick={() => fetchData(pagination.currentPage + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* DETAIL MODAL */}
      <UmatDetailModal
        umat={selectedUmat}
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedUmat(null); }}
      />
    </div>
  );
}

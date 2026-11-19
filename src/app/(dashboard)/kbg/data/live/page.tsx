"use client";

import { useEffect, useState, useCallback } from "react";
import { keluargaService } from "@/services/keluarga.service";
import { KeluargaData, KeluargaPagination } from "@/types/keluarga";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, AlertCircle, RefreshCw, Eye, CheckCircle, ChevronLeft, ChevronRight, Clock, Download } from "lucide-react";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { KeluargaDetailModal } from "@/components/features/keluarga/KeluargaDetailModal";

export default function DatabaseLivePage() {
  const [data, setData] = useState<KeluargaData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [pagination, setPagination] = useState<KeluargaPagination>({
    total: 0,
    totalPages: 1,
    currentPage: 1,
    limit: 15,
  });

  const [selectedKeluarga, setSelectedKeluarga] = useState<KeluargaData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await keluargaService.getAll({ page, limit: 15, search: "" });
      setData(res.data);
      setPagination(res.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [fetchData]);

  const openDetail = async (keluarga: KeluargaData) => {
    setSelectedKeluarga(keluarga);
    setIsModalOpen(true);
    try {
      const res = await keluargaService.getById(keluarga.id);
      setSelectedKeluarga(res.data);
    } catch (e) { console.error(e); }
  };

  const handleExportExcel = async () => {
    setExporting(true);
    try {
      // Ambil semua data (limit besar) untuk diexport
      const res = await keluargaService.getAll({ page: 1, limit: 10000, search: "" });
      const allData = res.data;

      if (!allData || allData.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
      }

      // Format data untuk excel
      const excelData = allData.map((item, index) => {
        const kkMember = item.Umats?.find(u => u.status_dalam_keluarga === 'KK' || u.status_dalam_keluarga === 'Kepala Keluarga');
        const namaKK = kkMember?.nama_lengkap || 'Tanpa Nama';
        
        return {
          "No": index + 1,
          "Nama Kepala Keluarga": namaKK,
          "No KK Paroki": item.no_kk_paroki || "-",
          "KBG": item.Kbg?.nama_kbg || "-",
          "Status Rumah": item.status_rumah || "-",
          "Pendapatan/Bulan": item.pendapatan_per_bulan ? `Rp ${item.pendapatan_per_bulan.toLocaleString('id-ID')}` : "-",
          "Jumlah Anggota": item.Umats?.length || 0,
          "Tanggal Terdaftar": item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy HH:mm') : '-'
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Keluarga KBG");

      // Menyesuaikan lebar kolom
      const wscols = [
        {wch: 5},  // No
        {wch: 30}, // Nama KK
        {wch: 20}, // No KK Paroki
        {wch: 20}, // KBG
        {wch: 20}, // Status Rumah
        {wch: 20}, // Pendapatan
        {wch: 15}, // Jumlah Anggota
        {wch: 20}, // Tanggal
      ];
      worksheet['!cols'] = wscols;

      const kbgName = allData[0]?.Kbg?.nama_kbg || 'Semua';
      XLSX.writeFile(workbook, `Data_Keluarga_${kbgName}.xlsx`);
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
    <div className="p-4 sm:p-8 min-h-full">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
              Data Keluarga
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Data keluarga yang telah disetujui oleh admin Paroki dan resmi masuk ke Database Utama.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={handleExportExcel} variant="outline" className="rounded-none border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors font-bold" disabled={exporting || loading}>
              <Download className={`w-4 h-4 mr-2 ${exporting ? 'animate-bounce' : ''}`} />
              {exporting ? 'Mengekspor...' : 'Export Excel'}
            </Button>
            <Button onClick={() => fetchData(curPage)} variant="outline" className="shrink-0 rounded-none border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors" disabled={loading || exporting}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Segarkan Data
            </Button>
          </div>
        </div>

      <Card className="border-slate-200/80 shadow-sm rounded-none overflow-hidden bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-10 h-10 border-4 border-brown-100 border-t-brown-600 rounded-none animate-spin mb-4"></div>
              <p className="font-semibold text-slate-600">Memuat data...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center min-h-[300px] justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-none border border-slate-100 flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Tidak ada data</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Belum ada keluarga yang terdaftar dalam Database Utama.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {data.map((item) => {
                const kkMember = item.Umats?.find(u => u.status_dalam_keluarga === 'KK' || u.status_dalam_keluarga === 'Kepala Keluarga');
                const namaKK = kkMember?.nama_lengkap || 'Tanpa Nama';
                const jumlahAnggota = item.Umats?.length || 0;

                return (
                  <div key={item.id} className="p-5 sm:p-6 hover:bg-brown-50/20 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 group">
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-none flex items-center justify-center flex-shrink-0 border bg-brown-50 border-brown-100">
                        <Home className="w-6 h-6 text-brown-600" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-800 capitalize lowercase">
                          Keluarga {namaKK}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-bold text-slate-500">
                          <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-none border border-slate-200/60 text-slate-600">
                            <Users className="w-3.5 h-3.5 text-slate-400" /> 
                            {jumlahAnggota} Anggota
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-none border border-slate-100">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            Terkirim: {item.createdAt ? format(new Date(item.createdAt), 'dd MMM yyyy HH:mm') : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                      <div className="hidden sm:block mr-2">
                        <Badge className="bg-emerald-100 text-emerald-800 border-0 rounded-none font-bold px-3 py-1 text-xs"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Diverifikasi Paroki</Badge>
                      </div>
                      <div className="sm:hidden w-full flex justify-start mb-2">
                        <Badge className="bg-emerald-100 text-emerald-800 border-0 rounded-none font-bold px-3 py-1 text-xs"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Diverifikasi Paroki</Badge>
                      </div>
                      <Button 
                        onClick={() => openDetail(item)} 
                        variant="outline" 
                        className="rounded-none bg-white hover:bg-slate-50 text-slate-700 font-bold border-slate-200 shadow-sm transition-all h-10 px-5"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Detail
                      </Button>
                      <Button 
                        variant="default" 
                        className="rounded-none bg-blue-600 hover:bg-blue-700 text-white shadow-sm font-bold h-10 px-5"
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          window.location.href = `/kbg/pendataan?updateFamilyId=${item.id}`; 
                        }}
                      >
                        Update Data
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && data.length > 0 && totalPages > 1 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
              <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">
                Halaman {curPage} dari {totalPages}
              </span>
              <div className="flex items-center gap-1 ml-auto sm:ml-0">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-none text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
                  disabled={curPage === 1}
                  onClick={() => fetchData(curPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {getPageNumbers().map(num => (
                  <Button
                    key={num}
                    variant={num === curPage ? "default" : "outline"}
                    className={`h-9 w-9 p-0 rounded-none ${num === curPage ? 'bg-brown-600 hover:bg-brown-700 text-white border-transparent' : 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50 font-medium'}`}
                    onClick={() => fetchData(num)}
                  >
                    {num}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-none text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
                  disabled={curPage === totalPages}
                  onClick={() => fetchData(curPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedKeluarga && (
        <KeluargaDetailModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedKeluarga(null);
          }}
          keluarga={selectedKeluarga}
        />
      )}
    </div>
  </div>
  );
}


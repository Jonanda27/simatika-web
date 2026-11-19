"use client";

import { useEffect, useState } from "react";
import { verificationService } from "@/services/verification.service";
import { VerificationData } from "@/types/verification";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, CheckCircle, XCircle, Clock, Eye, AlertCircle, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { VerifikasiDetailModal } from "@/components/features/verifikasi/VerifikasiDetailModal";

interface StatusDataViewProps {
  statusFilter: 'ALL' | 'PENDING' | 'VERIFIED_STASI' | 'APPROVED_PAROKI' | 'REJECTED';
  title: string;
  description: string;
}

export function StatusDataView({ statusFilter, title, description }: StatusDataViewProps) {
  const [data, setData] = useState<VerificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalFilter, setInternalFilter] = useState<string>('ALL');
  
  const [selectedItem, setSelectedItem] = useState<VerificationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await verificationService.getMySubmissions();
      setData(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item => {
    if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
    if (internalFilter !== 'ALL' && item.status !== internalFilter) return false;
    return true;
  });

  const openDetail = (item: VerificationData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0 rounded-none font-bold px-3 py-1 text-xs"><Clock className="w-3.5 h-3.5 mr-1.5" /> Menunggu Stasi</Badge>;
      case 'VERIFIED_STASI':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-0 rounded-none font-bold px-3 py-1 text-xs"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Diverifikasi Stasi</Badge>;
      case 'APPROVED_PAROKI':
        return <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0 rounded-none font-bold px-3 py-1 text-xs"><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Disetujui Paroki</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-0 rounded-none font-bold px-3 py-1 text-xs"><XCircle className="w-3.5 h-3.5 mr-1.5" /> Ditolak</Badge>;
      default:
        return <Badge variant="outline" className="rounded-none">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            {title}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            {description}
          </p>
        </div>
        <Button onClick={fetchData} variant="outline" className="shrink-0 rounded-none border-slate-200 font-bold text-slate-600 hover:bg-slate-100 transition-colors" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Segarkan Data
        </Button>
      </div>

      {statusFilter === 'ALL' && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            variant={internalFilter === 'ALL' ? 'default' : 'outline'} 
            onClick={() => setInternalFilter('ALL')}
            className={`rounded-none text-xs font-bold ${internalFilter === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-600'}`}
          >
            Semua Data
          </Button>
          <Button 
            variant={internalFilter === 'PENDING' ? 'default' : 'outline'} 
            onClick={() => setInternalFilter('PENDING')}
            className={`rounded-none text-xs font-bold ${internalFilter === 'PENDING' ? 'bg-amber-600 text-white border-amber-600' : 'text-slate-600'}`}
          >
            Pending
          </Button>
          <Button 
            variant={internalFilter === 'VERIFIED_STASI' ? 'default' : 'outline'} 
            onClick={() => setInternalFilter('VERIFIED_STASI')}
            className={`rounded-none text-xs font-bold ${internalFilter === 'VERIFIED_STASI' ? 'bg-blue-600 text-white border-blue-600' : 'text-slate-600'}`}
          >
            Verifikasi Stasi
          </Button>
          <Button 
            variant={internalFilter === 'APPROVED_PAROKI' ? 'default' : 'outline'} 
            onClick={() => setInternalFilter('APPROVED_PAROKI')}
            className={`rounded-none text-xs font-bold ${internalFilter === 'APPROVED_PAROKI' ? 'bg-emerald-600 text-white border-emerald-600' : 'text-slate-600'}`}
          >
            Verifikasi Paroki
          </Button>
          <Button 
            variant={internalFilter === 'REJECTED' ? 'default' : 'outline'} 
            onClick={() => setInternalFilter('REJECTED')}
            className={`rounded-none text-xs font-bold ${internalFilter === 'REJECTED' ? 'bg-red-600 text-white border-red-600' : 'text-slate-600'}`}
          >
            Ditolak
          </Button>
        </div>
      )}

      <Card className="border-slate-200/80 shadow-sm rounded-none overflow-hidden bg-white">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-10 h-10 border-4 border-brown-100 border-t-brown-600 rounded-none animate-spin mb-4"></div>
              <p className="font-semibold text-slate-600">Memuat data...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center min-h-[300px] justify-center">
              <div className="w-16 h-16 bg-slate-50 rounded-none border border-slate-100 flex items-center justify-center mx-auto mb-5">
                <AlertCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Tidak ada data</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Belum ada riwayat pengiriman data yang sesuai dengan status ini.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredData.map((item) => (
                <div key={item.id} className="p-5 sm:p-6 hover:bg-brown-50/20 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 group">
                  <div className="flex items-start gap-5">
                    <div className={`w-14 h-14 rounded-none flex items-center justify-center flex-shrink-0 border ${item.payload_data.type === 'KEPENGURUSAN' ? 'bg-blue-50 border-blue-100' : 'bg-brown-50 border-brown-100'}`}>
                      {item.payload_data.type === 'KEPENGURUSAN' ? (
                        <Users className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Home className="w-6 h-6 text-brown-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800 capitalize lowercase">
                        {item.payload_data.type === 'KEPENGURUSAN' 
                          ? `SK Pengurus KBG (Periode ${item.payload_data.periode_mulai})`
                          : item.payload_data.type === 'PECAH_KK'
                            ? `Pecah KK: ${item.payload_data.members?.[0]?.nama_lengkap || 'Tanpa Nama'}`
                            : `Keluarga ${item.payload_data.members?.[0]?.nama_lengkap || 'Tanpa Nama'}`
                        }
                      </h4>
                      
                      <div className="flex flex-wrap items-center gap-2 mt-3 text-xs font-bold text-slate-500">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-none border border-slate-200/60 text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400" /> 
                          {item.payload_data.type === 'KEPENGURUSAN' 
                            ? `${item.payload_data.pengurus?.length || 0} Pengurus`
                            : `${item.payload_data.members?.length || 0} Anggota`
                          }
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-500 bg-slate-50 px-3 py-1.5 rounded-none border border-slate-100">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Terkirim: {format(new Date(item.createdAt), 'dd MMM yyyy HH:mm')}
                        </span>
                      </div>
                      {item.status === 'REJECTED' && item.reject_reason && (
                        <div className="mt-3 text-sm text-red-700 bg-red-50 p-3 rounded-none border-l-4 border-l-red-500 font-medium">
                          <span className="font-bold uppercase text-xs tracking-wider">Alasan Ditolak:</span><br/>
                          {item.reject_reason}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <div className="hidden sm:block mr-2">
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="sm:hidden w-full flex justify-start mb-2">
                      {getStatusBadge(item.status)}
                    </div>
                    <Button 
                      onClick={() => openDetail(item)} 
                      variant="outline" 
                      className="rounded-none bg-white hover:bg-slate-50 text-slate-700 font-bold border-slate-200 shadow-sm transition-all h-10 px-5"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Detail
                    </Button>
                    {item.status === 'REJECTED' && (
                      <Button
                        onClick={() => {
                          const url = item.payload_data.type === 'KEPENGURUSAN' 
                            ? `/kbg/kepengurusan?resubmitId=${item.id}` 
                            : `/kbg/pendataan?resubmitId=${item.id}`;
                          window.location.href = url;
                        }}
                        variant="default"
                        className="rounded-none bg-brown-600 hover:bg-brown-700 text-white font-bold shadow-sm h-10 px-5"
                      >
                        Perbaiki Data
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <VerifikasiDetailModal 
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedItem={selectedItem}
        userRole="KETUA_KBG"
        onVerifyStasi={() => {}}
        onApproveParoki={() => {}}
        onReject={() => {}}
        actionLoading={false}
      />
    </div>
  );
}


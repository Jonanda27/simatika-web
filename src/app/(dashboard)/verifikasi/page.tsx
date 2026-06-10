"use client";

import { useEffect, useState } from "react";
import { verificationService } from "@/services/verification.service";
import { VerificationData } from "@/types/verification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin, Home, Users, CheckCircle, XCircle, AlertCircle, Eye, User } from "lucide-react";
import { format } from "date-fns";

import { VerifikasiDetailModal } from "@/components/features/verifikasi/VerifikasiDetailModal";
export default function VerifikasiPage() {
  const [data, setData] = useState<VerificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'VERIFIED_STASI' | 'APPROVED_PAROKI'>('PENDING');
  
  const [selectedItem, setSelectedItem] = useState<VerificationData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // State for Real Auth
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // 1. Dapatkan role dari LocalStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        const role = userObj.role || 'ADMIN_STASI'; 
        setUserRole(role);
        
        // 2. Set default tab berdasarkan Role
        if (role === 'ADMIN_PAROKI') {
          setActiveTab('VERIFIED_STASI');
        } else {
          setActiveTab('PENDING');
        }
      } catch (e) {
        console.error("Gagal membaca data user");
      }
    }
  }, []);

  useEffect(() => {
    // Hanya ambil data jika role sudah terdeteksi
    if (userRole) {
      fetchData();
    }
  }, [activeTab, userRole]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await verificationService.getQueue(activeTab);
      setData(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const openDetail = (item: VerificationData) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleVerifyStasi = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      await verificationService.verifyStasi(selectedItem.id);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Gagal memverifikasi data.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveParoki = async () => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      await verificationService.approveParoki(selectedItem.id);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Gagal menyetujui data. Pastikan format valid.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedItem) return;
    setActionLoading(true);
    try {
      await verificationService.rejectData(selectedItem.id, reason);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert("Gagal menolak data.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brown-100 flex items-center justify-center">
              <CheckCircle className="w-4.5 h-4.5 text-brown-600" />
            </div>
            {userRole === 'ADMIN_PAROKI' ? 'Persetujuan Akhir Paroki' : 'Antrean Verifikasi Stasi'}
          </h2>
          <p className="text-sm text-slate-500 mt-1 ml-[2.6rem]">
            {userRole === 'ADMIN_PAROKI' 
              ? 'Periksa dan setujui data keluarga yang telah diverifikasi oleh Stasi untuk diteruskan ke Database Utama.' 
              : 'Review data pendataan keluarga dari lapangan (KBG) sebelum dinaikkan ke Paroki.'}
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-md rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <div className="flex space-x-6">
            {userRole !== 'ADMIN_PAROKI' && (
              <button
                onClick={() => setActiveTab('PENDING')}
                className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'PENDING' ? 'border-brown-600 text-brown-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Menunggu Stasi {activeTab === 'PENDING' && data.length > 0 && `(${data.length})`}
              </button>
            )}
            {userRole === 'ADMIN_PAROKI' && (
              <button
                onClick={() => setActiveTab('VERIFIED_STASI')}
                className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'VERIFIED_STASI' ? 'border-brown-600 text-brown-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              >
                Telah Diverifikasi Stasi {activeTab === 'VERIFIED_STASI' && data.length > 0 && `(${data.length})`}
              </button>
            )}
            <button
              onClick={() => setActiveTab('APPROVED_PAROKI')}
              className={`text-sm font-bold pb-4 -mb-4 border-b-2 transition-colors ${activeTab === 'APPROVED_PAROKI' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
            >
              Riwayat Disetujui Paroki {activeTab === 'APPROVED_PAROKI' && data.length > 0 && `(${data.length})`}
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-10 text-center text-slate-500 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-brown-200 border-t-brown-600 rounded-full animate-spin mb-4"></div>
              Memuat data antrean...
            </div>
          ) : data.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-700">Tidak ada data di antrean</h3>
              <p className="text-sm text-slate-500 mt-1">Semua data pada tahap ini telah diproses.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/60">
              {data.map((item) => (
                <div key={item.id} className="p-4 sm:p-6 hover:bg-slate-100/60 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-brown-100 flex items-center justify-center flex-shrink-0">
                      <Home className="w-6 h-6 text-brown-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 capitalize lowercase">
                        Keluarga {item.payload_data.members?.[0]?.nama_lengkap || 'Tanpa Nama'}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs font-medium text-slate-600">
                        <span className="flex items-center gap-1.5 bg-brown-50 px-2.5 py-1 rounded-full border border-brown-100 text-brown-700">
                          <User className="w-3.5 h-3.5" /> 
                          Penginput: <span className="capitalize lowercase">{item.User?.username || 'Sistem'}</span>
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/60 text-slate-600">
                          <Users className="w-3.5 h-3.5 text-slate-400" /> {item.payload_data.members?.length || 0} Anggota
                        </span>
                        <span className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                          Dikirim: {format(new Date(item.createdAt), 'dd MMM yyyy HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => openDetail(item)} 
                    variant="ghost" 
                    className="shrink-0 bg-brown-50 hover:bg-brown-100 text-brown-700 font-semibold border border-brown-100 shadow-sm transition-all"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Review Data
                  </Button>
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
        userRole={userRole}
        onVerifyStasi={handleVerifyStasi}
        onApproveParoki={handleApproveParoki}
        onReject={handleReject}
        actionLoading={actionLoading}
      />
    </div>
  );
}

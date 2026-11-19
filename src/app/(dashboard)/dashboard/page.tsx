"use client";

import { 
  Users, 
  TrendingUp,
  Crosshair,
  HeartHandshake,
  Clock,
  User,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Label
} from "recharts";

import { useEffect, useState } from "react";
import { dashboardService } from "@/services/dashboard.service";
import { DashboardStats } from "@/types/dashboard";
import { verificationService } from "@/services/verification.service";
import { VerificationData } from "@/types/verification";
import { format } from "date-fns";
import DashboardMiniMap from "@/components/features/dashboard/DashboardMiniMap";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const isKbg = user?.role === 'KETUA_KBG' || user?.role === 'Ketua KBG';
  const isParoki = user?.role === 'ADMIN_PAROKI' || user?.role === 'Admin Paroki';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [queue, setQueue] = useState<VerificationData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsRes, queueRes] = await Promise.all([
          dashboardService.getStats(),
          verificationService.getQueue('PENDING')
        ]);
        setStats(statsRes.data);
        // Ambil 5 data terbaru
        setQueue(queueRes.data.slice(0, 5));
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex-1 p-8 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
         <div className="w-10 h-10 border-4 border-brown-200 border-t-brown-600 rounded-none animate-spin mb-4"></div>
         <p className="text-slate-500 font-medium">Memuat data real-time dari Database...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-2 md:px-8 md:pb-8 md:pt-4 bg-transparent relative min-h-[calc(100vh-64px)]">

      
      {/* 4 KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card className="rounded-none shadow-sm border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Total Umat</p>
              <div className="p-2.5 bg-gradient-to-br from-brown-500 to-brown-600 dark:from-brown-700 dark:to-brown-800 rounded-none shadow-md shadow-brown-600/20">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.totalUmat.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Orang</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-none border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span className="font-bold mr-1">Terkini</span> 
                <span className="text-slate-500 dark:text-slate-400">Database Utama</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="rounded-none shadow-sm border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Total Keluarga</p>
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-700 dark:to-emerald-800 rounded-none shadow-md shadow-emerald-600/20">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.totalKeluarga.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Keluarga</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-none border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span className="font-bold mr-1">Terkini</span> 
                <span className="text-slate-500 dark:text-slate-400">Database Utama</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="rounded-none shadow-sm border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Sakramen Baptis</p>
              <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800 rounded-none shadow-md shadow-purple-600/20">
                <Crosshair className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.sakramenBaptis.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Orang</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-none border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span className="font-bold mr-1">Terkini</span> 
                <span className="text-slate-500 dark:text-slate-400">Data Tervalidasi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="rounded-none shadow-sm border-slate-200/80 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white/60 backdrop-blur-md">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Sakramen Nikah</p>
              <div className="p-2.5 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800 rounded-none shadow-md shadow-orange-600/20">
                <HeartHandshake className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.sakramenNikah.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Pasangan</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-none border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span className="font-bold mr-1">Terkini</span> 
                <span className="text-slate-500 dark:text-slate-400">Data Tervalidasi</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="rounded-none md:col-span-4 shadow-sm border-slate-200/80 dark:border-slate-800 bg-white/60 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Grafik Jumlah Umat</CardTitle>
            <Button variant="outline" size="sm" className="h-8 text-xs font-normal">Tahun {new Date().getFullYear()}</Button>
          </CardHeader>
          <CardContent className="pl-0 pb-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <LineChart data={stats.grafikUmat} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="umat" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none md:col-span-3 shadow-sm border-slate-200/80 dark:border-slate-800 bg-white/60 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Komposisi Umur Umat</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%" minHeight={300}>
              <PieChart>
                <Pie
                  data={stats.komposisiUmur}
                  cx="50%"
                  cy="50%"
                  innerRadius={75}
                  outerRadius={105}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.komposisiUmur.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <Label 
                    position="center"
                    content={(props: any) => {
                      const { viewBox } = props;
                      if (!viewBox || typeof viewBox.cx !== 'number' || typeof viewBox.cy !== 'number') return null;
                      const { cx, cy } = viewBox;
                      return (
                        <>
                          <text x={cx} y={cy - 10} textAnchor="middle" dominantBaseline="central" className="text-xs font-medium fill-slate-500">
                            Total Umat
                          </text>
                          <text x={cx} y={cy + 15} textAnchor="middle" dominantBaseline="central" className="text-2xl font-bold fill-slate-800 dark:fill-slate-100">
                            {stats.kpi.totalUmat}
                          </text>
                        </>
                      );
                    }}
                  />
                </Pie>
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat('id-ID').format(Number(value))}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* NEW CHARTS & MAP SECTION */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* MUTASI CHART */}
        <Card className="rounded-none shadow-sm border-slate-200/80 dark:border-slate-800 bg-white/60 backdrop-blur-md flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Statistik Mutasi</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px] flex items-center justify-center pb-6">
            {stats.statistikMutasi?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.statistikMutasi}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.statistikMutasi.map((entry, index) => (
                      <Cell key={`cell-mutasi-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => new Intl.NumberFormat('id-ID').format(Number(value))}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 font-medium">Tidak ada data mutasi</p>
            )}
          </CardContent>
        </Card>

        {/* KEAKTIFAN PASTORAL CHART */}
        <Card className="rounded-none shadow-sm border-slate-200/80 dark:border-slate-800 bg-white/60 backdrop-blur-md flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Keaktifan Pastoral (Misa)</CardTitle>
          </CardHeader>
          <CardContent className="h-[260px] flex items-center justify-center pb-6">
            {stats.keaktifanPastoral?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.keaktifanPastoral}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.keaktifanPastoral.map((entry, index) => (
                      <Cell key={`cell-pastoral-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => new Intl.NumberFormat('id-ID').format(Number(value))}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-slate-400 font-medium">Tidak ada data aktivitas pastoral</p>
            )}
          </CardContent>
        </Card>

        {/* MINI MAP */}
        <Card className="rounded-none shadow-sm border-slate-200/80 dark:border-slate-800 bg-white/60 backdrop-blur-md overflow-hidden flex flex-col min-h-[300px]">
          <CardHeader className="pb-2 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 shrink-0">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">
              {isKbg ? 'Peta Sebaran Keluarga' : isParoki ? 'Peta Sebaran Stasi' : 'Peta Sebaran KBG'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 relative">
             <DashboardMiniMap petaSebaran={stats.petaSebaran} />
          </CardContent>
        </Card>
      </div>

      {/* TABLE SECTION */}
      <Card className="rounded-none border border-slate-200/80 dark:border-slate-800 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-none border border-amber-100">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200">Data Menunggu Verifikasi</CardTitle>
              <p className="text-sm text-slate-500 font-medium mt-0.5">Daftar umat yang baru didata dan butuh peninjauan</p>
            </div>
          </div>
          {!isKbg && (
            <Link href="/verifikasi">
              <Button variant="outline" size="sm" className="h-9 rounded-none text-brown-700 border-brown-200 hover:bg-brown-50 hover:text-brown-800 font-semibold px-4 transition-colors">
                Lihat Semua Antrean
              </Button>
            </Link>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-transparent border-b border-slate-200/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[60px] font-bold text-slate-600 py-4 px-6">No</TableHead>
                <TableHead className="font-bold text-slate-600 py-4">Kepala Keluarga</TableHead>
                <TableHead className="font-bold text-slate-600 py-4">Petugas Input</TableHead>
                <TableHead className="font-bold text-slate-600 py-4">Tgl Input</TableHead>
                <TableHead className="font-bold text-slate-600 py-4">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queue.length > 0 ? queue.map((row, i) => (
                <TableRow key={row.id} className="group hover:bg-brown-50/30 transition-colors cursor-default border-b border-slate-100 last:border-0">
                  <TableCell className="font-semibold text-slate-500 px-6">{i + 1}</TableCell>
                  <TableCell className="font-bold text-slate-800">{row.payload_data.members?.[0]?.nama_lengkap || 'Tanpa Nama'}</TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      {row.User?.username || 'Sistem'}
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">{format(new Date(row.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-none text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3 mr-1.5" />
                      {row.status === 'PENDING' ? 'Menunggu' : row.status}
                    </span>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-500">
                      <div className="w-12 h-12 bg-slate-100 rounded-none flex items-center justify-center mb-3">
                        <CheckCircle2 className="w-6 h-6 text-slate-400" />
                      </div>
                      <p className="font-semibold text-slate-600">Semua data sudah diverifikasi</p>
                      <p className="text-sm mt-1">Tidak ada antrean peninjauan saat ini.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {queue.length > 0 && (
            <div className="p-4 bg-transparent border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">Menampilkan {queue.length} antrean terbaru</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


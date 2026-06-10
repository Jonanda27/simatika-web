"use client";

import { 
  Users, 
  TrendingUp,
  Crosshair,
  HeartHandshake,
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

export default function DashboardPage() {
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
         <div className="w-10 h-10 border-4 border-brown-200 border-t-brown-600 rounded-full animate-spin mb-4"></div>
         <p className="text-slate-500 font-medium">Memuat data real-time dari Database...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-4 pt-2 md:px-8 md:pb-8 md:pt-4 bg-slate-50/50 dark:bg-slate-950/50 min-h-[calc(100vh-64px)]">
      
      {/* 4 KPI CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <Card className="shadow-md border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Umat</p>
              <div className="p-2.5 bg-brown-100 dark:bg-brown-900/40 rounded-full">
                <Users className="h-5 w-5 text-brown-600 dark:text-brown-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.totalUmat.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Orang</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span className="font-bold mr-1">Terkini</span> 
                <span className="text-slate-500 dark:text-slate-400">Database Utama</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2 */}
        <Card className="shadow-md border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Keluarga</p>
              <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.totalKeluarga.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Keluarga</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span className="font-bold mr-1">Terkini</span> 
                <span className="text-slate-500 dark:text-slate-400">Database Utama</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3 */}
        <Card className="shadow-md border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sakramen Baptis</p>
              <div className="p-2.5 bg-purple-100 dark:bg-purple-900/40 rounded-full">
                <Crosshair className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.sakramenBaptis.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Orang</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span className="font-bold mr-1">Terkini</span> 
                <span className="text-slate-500 dark:text-slate-400">Data Tervalidasi</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4 */}
        <Card className="shadow-md border-slate-200 dark:border-slate-800 transition-all hover:shadow-lg">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sakramen Nikah</p>
              <div className="p-2.5 bg-orange-100 dark:bg-orange-900/40 rounded-full">
                <HeartHandshake className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{stats.kpi.sakramenNikah.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Pasangan</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 w-fit px-2 py-1 rounded-md border border-emerald-100 dark:border-emerald-800/50">
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
        <Card className="md:col-span-4 shadow-sm border-slate-200 dark:border-slate-800">
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

        <Card className="md:col-span-3 shadow-sm border-slate-200 dark:border-slate-800">
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

      {/* TABLE SECTION */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Data Umat Menunggu Verifikasi</CardTitle>
          <Button variant="outline" size="sm" className="h-8 text-xs font-normal">Lihat Semua</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-[50px] font-semibold">No</TableHead>
                  <TableHead className="font-semibold">Nama Kepala Keluarga</TableHead>
                  <TableHead className="font-semibold">Penginput</TableHead>
                  <TableHead className="font-semibold">Tanggal Input</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-center font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queue.length > 0 ? queue.map((row, i) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{row.payload_data.members?.[0]?.nama_lengkap || 'Tanpa Nama'}</TableCell>
                    <TableCell>{row.User?.username || 'Sistem'}</TableCell>
                    <TableCell>{format(new Date(row.createdAt), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                        {row.status === 'PENDING' ? 'Menunggu' : row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" className="h-7 text-[11px] bg-brown-600 hover:bg-brown-700 text-white px-3">
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-slate-500">
                      Tidak ada antrean data verifikasi saat ini.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between mt-4">
            <p className="text-xs text-slate-500">Menampilkan {queue.length} antrean terbaru</p>
          </div>
        </CardContent>
      </Card>
      
    </div>
  );
}

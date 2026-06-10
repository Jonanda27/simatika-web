"use client";

import { 
  Users, 
  TrendingUp,
  User,
  UserCheck,
  FileText,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { useState } from "react";

// --- Dummy Data ---
const dummyStats = {
  totalUmat: 2450,
  totalKeluarga: 680,
  pria: 1150,
  wanita: 1300,
};

const pertumbuhanData = [
  { tahun: "2019", umat: 1800, keluarga: 450 },
  { tahun: "2020", umat: 1950, keluarga: 490 },
  { tahun: "2021", umat: 2100, keluarga: 550 },
  { tahun: "2022", umat: 2250, keluarga: 610 },
  { tahun: "2023", umat: 2450, keluarga: 680 },
];

const demografiUsia = [
  { name: "Anak-anak (0-12)", value: 450, color: "#3b82f6" },
  { name: "Remaja (13-17)", value: 300, color: "#10b981" },
  { name: "Dewasa (18-59)", value: 1350, color: "#f59e0b" },
  { name: "Lansia (60+)", value: 350, color: "#ef4444" },
];

const laporanTerbaru = [
  { id: 1, laporan: "Laporan Baptis Bulan Ini", tanggal: "2024-05-10", pembuat: "Sekretariat", status: "Selesai" },
  { id: 2, laporan: "Laporan Mutasi Keluar", tanggal: "2024-05-08", pembuat: "Admin KBG", status: "Proses" },
  { id: 3, laporan: "Statistik Kehadiran Misa", tanggal: "2024-05-05", pembuat: "Pengurus", status: "Selesai" },
  { id: 4, laporan: "Laporan Sakramen Krisma", tanggal: "2024-05-01", pembuat: "Sekretariat", status: "Selesai" },
  { id: 5, laporan: "Data Umat Wafat Q1", tanggal: "2024-04-28", pembuat: "Sekretariat", status: "Selesai" },
];
// -------------------

export default function LaporanStatistikPage() {
  const [activeTab, setActiveTab] = useState("statistik");

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-[calc(100vh-64px)]">
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Laporan & Statistik</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Ringkasan data umat dan laporan administratif</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export PDF
          </Button>
          <Button className="flex items-center gap-2 bg-brown-600 hover:bg-brown-700">
            <FileText className="h-4 w-4" />
            Buat Laporan
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-md border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Umat</p>
              <div className="p-2.5 bg-brown-100 dark:bg-brown-900/40 rounded-full">
                <Users className="h-5 w-5 text-brown-600 dark:text-brown-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{dummyStats.totalUmat.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Jiwa</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span>+8.5% dari tahun lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Total Keluarga</p>
              <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/40 rounded-full">
                <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{dummyStats.totalKeluarga.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">KK</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> 
                <span>+5.2% dari tahun lalu</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Laki-laki</p>
              <div className="p-2.5 bg-sky-100 dark:bg-sky-900/40 rounded-full">
                <User className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{dummyStats.pria.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Jiwa</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-slate-500">
                <span>46.9% dari total umat</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-slate-200 dark:border-slate-800">
          <CardContent className="p-5 flex flex-col justify-between h-full">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Perempuan</p>
              <div className="p-2.5 bg-rose-100 dark:bg-rose-900/40 rounded-full">
                <UserCheck className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{dummyStats.wanita.toLocaleString('id-ID')}</h3>
                <span className="text-sm font-medium text-slate-500">Jiwa</span>
              </div>
              <div className="mt-3 flex items-center text-xs text-slate-500">
                <span>53.1% dari total umat</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Pertumbuhan Umat (5 Tahun Terakhir)</CardTitle>
          </CardHeader>
          <CardContent className="pl-0 pb-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pertumbuhanData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="tahun" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={-10} />
                <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dx={10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar yAxisId="left" dataKey="umat" name="Total Umat" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar yAxisId="right" dataKey="keluarga" name="Total Keluarga" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 shadow-sm border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Demografi Usia</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demografiUsia}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {demografiUsia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => `${value} Orang`}
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

      {/* Table Laporan */}
      <Card className="shadow-sm border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">Arsip Laporan Terbaru</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 text-xs font-normal text-brown-600 hover:text-brown-700">Lihat Semua Laporan</Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                <TableRow>
                  <TableHead className="w-[50px] font-semibold">No</TableHead>
                  <TableHead className="font-semibold">Nama Laporan</TableHead>
                  <TableHead className="font-semibold">Tanggal</TableHead>
                  <TableHead className="font-semibold">Dibuat Oleh</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-center font-semibold">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {laporanTerbaru.map((row, i) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-medium">{i + 1}</TableCell>
                    <TableCell>{row.laporan}</TableCell>
                    <TableCell>{new Date(row.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                    <TableCell>{row.pembuat}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        row.status === 'Selesai' 
                          ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                          : "text-amber-600 border-amber-200 bg-amber-50"
                      }>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button size="sm" variant="outline" className="h-7 text-[11px] px-3">
                          Lihat
                        </Button>
                        <Button size="sm" className="h-7 text-[11px] bg-brown-600 hover:bg-brown-700 text-white px-3">
                          Unduh
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

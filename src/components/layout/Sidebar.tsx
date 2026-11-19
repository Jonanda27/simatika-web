"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  Users,
  UserPlus,
  Cross,
  ShieldCheck,
  CalendarDays,
  BarChart3,
  FolderOpen,
  User,
  Settings,
  ArrowRightLeft,
  Map,
  MapPin,
  ClipboardList,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
}

export const menuStasi = [
  { title: "Dashboard Stasi", href: "/dashboard", icon: Home },
  {
    title: "Database Induk",
    icon: Users,
    children: [
      { title: "Data Umat", href: "/data-umat" },
      { title: "Data Keluarga", href: "/data-keluarga" },
      { title: "Pengurus Aktif", href: "/kbg/pengurus" },
      { title: "Data Sakramen", href: "/sakramen" },
      { title: "Mutasi Umat", href: "/mutasi" },
      { title: "Aktivitas Pastoral", href: "/aktivitas" },
    ]
  },
  { title: "Peta Stasi", href: "/peta-stasi", icon: Map },
  { title: "Verifikasi Data", href: "/verifikasi", icon: ShieldCheck },
  {
    title: "Laporan & Arsip",
    icon: FolderOpen,
    children: [
      { title: "Laporan & Statistik", href: "/laporan" },
      { title: "Dokumen & Arsip", href: "/dokumen" },
    ]
  }
];

export const menuParoki = [
  { title: "Dashboard Paroki", href: "/dashboard", icon: Home },
  {
    title: "Database Induk",
    icon: Users,
    children: [
      { title: "Data Umat", href: "/data-umat" },
      { title: "Data Keluarga", href: "/data-keluarga" },
      { title: "Pengurus Aktif", href: "/kbg/pengurus" },
      { title: "Data Sakramen", href: "/sakramen" },
      { title: "Mutasi Umat", href: "/mutasi" },
      { title: "Aktivitas Pastoral", href: "/aktivitas" },
    ]
  },
  { title: "Peta Paroki", href: "/peta-paroki", icon: Map },
  { title: "Approval Akhir", href: "/verifikasi", icon: ShieldCheck },
  {
    title: "Manajemen Wilayah",
    icon: MapPin,
    children: [
      { title: "Data Stasi", href: "/admin/stasi" },
      { title: "Data KBG", href: "/admin/kbg" },
    ]
  },
  {
    title: "Laporan & Arsip",
    icon: FolderOpen,
    children: [
      { title: "Laporan & Statistik", href: "/laporan" },
      { title: "Dokumen & Arsip", href: "/dokumen" },
    ]
  },
  {
    title: "Pengaturan Sistem",
    icon: Settings,
    children: [
      { title: "Manajemen Pengguna", href: "/pengguna" },
      { title: "Pengaturan Paroki", href: "/pengaturan" },
    ]
  }
];

// Default menu
export const menuDefault = [
  { title: "Dashboard", href: "/dashboard", icon: Home }
];

// Menu khusus Admin Gereja
export const menuAdminGereja = [
  { title: "Dashboard Admin Gereja", href: "/dashboard", icon: Home },
  { title: "Import Excel", href: "/admin-gereja/import", icon: ClipboardList }
];

export const menuKbg = [
  { title: "Dashboard KBG", href: "/dashboard", icon: Home },
  {
    title: "Sensus Umat",
    icon: ClipboardList,
    children: [
      { title: "Form Pendataan", href: "/kbg/pendataan" },
      { title: "Data Draft", href: "/kbg/draft" },
    ]
  },
  { title: "Semua Data", href: "/kbg/data/semua", icon: FolderOpen },
  { title: "Data Keluarga", href: "/kbg/data/live", icon: UserPlus },
  { title: "Peta Umat", href: "/peta-kbg", icon: Map },
  { title: "Pengurus Aktif", href: "/kbg/pengurus", icon: Users },
  { title: "Pengajuan Pengurus", href: "/kbg/kepengurusan", icon: ShieldCheck },
];

export function Sidebar({ className, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  let activeMenu: any = menuDefault;
  const isParoki = user?.role === 'ADMIN_PAROKI' || user?.role === 'Admin Paroki';
  const isKbg = user?.role === 'KETUA_KBG' || user?.role === 'Ketua KBG';
  const isAdminGereja = user?.role === 'ADMIN_GEREJA';

  if (isParoki) activeMenu = menuParoki;
  else if (isAdminGereja) activeMenu = menuAdminGereja;
  else if (isKbg) activeMenu = menuKbg;
  else if (user?.role && user.role.includes('ADMIN_STASI')) activeMenu = menuStasi;
  else if (user?.role) activeMenu = menuStasi; // fallback default admin

  return (
    <div className={cn("flex flex-col h-full bg-brown-950 text-slate-300", className)}>

      {/* ── LOGO HEADER ── */}
      <div className={cn("flex items-center gap-3 py-5 border-b border-slate-800/50 shrink-0", isCollapsed ? "px-0 justify-center" : "px-6")}>
        <div className="flex items-center justify-center w-14 h-14 overflow-hidden shrink-0">
          <img src="/logo.png" alt="Logo Simatika" className={cn("object-contain transition-all duration-300", isCollapsed ? "w-10 h-10" : "w-12 h-12")} />
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white tracking-wide leading-tight">SIMATIKA</span>
            <span className="text-[11px] text-slate-400">Keuskupan Timika</span>
          </div>
        )}
      </div>

      {/* ── NAVIGATION ── */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5 min-h-0 custom-scrollbar overflow-x-hidden">
        {!isCollapsed && (
          <p className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
            Menu {isParoki ? 'Paroki' : isAdminGereja ? 'Admin Gereja' : isKbg ? 'KBG' : 'Stasi'}
          </p>
        )}

        {activeMenu.map((item: any) => {
          const hasChildren = item.children && item.children.length > 0;

          if (hasChildren) {
            const isOpen = openMenus[item.title];
            const isAnyChildActive = item.children.some((child: any) => pathname === child.href);

            return (
              <div key={item.title} className="flex flex-col">
                <button
                  onClick={() => !isCollapsed && toggleMenu(item.title)}
                  className={cn(
                    "flex items-center justify-between w-full rounded-lg py-2.5 text-sm font-medium transition-all group",
                    isCollapsed ? "px-0 justify-center" : "px-3",
                    isAnyChildActive && !isOpen
                      ? "text-slate-100 bg-slate-800/40"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
                    <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isAnyChildActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                    {!isCollapsed && <span className="truncate">{item.title}</span>}
                  </div>
                  {!isCollapsed && (isOpen ? <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" /> : <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />)}
                </button>

                {isOpen && !isCollapsed && (
                  <div className="mt-1 ml-4 border-l border-slate-800 pl-2 flex flex-col gap-1">
                    {item.children.map((child: any) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link key={child.title} href={child.href}>
                          <span
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                              isChildActive
                                ? "bg-brown-600 text-white shadow-md shadow-brown-900/30"
                                : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/40"
                            )}
                          >
                            <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", isChildActive ? "bg-white" : "bg-slate-600")} />
                            {child.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link key={item.title} href={item.href} title={isCollapsed ? item.title : undefined}>
              <span
                className={cn(
                  "flex items-center rounded-lg py-2.5 text-sm font-medium transition-all group overflow-hidden",
                  isCollapsed ? "justify-center px-0" : "gap-3 px-3",
                  isActive
                    ? "bg-brown-600 text-white shadow-md shadow-brown-900/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                )}
              >
                <item.icon className={cn("h-5 w-5 shrink-0 transition-colors", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                {!isCollapsed && <span className="truncate">{item.title}</span>}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

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
  Shield,
  ArrowRightLeft,
  Map,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  FileEdit
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

// Menu khusus Admin Stasi
const menuStasi = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Data Umat", href: "/data-umat", icon: Users },
  { title: "Data Keluarga", href: "/data-keluarga", icon: UserPlus },
  { title: "Sakramen", href: "/sakramen", icon: Cross },
  { title: "Mutasi Umat", href: "/mutasi", icon: ArrowRightLeft },
  { title: "Peta Umat", href: "/peta-umat", icon: Map },
  { title: "Verifikasi Data", href: "/verifikasi", icon: ShieldCheck },
  { title: "Aktivitas Pastoral", href: "/aktivitas", icon: CalendarDays },
  { title: "Laporan & Statistik", href: "/laporan", icon: BarChart3 },
  { title: "Dokumen & Arsip", href: "/dokumen", icon: FolderOpen },
  { title: "Pengguna", href: "/pengguna", icon: User },
];

// Menu khusus Admin Paroki
const menuParoki = [
  { title: "Dashboard Paroki", href: "/dashboard", icon: Home },
  { title: "Database Umat & Keluarga", href: "/data-keluarga", icon: UserPlus },
  { title: "Approval Akhir", href: "/verifikasi", icon: ShieldCheck },
  { title: "Peta Umat", href: "/peta-umat", icon: Map },
  { title: "Manajemen Sakramen", href: "/sakramen", icon: Cross },
  { title: "Laporan & Statistik", href: "/laporan", icon: BarChart3 },
  { title: "Dokumen & Arsip", href: "/dokumen", icon: FolderOpen },
  { title: "Manajemen Pengguna", href: "/pengguna", icon: User },
  { title: "Pengaturan Paroki", href: "/pengaturan", icon: Settings },
];

// Default menu
const menuDefault = [
  { title: "Dashboard", href: "/dashboard", icon: Home }
];

// Menu khusus Ketua KBG
const menuKbg = [
  { title: "Dashboard KBG", href: "/dashboard", icon: Home },
  { 
    title: "Sensus Umat", 
    icon: ClipboardList,
    children: [
      { title: "Form Pendataan", href: "/kbg/pendataan" },
      { title: "Import Excel", href: "/kbg/import" },
      { title: "Draft Lokal", href: "/kbg/draft" },
    ]
  },
  { title: "Data Pengurus", href: "/kbg/kepengurusan", icon: Users },
];

// Format role menjadi label yang mudah dibaca
const formatRole = (role: string): string => {
  const map: Record<string, string> = {
    ADMIN_STASI: 'Admin Stasi',
    ADMIN_PAROKI: 'Admin Paroki',
    PENDATA: 'Pendata / Enumerator',
    KETUA_KBG: 'Ketua KBG',
    SUPERADMIN: 'Super Admin',
    'Admin Stasi': 'Admin Stasi',
    'Admin Paroki': 'Admin Paroki',
    'Ketua KBG': 'Ketua KBG',
  };
  return map[role] ?? role;
};

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => ({ ...prev, [title]: !prev[title] }));
  };

  let initials = "U";
  if (user?.username) {
    const nameParts = user.username.split(/[_\s]+/);
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts[0].length >= 2) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
    }
  }

  const isParoki = user?.role === 'ADMIN_PAROKI' || user?.role === 'Admin Paroki';
  const isKbg = user?.role === 'KETUA_KBG' || user?.role === 'Ketua KBG';
  
  let activeMenu: any = menuDefault;
  if (isParoki) activeMenu = menuParoki;
  else if (isKbg) activeMenu = menuKbg;
  else if (user?.role && user.role.includes('ADMIN_STASI')) activeMenu = menuStasi;
  else if (user?.role) activeMenu = menuStasi; // fallback default admin


  return (
    <div className={cn("flex flex-col h-full bg-brown-950 text-slate-300", className)}>

      {/* ── LOGO HEADER ── */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/50 shrink-0">
        <div className="flex items-center justify-center w-14 h-14 overflow-hidden">
          <img src="/logo.png" alt="Logo Simatika" className="w-12 h-12 object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white tracking-wide leading-tight">SIMATIKA</span>
          <span className="text-[11px] text-slate-400">Keuskupan Timika</span>
        </div>
      </div>
      {/* ── NAVIGATION (scrollable, grows to fill) ── */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5 min-h-0">
        <p className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Menu {isParoki ? 'Paroki' : isKbg ? 'KBG' : 'Stasi'}
        </p>
        {activeMenu.map((item: any) => {
          const hasChildren = item.children && item.children.length > 0;
          
          if (hasChildren) {
            const isOpen = openMenus[item.title];
            // Check if any child is active
            const isAnyChildActive = item.children.some((child: any) => pathname === child.href);
            
            return (
              <div key={item.title} className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "flex items-center justify-between w-full rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                    isAnyChildActive && !isOpen
                      ? "text-slate-100 bg-slate-800/40"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-4.5 w-4.5 shrink-0", isAnyChildActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                    {item.title}
                  </div>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-500" />
                  )}
                </button>
                
                {isOpen && (
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
            <Link key={item.title} href={item.href}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                  isActive
                    ? "bg-brown-600 text-white shadow-md shadow-brown-900/30"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-100"
                )}
              >
                <item.icon className={cn("h-4.5 w-4.5 shrink-0", isActive ? "text-white" : "text-slate-500 group-hover:text-slate-300")} />
                {item.title}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

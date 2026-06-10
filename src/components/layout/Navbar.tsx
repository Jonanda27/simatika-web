"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, ChevronDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NavbarProps {
  title?: string;
  onMenuClick?: () => void;
  onDesktopMenuClick?: () => void;
}

export function Navbar({ title, onMenuClick, onDesktopMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  let roleLabel = "Admin";
  if (user?.role === 'ADMIN_PAROKI' || user?.role === 'Admin Paroki') {
    roleLabel = "Admin Paroki";
  } else if (user?.role === 'ADMIN_STASI' || user?.role === 'Admin Stasi') {
    roleLabel = "Admin Stasi";
  } else if (user?.role) {
    roleLabel = user.role;
  }

  let initials = "U";
  if (user?.username) {
    const nameParts = user.username.split(/[_\s]+/);
    if (nameParts.length >= 2) {
      initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts[0].length >= 2) {
      initials = nameParts[0].substring(0, 2).toUpperCase();
    }
  }

  const handleLogout = () => {
    setLogoutModalOpen(false);
    logout();
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white dark:bg-slate-950 px-4 lg:px-8">
      {/* Left section: Hamburger + Titles */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 md:hidden text-slate-600"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 hidden md:flex text-slate-600"
          onClick={onDesktopMenuClick}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
        
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title || "Dashboard Admin SIMATIKA"}
          </h1>
        </div>
      </div>

      {/* Right section: DatePicker & Notification */}
      <div className="flex items-center gap-4">


        {/* Notification Bell */}
        <Button variant="outline" size="icon" className="relative text-slate-600 dark:text-slate-300 shadow-sm h-9 w-9 rounded-md hidden sm:flex">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
            5
          </span>
          <span className="sr-only">Notifikasi</span>
        </Button>

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
          <div className="flex flex-col items-end hidden sm:flex">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-tight">
              {user?.username || 'Guest'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {roleLabel}
            </p>
          </div>
          
          <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700 shrink-0">
            <AvatarFallback className="bg-brown-600 text-white font-bold text-sm">
              {initials}
            </AvatarFallback>
          </Avatar>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLogoutModalOpen(true)}
            title="Keluar"
            className="text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Dialog open={logoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <DialogContent className="sm:max-w-[400px] p-6">
          <div className="flex flex-col items-center justify-center gap-3 py-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-2">
              <LogOut className="h-8 w-8 text-red-600 dark:text-red-500" />
            </div>
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle className="text-xl">Konfirmasi Keluar</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Apakah Anda yakin ingin keluar dari aplikasi SIMATIKA? Sesi Anda akan diakhiri.
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="flex w-full sm:justify-between gap-3 mt-2">
            <Button variant="outline" className="flex-1" onClick={() => setLogoutModalOpen(false)}>Batal</Button>
            <Button variant="destructive" className="flex-1" onClick={handleLogout}>Ya, Keluar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}

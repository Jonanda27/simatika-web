"use client";

import { useState, useEffect } from "react";
import { Sidebar, menuParoki, menuAdminGereja, menuKbg, menuStasi, menuDefault } from "./Sidebar";
import { Navbar } from "./Navbar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(true);
  const pathname = usePathname();
  const isMapPage = pathname === "/peta-umat";
  
  const [derivedTitle, setDerivedTitle] = useState(title || "Dashboard Admin SIMATIKA");

  useEffect(() => {
    if (pathname !== "/dashboard") {
      setDerivedTitle("");
      return;
    }

    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        const role = user?.role;
        
        if (role === 'ADMIN_PAROKI' || role === 'Admin Paroki') {
          setDerivedTitle("Dashboard Paroki");
        } else if (role === 'ADMIN_GEREJA') {
          setDerivedTitle("Dashboard Admin Gereja");
        } else if (role === 'KETUA_KBG' || role === 'Ketua KBG') {
          setDerivedTitle("Dashboard KBG");
        } else if (role && role.includes('ADMIN_STASI')) {
          setDerivedTitle("Dashboard Stasi");
        } else {
          setDerivedTitle("Dashboard Admin SIMATIKA");
        }
      }
    } catch (e) {
      setDerivedTitle("Dashboard Admin SIMATIKA");
    }
  }, [pathname, title]);

  return (
    <div className="flex min-h-screen w-full bg-[#fafafa] dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden md:block transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
          isDesktopMenuOpen ? "w-[220px] lg:w-[280px]" : "w-[72px]"
        )}
      >
        <Sidebar className="w-full h-full" isCollapsed={!isDesktopMenuOpen} />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px] sm:w-[300px]">
          <SheetTitle className="sr-only">Menu Navigasi</SheetTitle>
          <Sidebar className="w-full h-full border-none" />
        </SheetContent>
      </Sheet>

      <div className="flex flex-col flex-1 h-screen overflow-hidden min-w-0">
        {/* Navbar */}
        <Navbar 
          title={derivedTitle} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          onDesktopMenuClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
        />
        
        {/* Main Content Area */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-[#fafafa] dark:bg-slate-950",
          isMapPage ? "p-0" : "p-4 lg:p-6"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}


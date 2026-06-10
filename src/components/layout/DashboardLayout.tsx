"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
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

  return (
    <div className="flex min-h-screen w-full bg-slate-100 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <div 
        className={cn(
          "hidden md:block transition-all duration-300 ease-in-out shrink-0 overflow-hidden",
          isDesktopMenuOpen ? "w-[220px] lg:w-[280px]" : "w-0"
        )}
      >
        <Sidebar className="w-[220px] lg:w-[280px] h-full" />
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
          title={title} 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          onDesktopMenuClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
        />
        
        {/* Main Content Area */}
        <main className={cn(
          "flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950",
          isMapPage ? "p-0" : "p-4 lg:p-6"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

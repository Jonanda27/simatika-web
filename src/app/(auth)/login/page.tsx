"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { authService } from "@/services/auth.service";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString().trim() || "";
    const password = formData.get("password")?.toString() || "";

    setIsLoading(true);
    setHasError(false);

    try {
      const data = await authService.login({ username, password });
      if (data.success && data.token && data.user) {
        login(data.token, data.user);
        router.push("/dashboard");
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error("Login failed:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-100 relative overflow-hidden font-sans">
      {/* Immersive Blurred Background */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/church_bg.png" 
          alt="Background" 
          fill
          className="object-cover scale-110 filter blur-[40px] opacity-40"
          quality={1}
          priority
        />
        <div className="absolute inset-0 bg-[#0b132b]/5 mix-blend-multiply"></div>
      </div>

      {/* Main Floating Modal Container */}
      <div className="relative z-10 w-full max-w-[1040px] h-[640px] flex rounded-[2.5rem] overflow-hidden shadow-[0_24px_80px_rgba(11,19,43,0.15)] bg-white mx-6">
        
        {/* Left Side: Pure Minimalist Form */}
        <div className="w-full lg:w-1/2 p-12 sm:p-16 flex flex-col justify-between bg-white relative">
          <div>
            {/* Branding Header */}
            <div className="flex items-center gap-3.5 mb-14">
              <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-sm">
                 <Image src="/logo.png" alt="Logo" fill className="object-contain drop-shadow-sm" priority />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">SIMATIKA</span>
                <span className="text-[10px] font-bold text-brown-600 uppercase tracking-widest mt-0.5">Keuskupan Timika</span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">Selamat Datang</h1>
              <p className="text-sm text-slate-500 font-medium">Masuk untuk mengelola data pastoral dan umat.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Username</label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Masukkan username Anda"
                    required
                    className={`h-12 px-4 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-brown-500/20 focus:border-brown-500 transition-all rounded-xl text-[15px] font-medium placeholder:text-slate-400 ${hasError ? "border-red-500 focus:ring-red-500/20" : ""}`}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Kata Sandi</label>
                    <a href="#" className="text-xs font-bold text-brown-600 hover:text-brown-800 transition-colors">Lupa sandi?</a>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      required
                      className={`h-12 px-4 pr-12 bg-slate-50/50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-brown-500/20 focus:border-brown-500 transition-all rounded-xl text-[15px] font-medium placeholder:text-slate-400 ${hasError ? "border-red-500 focus:ring-red-500/20" : ""}`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {hasError && <p className="text-xs font-bold text-red-500 mt-1.5">Username atau kata sandi tidak valid.</p>}
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1">
                <Checkbox id="remember" className="rounded-[4px] border-slate-300 text-brown-600 data-[state=checked]:bg-brown-600 data-[state=checked]:border-brown-600" />
                <label htmlFor="remember" className="text-sm font-medium text-slate-600 cursor-pointer select-none">
                  Tetap masuk
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 mt-2 bg-brown-600 hover:bg-brown-700 active:bg-brown-800 text-white rounded-xl text-[15px] font-bold shadow-lg shadow-brown-600/25 transition-all duration-300 hover:translate-y-[-2px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi...</span>
                  </div>
                ) : (
                  "Masuk ke Dasbor"
                )}
              </Button>
            </form>
          </div>

          <p className="text-xs text-slate-400 font-medium text-center">
            &copy; {new Date().getFullYear()} Paroki St. Stefanus Sempan.
          </p>
        </div>

        {/* Right Side: High-End Imagery */}
        <div className="hidden lg:block w-1/2 relative bg-[#0b132b]">
          <Image 
            src="/church_bg.png" 
            alt="Church" 
            fill
            className="object-cover opacity-60 mix-blend-luminosity"
            priority
          />
          {/* Deep complex gradient overlay for premium feel */}
          <div className="absolute inset-0 bg-gradient-to-br from-brown-600/40 via-[#0b132b]/80 to-[#0b132b]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b] via-transparent to-transparent opacity-80"></div>
          
          <div className="absolute inset-0 p-16 flex flex-col justify-end text-white">
            <div className="mb-8 w-12 h-1.5 bg-brown-500 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"></div>
            <h3 className="text-[2.5rem] font-bold mb-5 leading-[1.1] tracking-tight text-white drop-shadow-md">
              Membangun Paroki <br/>
              <span className="text-brown-300">Yang Terhubung.</span>
            </h3>
            <p className="text-brown-100/90 text-[15px] leading-relaxed max-w-sm font-medium drop-shadow">
              Platform modern dan terintegrasi untuk mempermudah administrasi sakramental, mutasi umat, dan tata kelola pastoral.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

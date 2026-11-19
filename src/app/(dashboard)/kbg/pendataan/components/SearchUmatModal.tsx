import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, GitBranch, User } from "lucide-react";
import { umatService } from "@/services/umat.service";
import { UmatData } from "@/types/umat";

interface SearchUmatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUmat: (umat: UmatData) => void;
}

export function SearchUmatModal({ open, onOpenChange, onSelectUmat }: SearchUmatModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<UmatData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setResults([]);
    }
  }, [open]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    try {
      const res = await umatService.getAll({ search: searchQuery, limit: 10 });
      if (res.success) {
        setResults(res.data);
      }
    } catch (error) {
      console.error("Failed to search umat", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-none border-0 shadow-2xl">
        <div className="bg-gradient-to-r from-brown-900 to-slate-900 px-6 py-5 flex items-center gap-4">
          <div className="p-3 bg-white/10 rounded-none text-white backdrop-blur-sm border border-white/10">
            <GitBranch className="h-6 w-6" />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold text-white">Pecah Kartu Keluarga</DialogTitle>
            <DialogDescription className="text-brown-100 text-sm mt-1">
              Cari data umat yang akan dibuatkan Kartu Keluarga baru.
            </DialogDescription>
          </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1 gap-6 bg-slate-50">
          <div className="relative flex gap-3 items-center">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-brown-600 transition-colors" />
              <Input 
                placeholder="Ketikkan nama umat..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-11 h-12 bg-white rounded-none border-slate-200 focus:border-brown-500 focus:ring-4 focus:ring-brown-500/10 text-[15px]"
              />
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isLoading || !searchQuery.trim()} 
              className="bg-brown-600 hover:bg-brown-700 text-white h-12 px-6 rounded-none font-semibold transition-all hover:-translate-y-0.5 active:scale-95"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Cari"}
            </Button>
          </div>

          <div className="overflow-y-auto flex-1 bg-white border border-slate-200/80 rounded-none min-h-[300px]">
            {results.length === 0 && !isLoading && (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
                <div className="w-16 h-16 bg-slate-50 flex items-center justify-center rounded-none mb-4 border border-slate-100">
                  <Search className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-medium text-slate-600">Belum ada hasil</p>
                <p className="text-sm mt-1">
                  {searchQuery ? "Umat tidak ditemukan dengan nama tersebut." : "Gunakan kolom pencarian di atas untuk mulai mencari."}
                </p>
              </div>
            )}

            {results.length > 0 && (
              <div className="divide-y divide-slate-100">
                {results.map((umat) => (
                  <div 
                    key={umat.id} 
                    className="p-4 hover:bg-brown-50/50 flex justify-between items-center transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 flex items-center justify-center rounded-none text-slate-500 group-hover:bg-brown-100 group-hover:text-brown-600 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-[15px]">{umat.nama_lengkap}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                          {umat.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} &bull; No. KK: {umat.Family?.no_kk_paroki || 'Belum Terdaftar'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-brown-200 text-brown-700 hover:bg-brown-600 hover:text-white rounded-none transition-colors px-6"
                      onClick={() => {
                        onSelectUmat(umat);
                        onOpenChange(false);
                      }}
                    >
                      Pilih
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


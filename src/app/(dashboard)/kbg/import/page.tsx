"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2, Send, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { useDrafts } from "@/hooks/useDrafts";

interface ImportedRow {
  no_kk_paroki: string;
  status_numpang: string;
  nama_lengkap: string;
  nik: string;
  jenis_kelamin: string;
  tempat_lahir: string;
  tanggal_lahir: string;
  status_keluarga: string;
  [key: string]: string | undefined;
}

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dataPreview, setDataPreview] = useState<ImportedRow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { saveManyDrafts } = useDrafts();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUploadStatus("idle");

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

        // Normalize columns (convert everything to string just to be safe and trim spaces)
        const formattedData: ImportedRow[] = data.map((row) => ({
          no_kk_paroki: String(row["NO_KK_PAROKI"] || ""),
          status_numpang: String(row["STATUS_TINGGAL"] || "Keluarga Utama"),
          nama_lengkap: String(row["NAMA_LENGKAP"] || ""),
          nik: String(row["NIK"] || ""),
          jenis_kelamin: String(row["JENIS_KELAMIN"] || "L"),
          tempat_lahir: String(row["TEMPAT_LAHIR"] || ""),
          tanggal_lahir: String(row["TANGGAL_LAHIR"] || ""),
          status_keluarga: String(row["STATUS_KELUARGA"] || "Kepala Keluarga"),
        })).filter(row => row.no_kk_paroki && row.nama_lengkap); // Filter out completely empty rows

        setDataPreview(formattedData);
      } catch (err) {
        console.error("Gagal membaca file Excel:", err);
        setUploadStatus("error");
      }
    };
    reader.readAsBinaryString(selectedFile);
  };

  const handleClear = () => {
    setFile(null);
    setDataPreview([]);
    setUploadStatus("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      {
        "NO_KK_PAROKI": "1234567890",
        "STATUS_TINGGAL": "Keluarga Utama",
        "NAMA_LENGKAP": "Budi Santoso",
        "NIK": "3201234567890001",
        "JENIS_KELAMIN": "L",
        "TEMPAT_LAHIR": "Timika",
        "TANGGAL_LAHIR": "1980-05-15",
        "STATUS_KELUARGA": "Kepala Keluarga"
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template_Umat");
    XLSX.writeFile(wb, "Template_Import_Data_Umat.xlsx");
  };

  const handleSaveToDraft = () => {
    if (dataPreview.length === 0) return;
    setIsUploading(true);

    try {
      // Create a grouped structure based on NO_KK_PAROKI
      const families: Record<string, import("@/types/family").FamilyFormData> = {};

      dataPreview.forEach(row => {
        const kk = row.no_kk_paroki;
        if (!families[kk]) {
          families[kk] = {
            no_kk_paroki: kk,
            status_numpang: row.status_numpang,
            lat: null,
            lng: null,
            foto_rumah_path: null,
            foto_rumah_file: null,
            fasilitas_kamar_mandi: false,
            fasilitas_kamar_cuci: false,
            fasilitas_wc: false,
            status_rumah: "",
            pendapatan_per_bulan: "",
            asuransi_kesehatan: "",
            members: []
          };
        }
        
        families[kk].members.push({
          nama_lengkap: row.nama_lengkap,
          nik: row.nik,
          jenis_kelamin: row.jenis_kelamin,
          tempat_lahir: row.tempat_lahir,
          tanggal_lahir: row.tanggal_lahir,
          status_keluarga: row.status_keluarga
        });
      });

      const newDrafts = Object.values(families).map((f) => ({
        id: "draft-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9),
        data: f,
        createdAt: new Date().toISOString()
      }));

      saveManyDrafts(newDrafts);

      setUploadStatus("success");
      setFile(null);
      setDataPreview([]);
    } catch (error) {
      console.error(error);
      setUploadStatus("error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-8 bg-slate-50 min-h-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Import Data Massal
          </h1>
          <p className="text-slate-500 mt-1">
            Unggah file Excel untuk mendata umat secara langsung.
          </p>
        </div>
        <Button 
          onClick={handleDownloadTemplate}
          variant="outline" 
          className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Template
        </Button>
      </div>

      {uploadStatus === "success" && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-start gap-3">
          <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
          <div>
            <h3 className="font-bold text-green-800">Berhasil Disimpan ke Draft!</h3>
            <p className="text-sm text-green-700 mt-1">
              Data berhasil diimpor dan disimpan di Draft Lokal. Anda bisa melengkapinya sebelum dikirim.
            </p>
          </div>
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 shrink-0" />
          <div>
            <h3 className="font-bold text-red-800">Gagal Membaca File</h3>
            <p className="text-sm text-red-700 mt-1">
              Pastikan file yang diunggah sesuai dengan template (Excel/CSV).
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: UPLOAD */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 ring-1 ring-slate-900/5">
            <h2 className="font-bold text-lg text-slate-800 mb-4">Area Unggah File</h2>
            
            <input 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />

            {!file ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer group"
              >
                <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-8 w-8 text-blue-500" />
                </div>
                <p className="font-semibold text-slate-700 mb-1">Klik untuk memilih file</p>
                <p className="text-xs text-slate-500">Mendukung .xlsx, .xls, atau .csv</p>
              </div>
            ) : (
              <div className="border border-blue-200 bg-blue-50 rounded-xl p-6 relative">
                <button 
                  onClick={handleClear}
                  className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm">
                    <FileSpreadsheet className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 truncate max-w-[150px]">{file.name}</h3>
                    <p className="text-xs font-medium text-blue-600">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleSaveToDraft}
                  disabled={isUploading || dataPreview.length === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 shadow-md"
                >
                  {isUploading ? (
                    <span className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Memproses...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="h-4 w-4 mr-2" />
                      Simpan {dataPreview.length} Baris ke Draft
                    </span>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: PREVIEW */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[400px] ring-1 ring-slate-900/5">
            <h2 className="font-bold text-lg text-slate-800 mb-6 flex items-center justify-between">
              Pratinjau Data (Preview)
              {dataPreview.length > 0 && (
                <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                  Total: {dataPreview.length} baris
                </span>
              )}
            </h2>

            {dataPreview.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-64 text-slate-400">
                <FileSpreadsheet className="h-12 w-12 mb-3 opacity-20" />
                <p>Belum ada data untuk ditampilkan.<br/>Unggah file di samping terlebih dahulu.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm text-slate-500">
                      <th className="pb-3 font-semibold">No. KK</th>
                      <th className="pb-3 font-semibold">Nama Lengkap</th>
                      <th className="pb-3 font-semibold">Status Keluarga</th>
                      <th className="pb-3 font-semibold">L/P</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {dataPreview.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 text-slate-600 font-medium">{row.no_kk_paroki}</td>
                        <td className="py-3 text-slate-800 font-semibold">{row.nama_lengkap}</td>
                        <td className="py-3 text-slate-600">{row.status_keluarga}</td>
                        <td className="py-3 text-slate-600">{row.jenis_kelamin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {dataPreview.length > 10 && (
                  <div className="mt-4 text-center text-sm font-semibold text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    ... dan {dataPreview.length - 10} baris lainnya
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

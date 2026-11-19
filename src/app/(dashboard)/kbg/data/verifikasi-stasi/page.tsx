import { StatusDataView } from "../components/StatusDataView";

export const metadata = {
  title: "Verifikasi Stasi - Simatika KBG",
};

export default function VerifikasiStasiPage() {
  return (
    <div className="p-4 sm:p-8 min-h-full">
      <StatusDataView 
        statusFilter="VERIFIED_STASI" 
        title="Telah Diverifikasi Stasi" 
        description="Data yang telah disetujui oleh admin Stasi dan diteruskan ke Paroki."
      />
    </div>
  );
}


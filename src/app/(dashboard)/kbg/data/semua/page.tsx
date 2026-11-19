import { StatusDataView } from "../components/StatusDataView";

export const metadata = {
  title: "Semua Data - Simatika KBG",
};

export default function SemuaDataPage() {
  return (
    <div className="p-4 sm:p-8 min-h-full">
      <StatusDataView 
        statusFilter="ALL" 
        title="Semua Data" 
        description="Daftar seluruh riwayat pengiriman data Anda beserta status terkininya."
      />
    </div>
  );
}


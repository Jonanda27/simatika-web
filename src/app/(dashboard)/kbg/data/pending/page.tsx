import { StatusDataView } from "../components/StatusDataView";

export const metadata = {
  title: "Pending - Simatika KBG",
};

export default function PendingDataPage() {
  return (
    <div className="p-4 sm:p-8 min-h-full">
      <StatusDataView 
        statusFilter="PENDING" 
        title="Menunggu Verifikasi Stasi" 
        description="Data yang masih dalam antrean untuk diverifikasi oleh admin Stasi."
      />
    </div>
  );
}


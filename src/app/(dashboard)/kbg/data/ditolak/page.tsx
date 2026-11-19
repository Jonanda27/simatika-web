import { StatusDataView } from "../components/StatusDataView";

export const metadata = {
  title: "Ditolak - Simatika KBG",
};

export default function DitolakDataPage() {
  return (
    <div className="p-4 sm:p-8 min-h-full">
      <StatusDataView 
        statusFilter="REJECTED" 
        title="Data Ditolak" 
        description="Data yang ditolak oleh Stasi atau Paroki. Silakan lihat detail untuk mengetahui alasan penolakan dan perbaiki data Anda."
      />
    </div>
  );
}


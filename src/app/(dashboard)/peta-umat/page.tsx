import { keluargaService } from "@/services/keluarga.service";
import MapClientWrapper from "@/components/features/peta/MapClientWrapper";

export default async function PetaUmatPage() {
  // Fetch families with a high limit to get all coordinates
  // Note: For a very large parish (e.g. > 10,000 families), a specific GIS endpoint without joins might be better
  const response = await keluargaService.getAll({ limit: 5000 });
  const data = response.success ? response.data : [];

  // Filter out families without valid coordinates to show correct counts
  const validData = data.filter(item => item.latitude !== null && item.longitude !== null);

  return (
    <div className="w-full h-[calc(100vh-64px)]">
      {/* Render MapComponent passing the family data */}
      <MapClientWrapper data={data} />
    </div>
  );
}

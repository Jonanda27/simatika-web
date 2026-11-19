import dynamic from "next/dynamic";

const LocationPicker = dynamic(
  () => import("./LocationPickerMap"),
  { ssr: false, loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 text-sm">Memuat Peta...</div> }
);

export default LocationPicker;

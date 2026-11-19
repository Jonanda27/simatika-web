export interface DashboardStats {
  kpi: {
    totalUmat: number;
    totalKeluarga: number;
    sakramenBaptis: number;
    sakramenNikah: number;
  };
  komposisiUmur: {
    name: string;
    value: number;
    color: string;
  }[];
  grafikUmat: {
    name: string;
    umat: number;
  }[];
  statistikMutasi: {
    name: string;
    value: number;
    color: string;
  }[];
  keaktifanPastoral: {
    name: string;
    value: number;
    color: string;
  }[];
  petaSebaran: {
    id: string;
    name: string;
    lat: number;
    lng: number;
    is_family?: boolean;
    has_stasi?: boolean;
  }[];
}

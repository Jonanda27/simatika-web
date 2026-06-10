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
}

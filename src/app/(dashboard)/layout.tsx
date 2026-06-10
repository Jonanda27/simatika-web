import { DashboardLayout } from "@/components/layout/DashboardLayout";
import RequireAuth from "@/components/auth/RequireAuth";

export default function AppDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAuth>
      <DashboardLayout title="Dasbor Utama">
        {children}
      </DashboardLayout>
    </RequireAuth>
  );
}

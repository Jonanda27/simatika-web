// src/app/peta-pastoral/layout.tsx
import RequireAuth from "@/components/auth/RequireAuth";

export default function PetaPastoralLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        // Tetap lindungi rute ini agar hanya user yang login yang bisa akses
        <RequireAuth>
            {/* Container utama yang mematikan segala jenis scrollbar bawaan browser */}
            <div className="w-full h-screen overflow-hidden m-0 p-0 bg-slate-950">
                {children}
            </div>
        </RequireAuth>
    );
}
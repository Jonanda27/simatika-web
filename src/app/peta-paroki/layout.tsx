// src/app/peta-paroki/layout.tsx
import RequireAuth from "@/components/auth/RequireAuth";

export default function PetaParokiLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RequireAuth>
            <div className="w-full h-screen overflow-hidden m-0 p-0 bg-slate-950">
                {children}
            </div>
        </RequireAuth>
    );
}

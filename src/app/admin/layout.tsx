import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { authOptions } from "@/lib/auth-options";

// FR-22: akses modul admin dibatasi melalui role-based access control.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex h-dvh overflow-hidden bg-muted/30">
      <div className="hidden md:block">
        <AdminSidebar />
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b bg-background px-4 md:justify-end md:px-6">
          <AdminMobileNav />
          <div className="text-right">
            <p className="text-sm font-semibold">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto max-w-6xl space-y-6 p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

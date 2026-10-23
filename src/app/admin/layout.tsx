import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { authOptions } from "@/lib/auth-options";

// FR-22: akses modul admin dibatasi melalui role-based access control.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  return (
    <div className="flex min-h-dvh bg-muted/30">
      <AdminSidebar />
      <div className="flex-1">
        <header className="flex h-16 items-center justify-end gap-3 border-b bg-background px-6">
          <div className="text-right">
            <p className="text-sm font-semibold">{session.user.name}</p>
            <p className="text-xs text-muted-foreground">Admin</p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl space-y-6 p-6">{children}</main>
      </div>
    </div>
  );
}

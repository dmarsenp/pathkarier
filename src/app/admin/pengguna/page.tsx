import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { PenggunaTable, type PenggunaRow } from "@/features/admin/pengguna/pengguna-table";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin · Manajemen Admin" };

export default async function AdminPenggunaPage() {
  const session = await getServerSession(authOptions);
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const rows: PenggunaRow[] = users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Admin</h1>
        <p className="text-sm text-muted-foreground">Atur siapa saja yang punya akses modul admin (FR-22).</p>
      </div>
      <PenggunaTable users={rows} currentUserId={session?.user?.id ?? ""} />
    </div>
  );
}

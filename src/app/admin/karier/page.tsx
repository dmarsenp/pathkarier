import type { Metadata } from "next";
import { KarierTable, type KarierRow } from "@/features/admin/karier/karier-table";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin · Manajemen Karier" };

export default async function AdminKarierPage() {
  const careers = await prisma.career.findMany({
    orderBy: { nama: "asc" },
    include: { _count: { select: { skills: true } } },
  });

  const rows: KarierRow[] = careers.map((c) => ({
    id: c.id,
    nama: c.nama,
    ringkas: c.ringkas,
    deskripsi: c.deskripsi,
    tanggungJawab: c.tanggungJawab as string[],
    profilR: c.profilR,
    profilI: c.profilI,
    profilA: c.profilA,
    profilS: c.profilS,
    profilE: c.profilE,
    profilC: c.profilC,
    skillCount: c._count.skills,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Karier</h1>
        <p className="text-sm text-muted-foreground">Kelola 5 karier TI beserta profil RIASEC-nya (FR-18).</p>
      </div>
      <KarierTable careers={rows} />
    </div>
  );
}

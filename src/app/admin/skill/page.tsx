import type { Metadata } from "next";
import { SkillTable, type SkillRow } from "@/features/admin/skill/skill-table";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin · Manajemen Skill" };

export default async function AdminSkillPage() {
  const skills = await prisma.skill.findMany({
    orderBy: { nama: "asc" },
    include: { _count: { select: { careers: true, users: true } } },
  });

  const rows: SkillRow[] = skills.map((s) => ({
    id: s.id,
    nama: s.nama,
    careerCount: s._count.careers,
    userCount: s._count.users,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Manajemen Skill</h1>
        <p className="text-sm text-muted-foreground">Kelola master data skill yang bisa dipilih pengguna (FR-19).</p>
      </div>
      <SkillTable skills={rows} />
    </div>
  );
}

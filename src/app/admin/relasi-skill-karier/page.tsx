import type { Metadata } from "next";
import { RelasiTable, type RelasiRow } from "@/features/admin/relasi/relasi-table";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin · Relasi Skill-Karier" };

export default async function AdminRelasiPage() {
  const [relations, careers, skills] = await Promise.all([
    prisma.careerSkill.findMany({
      include: { career: { select: { id: true, nama: true } }, skill: { select: { id: true, nama: true } } },
      orderBy: [{ career: { nama: "asc" } }, { bobot: "desc" }],
    }),
    prisma.career.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
    prisma.skill.findMany({ select: { id: true, nama: true }, orderBy: { nama: "asc" } }),
  ]);

  const rows: RelasiRow[] = relations.map((r) => ({
    careerId: r.careerId,
    careerNama: r.career.nama,
    skillId: r.skillId,
    skillNama: r.skill.nama,
    bobot: r.bobot,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Relasi Skill-Karier</h1>
        <p className="text-sm text-muted-foreground">Atur skill apa saja yang relevan untuk tiap karier beserta bobotnya (FR-19).</p>
      </div>
      <RelasiTable relations={rows} careers={careers} skills={skills} />
    </div>
  );
}

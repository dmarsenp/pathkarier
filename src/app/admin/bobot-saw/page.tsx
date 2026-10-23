import type { Metadata } from "next";
import { BobotForm } from "@/features/admin/bobot/bobot-form";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Admin · Bobot SAW" };

export default async function AdminBobotPage() {
  const weight = await prisma.criteriaWeight.findUnique({ where: { id: 1 } });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Bobot SAW</h1>
        <p className="text-sm text-muted-foreground">
          Bobot kriteria metode Simple Additive Weighting (FR-20). Default hasil survei 15 praktisi (Subbab 3.2.2): minat 45%, skill
          55%.
        </p>
      </div>
      <BobotForm initialMinat={weight?.minat ?? 0.45} initialSkill={weight?.skill ?? 0.55} />
    </div>
  );
}

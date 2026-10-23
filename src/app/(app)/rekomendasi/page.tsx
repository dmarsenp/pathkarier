import type { Metadata } from "next";
import { JourneySteps } from "@/components/layout/journey-steps";
import { PageHeader } from "@/components/layout/page-header";
import { RecommendationList } from "@/features/rekomendasi/recommendation-list";
import { ScoringInfo } from "@/features/rekomendasi/scoring-info";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Rekomendasi karier" };

export default async function RekomendasiPage() {
  const weight = await prisma.criteriaWeight.findUnique({ where: { id: 1 } });
  const bobotMinat = weight?.minat ?? 0.45;
  const bobotSkill = weight?.skill ?? 0.55;

  return (
    <div className="space-y-8">
      <JourneySteps current={3} />
      <PageHeader
        eyebrow="Langkah 4 dari 4"
        title="Karier TI yang paling cocok untukmu"
        description="Diurutkan dari skor tertinggi berdasarkan profil minat dan skill-mu. Buka detail untuk memilih jalur utama, atau tambahkan jalur lain sebagai alternatif."
      />
      <ScoringInfo bobotMinat={bobotMinat} bobotSkill={bobotSkill} />
      <RecommendationList />
    </div>
  );
}

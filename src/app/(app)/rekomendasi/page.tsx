import type { Metadata } from "next";
import { JourneySteps } from "@/components/layout/journey-steps";
import { PageHeader } from "@/components/layout/page-header";
import { getCareer } from "@/constants/careers";
import { MOCK_RECOMMENDATIONS, MOCK_WEIGHTS } from "@/constants/mock";
import { PlanBadge } from "@/features/jalur/plan-badge";
import { CareerRankCard } from "@/features/rekomendasi/career-rank-card";
import { ScoringInfo } from "@/features/rekomendasi/scoring-info";

export const metadata: Metadata = { title: "Rekomendasi karier" };

export default function RekomendasiPage() {
  // TODO: GET /api/rekomendasi. Arahkan ke /asesmen/pengantar atau /skill bila datanya belum lengkap (SPEC 4.2).
  return (
    <div className="space-y-8">
      <JourneySteps current={3} />
      <PageHeader
        eyebrow="Langkah 4 dari 4"
        title="Karier TI yang paling cocok untukmu"
        description="Diurutkan dari skor tertinggi berdasarkan profil minat dan skill-mu. Buka detail untuk memilih jalur utama, atau tambahkan jalur lain sebagai alternatif."
      />
      <ScoringInfo bobotMinat={MOCK_WEIGHTS.minat} bobotSkill={MOCK_WEIGHTS.skill} />
      <ol className="space-y-4">
        {MOCK_RECOMMENDATIONS.map((result) => {
          const career = getCareer(result.idKarier);
          if (!career) return null;
          return (
            <li key={result.idKarier}>
              <CareerRankCard career={career} result={result} badge={<PlanBadge idKarier={career.id} />} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

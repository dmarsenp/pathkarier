import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CAREERS, getCareer } from "@/constants/careers";
import { MOCK_RECOMMENDATIONS, MOCK_RIASEC, MOCK_USER_SKILLS, MOCK_WEIGHTS } from "@/constants/mock";
import { SavePlanButton } from "@/features/jalur/save-plan-button";
import { CareerHero } from "@/features/rekomendasi/career-hero";
import { MatchReasonCard } from "@/features/rekomendasi/match-reason-card";
import { RoadmapPanel } from "@/features/rekomendasi/roadmap-panel";
import { SkillGapCard } from "@/features/rekomendasi/skill-gap-card";
import { ResourceExplorer } from "@/features/sumber-belajar/resource-explorer";
import { skillGaps } from "@/lib/engine/readiness";
import { topContributors } from "@/lib/engine/riasec";
import { buildMockRoadmap } from "@/lib/mock-roadmap";
import { resourcesForCareer } from "@/lib/resources";

interface DetailPageProps {
  params: { idKarier: string };
}

export function generateStaticParams(): { idKarier: string }[] {
  return CAREERS.map((career) => ({ idKarier: career.id }));
}

export function generateMetadata({ params }: DetailPageProps): Metadata {
  return { title: getCareer(params.idKarier)?.nama ?? "Detail karier" };
}

export default function RekomendasiDetailPage({ params }: DetailPageProps) {
  // TODO: GET /api/rekomendasi/{idKarier}/detail. Bagian deterministik ini selalu tampil (FR-13).
  const career = getCareer(params.idKarier);
  const result = MOCK_RECOMMENDATIONS.find((r) => r.idKarier === params.idKarier);
  if (!career || !result) notFound();

  const gaps = skillGaps(career.skills, MOCK_USER_SKILLS);
  const dims = topContributors(MOCK_RIASEC, career.profil);
  const roadmap = buildMockRoadmap(career.nama, gaps);
  const saveButton = (
    <SavePlanButton idKarier={career.id} careerName={career.nama} skorSaw={result.skorSaw} roadmap={roadmap.roadmap} />
  );

  return (
    <div className="space-y-6">
      <CareerHero career={career} result={result} actions={saveButton} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MatchReasonCard careerName={career.nama} dims={dims} result={result} bobot={MOCK_WEIGHTS} />
        <SkillGapCard gaps={gaps} />
      </div>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Tanggung jawab utama</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-3 sm:grid-cols-2">
            {career.tanggungJawab.map((item) => (
              <li key={item} className="flex gap-3 text-sm">
                <CheckCircle2 className="size-5 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <RoadmapPanel careerName={career.nama} roadmap={roadmap} saveAction={saveButton} />
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Kursus & sertifikasi gratis</CardTitle>
          <CardDescription>
            Sumber belajar pilihan untuk menutup skill gap-mu, dari platform lokal Indonesia maupun internasional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceExplorer items={resourcesForCareer(career, MOCK_USER_SKILLS)} />
        </CardContent>
      </Card>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SavePlanButton } from "@/features/jalur/save-plan-button";
import { CareerHero } from "@/features/rekomendasi/career-hero";
import { MatchReasonCard } from "@/features/rekomendasi/match-reason-card";
import { RecommendationBlockerCard } from "@/features/rekomendasi/recommendation-blocker";
import { RoadmapPanel } from "@/features/rekomendasi/roadmap-panel";
import { SkillGapCard } from "@/features/rekomendasi/skill-gap-card";
import { ResourceExplorer } from "@/features/sumber-belajar/resource-explorer";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/lib/prisma";
import { getCareerDetail, RecommendationPrerequisiteError } from "@/lib/recommendation";
import { resourcesForCareer } from "@/lib/resources";

interface DetailPageProps {
  params: { idKarier: string };
}

// Halaman ini personal per pengguna (sesi + data DB terkini), jadi sengaja tidak di-generate
// statis — generateMetadata membaca nama karier langsung dari DB agar selalu akurat (NFR-05).
export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const career = await prisma.career.findUnique({ where: { id: params.idKarier }, select: { nama: true } });
  return { title: career?.nama ?? "Detail karier" };
}

export default async function RekomendasiDetailPage({ params }: DetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();

  let detail;
  try {
    detail = await getCareerDetail(session.user.id, params.idKarier);
  } catch (error) {
    if (error instanceof RecommendationPrerequisiteError) {
      return <RecommendationBlockerCard reason={error.reason} />;
    }
    throw error;
  }
  if (!detail) notFound();

  const { career, result, gaps, dims, roadmap, aiGenerated, userSkills, weights } = detail;
  const saveButton = (
    <SavePlanButton idKarier={career.id} careerName={career.nama} skorSaw={result.skorSaw} roadmap={roadmap.roadmap} />
  );

  return (
    <div className="space-y-6">
      <CareerHero career={career} result={result} actions={saveButton} />
      <div className="grid gap-6 lg:grid-cols-2">
        <MatchReasonCard careerName={career.nama} dims={dims} result={result} bobot={weights} />
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
      <RoadmapPanel idKarier={career.id} careerName={career.nama} roadmap={roadmap} aiGenerated={aiGenerated} saveAction={saveButton} />
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Kursus & sertifikasi gratis</CardTitle>
          <CardDescription>
            Sumber belajar pilihan untuk menutup skill gap-mu, dari platform lokal Indonesia maupun internasional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResourceExplorer items={resourcesForCareer(career, userSkills)} />
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, Route, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RiasecRadar } from "@/components/charts/riasec-radar";
import { RIASEC_META, RIASEC_ORDER } from "@/constants/riasec";
import { useAssessment } from "@/hooks/use-assessment";
import { useCareerPlans } from "@/hooks/use-career-plans";
import { useCareers } from "@/hooks/use-careers";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useUserSkills } from "@/hooks/use-user-skills";
import { topCode } from "@/lib/engine/riasec";
import { planProgress } from "@/lib/plans";

const LEVEL_LABEL: Record<string, string> = { belum: "Belum", dasar: "Dasar", mahir: "Mahir" };

// Ringkasan hasil tes minat, skill, dan rekomendasi dalam satu tempat — pelengkap tab jalur
// di bawahnya, sesuai permintaan agar "Jalur belajar" juga memuat riwayat & statistik.
export function ProgressSummary() {
  const { result, ready: assessmentReady } = useAssessment();
  const { skills, ready: skillsReady } = useUserSkills();
  const { recommendations, ready: recommendationsReady } = useRecommendations();
  const { plans, ready: plansReady } = useCareerPlans();
  const { getCareer, ready: careersReady } = useCareers();

  const ready = assessmentReady && skillsReady && recommendationsReady && plansReady && careersReady;
  if (!ready) return <Skeleton className="h-[46rem] w-full rounded-2xl lg:h-72" />;

  const top = recommendations[0];
  const topCareer = top ? getCareer(top.idKarier) : undefined;
  const code = result ? topCode(result.scores) : [];
  const skillCounts = skills.reduce<Record<string, number>>((acc, s) => {
    acc[s.level] = (acc[s.level] ?? 0) + 1;
    return acc;
  }, {});
  const totalRoadmapSteps = plans.reduce((sum, p) => sum + planProgress(p).total, 0);
  const doneRoadmapSteps = plans.reduce((sum, p) => sum + planProgress(p).done, 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="size-4 text-primary" /> Minat (RIASEC)
          </CardTitle>
          <CardDescription>{result ? `Kode minatmu: ${code.join("")}` : "Belum ada hasil tes."}</CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <RiasecRadar
              labels={RIASEC_ORDER.map((d) => RIASEC_META[d].nama)}
              values={RIASEC_ORDER.map((d) => result.scores[d])}
              config={{ max: 5, seriesLabel: "Skor" }}
            />
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/asesmen/pengantar">
                Mulai tes minat <ArrowRight />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="size-4 text-primary" /> Skill
          </CardTitle>
          <CardDescription>{skills.length > 0 ? `${skills.length} skill tercatat` : "Belum ada skill diisi."}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(skillCounts).map(([level, count]) => (
                <Badge key={level} variant="secondary" className="rounded-full">
                  {LEVEL_LABEL[level] ?? level}: {count}
                </Badge>
              ))}
            </div>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/skill">
                Isi skill <ArrowRight />
              </Link>
            </Button>
          )}
          <p className="text-xs text-muted-foreground">
            {totalRoadmapSteps > 0
              ? `Progres roadmap: ${doneRoadmapSteps}/${totalRoadmapSteps} langkah selesai.`
              : "Roadmap belajar akan muncul setelah kamu menyimpan jalur karier."}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Route className="size-4 text-primary" /> Rekomendasi teratas
          </CardTitle>
          <CardDescription>
            {topCareer ? `Skor kecocokan ${Math.round(top!.skorSaw * 100)}%` : "Lengkapi tes minat & skill untuk melihat rekomendasi."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topCareer ? (
            <Button asChild size="sm" variant="outline">
              <Link href={`/rekomendasi/${topCareer.id}`}>
                {topCareer.nama} <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/rekomendasi">
                Lihat rekomendasi <ArrowRight />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

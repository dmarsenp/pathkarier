import Link from "next/link";
import { ArrowRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { planProgress } from "@/lib/plans";
import type { Career, CareerPlan } from "@/types";

interface PrimaryPlanCardProps {
  plan: CareerPlan;
  career: Career;
}

export function PrimaryPlanCard({ plan, career }: PrimaryPlanCardProps) {
  const progress = planProgress(plan);

  return (
    <Card className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground md:p-8">
      <div className="absolute -right-16 -top-16 size-56 rounded-full bg-white/10" aria-hidden />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="flex items-center gap-2 text-sm font-medium text-primary-foreground/85">
            <Flag className="size-4" /> Jalur utama yang kamu tekuni
          </p>
          <h2 className="text-3xl font-bold">{career.nama}</h2>
          {progress.nextStep ? (
            <p className="max-w-md text-primary-foreground/85">
              Langkah berikutnya: <span className="font-semibold text-white">{progress.nextStep.skill}</span> · sekitar{" "}
              {progress.remainingWeeks} minggu lagi untuk menuntaskan roadmap.
            </p>
          ) : (
            <p className="max-w-md text-primary-foreground/85">Roadmap selesai! Perbarui skill-mu untuk melihat skor terbaru.</p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Button asChild variant="secondary">
              <Link href={`/jalur?karier=${career.id}`}>
                Lanjut belajar <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="ghost" className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground">
              <Link href={`/rekomendasi/${career.id}`}>Detail karier</Link>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-4 self-start rounded-2xl bg-card p-3 text-foreground sm:self-center">
          <ScoreRing value={progress.percent} label="selesai" />
          <div className="pr-2 text-sm">
            <p className="text-2xl font-bold">
              {progress.done}/{progress.total}
            </p>
            <p className="text-muted-foreground">langkah roadmap</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ScoreRing } from "@/components/ui/score-ring";
import { toPercent } from "@/lib/format";
import type { Career, Recommendation } from "@/types";

interface CareerHeroProps {
  career: Career;
  result: Recommendation;
  actions?: React.ReactNode;
}

function matchLabel(score: number): string {
  if (score >= 90) return "Sangat cocok";
  if (score >= 75) return "Cocok";
  return "Cukup cocok";
}

export function CareerHero({ career, result, actions }: CareerHeroProps) {
  const score = toPercent(result.skorSaw);

  return (
    <div className="space-y-4">
      <Link href="/rekomendasi" className="inline-flex items-center gap-1.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Semua rekomendasi
      </Link>
      <Card className="flex flex-col gap-6 overflow-hidden rounded-2xl bg-gradient-to-br from-secondary/80 via-card to-card p-6 md:flex-row md:items-center md:p-8">
        <div className="flex-1 space-y-3">
          <Badge className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100">Peringkat #{result.peringkat}</Badge>
          <h1 className="text-3xl font-bold md:text-4xl">{career.nama}</h1>
          <p className="max-w-2xl text-muted-foreground">{career.deskripsi}</p>
          {actions && <div className="pt-2">{actions}</div>}
        </div>
        <div className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm">
          <ScoreRing value={score} />
          <div>
            <p className="text-xl font-bold text-primary">{matchLabel(score)}</p>
            <p className="text-sm text-muted-foreground">dari 5 peran yang dianalisis</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

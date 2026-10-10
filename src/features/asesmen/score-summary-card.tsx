import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiasecChip } from "@/components/ui/riasec-chip";
import { RIASEC_META, RIASEC_ORDER } from "@/constants/riasec";
import { Progress } from "@/components/ui/progress";
import { formatDecimal } from "@/lib/format";
import type { RiasecScores } from "@/types";

interface ScoreSummaryCardProps {
  scores: RiasecScores;
}

export function ScoreSummaryCard({ scores }: ScoreSummaryCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Ringkasan skor</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {RIASEC_ORDER.map((dim) => (
            <li key={dim} className="flex items-center gap-3">
              <RiasecChip dim={dim} size="sm" />
              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span>{RIASEC_META[dim].nama}</span>
                  <span className="font-semibold tabular-nums">{formatDecimal(scores[dim])}</span>
                </div>
                <Progress
                  value={(scores[dim] / 5) * 100}
                  aria-label={`Skor ${RIASEC_META[dim].nama}`}
                  className="h-1.5 bg-muted"
                  indicatorClassName={RIASEC_META[dim].bar}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-xs text-muted-foreground">Skala 1–5, rata-rata dari 5 pernyataan per tipe.</p>
      </CardContent>
    </Card>
  );
}

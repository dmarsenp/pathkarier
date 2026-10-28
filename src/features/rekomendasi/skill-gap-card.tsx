import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatDecimal } from "@/lib/format";
import type { SkillGap } from "@/types";

const MAX_BOBOT = 3;

interface SkillGapCardProps {
  gaps: SkillGap[];
}

export function SkillGapCard({ gaps }: SkillGapCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Skill prioritas untuk dipelajari</CardTitle>
        <CardDescription>Diurutkan dari dampak terbesar: bobot skill dikali seberapa jauh kamu dari level mahir.</CardDescription>
      </CardHeader>
      <CardContent>
        {gaps.length === 0 ? (
          <p className="text-sm text-muted-foreground">Semua skill untuk peran ini sudah kamu kuasai. Keren!</p>
        ) : (
          <ol className="divide-y">
            {gaps.map((gap, index) => (
              <li key={gap.nama} className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-3 first:pt-0 last:pb-0">
                <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                <div className="min-w-0 space-y-1.5">
                  <p className="truncate text-sm font-medium">{gap.nama}</p>
                  <Progress value={(gap.gap / MAX_BOBOT) * 100} className="h-1.5 bg-muted" indicatorClassName="bg-amber-500" />
                </div>
                <div className="text-right">
                  <Badge variant={gap.level === "belum" ? "outline" : "secondary"} className="rounded-full capitalize">
                    {gap.level}
                  </Badge>
                  <p className="mt-1 text-xs text-muted-foreground">bobot {formatDecimal(gap.bobot, 2)}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RiasecChip } from "@/components/ui/riasec-chip";
import { RIASEC_META } from "@/constants/riasec";
import { toPercent } from "@/lib/format";
import type { Recommendation, RiasecDim } from "@/types";

interface MatchReasonCardProps {
  careerName: string;
  dims: RiasecDim[];
  result: Recommendation;
  bobot: { minat: number; skill: number };
}

export function MatchReasonCard({ careerName, dims, result, bobot }: MatchReasonCardProps) {
  const criteria = [
    { label: "Kecocokan minat", value: toPercent(result.skorRiasec), weight: toPercent(bobot.minat) },
    { label: "Kesiapan skill", value: toPercent(result.skorSkill), weight: toPercent(bobot.skill) },
  ];

  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-lg">Mengapa cocok untukmu</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {dims.map((dim) => (
              <span key={dim} className="flex items-center gap-2 rounded-full border bg-muted/50 py-1 pl-1 pr-3 text-sm font-medium">
                <RiasecChip dim={dim} size="sm" /> {RIASEC_META[dim].nama}
              </span>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Minat {dims.map((d) => RIASEC_META[d].nama).join(" dan ")} milikmu paling selaras dengan profil {careerName}.
          </p>
        </div>
        <dl className="space-y-4">
          {criteria.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between text-sm">
                <dt>
                  {item.label} <span className="text-xs text-muted-foreground">· bobot {item.weight}%</span>
                </dt>
                <dd className="font-semibold tabular-nums">{item.value}%</dd>
              </div>
              <Progress value={item.value} />
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}

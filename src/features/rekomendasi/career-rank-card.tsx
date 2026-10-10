import Link from "next/link";
import { ArrowRight, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Career, Recommendation } from "@/types";

interface CareerRankCardProps {
  career: Career;
  result: Recommendation;
  badge?: React.ReactNode;
}

export function CareerRankCard({ career, result, badge }: CareerRankCardProps) {
  const top = result.peringkat === 1;
  const metrics = [
    { label: "Kecocokan minat", value: toPercent(result.skorRiasec) },
    { label: "Kesiapan skill", value: toPercent(result.skorSkill) },
  ];

  return (
    <Card
      className={cn(
        "group relative flex flex-col gap-5 rounded-2xl p-5 transition-shadow hover:shadow-md md:flex-row md:items-center md:p-6",
        top && "border-primary/40 bg-gradient-to-r from-secondary/70 to-card",
      )}
    >
      <div className="flex items-start gap-4 md:w-2/5">
        <span
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-xl text-sm font-bold",
            top ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {top ? <Crown className="size-4" /> : `#${result.peringkat}`}
        </span>
        <div className="space-y-1">
          <div className="flex flex-wrap gap-1.5 empty:hidden">
            {top && <Badge className="rounded-full bg-amber-100 text-amber-800 hover:bg-amber-100">Paling cocok</Badge>}
            {badge}
          </div>
          <h2 className="text-lg font-bold">{career.nama}</h2>
          <p className="text-sm text-muted-foreground">{career.ringkas}</p>
        </div>
      </div>
      <dl className="grid flex-1 grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <dt className="text-muted-foreground">{metric.label}</dt>
              <dd className="font-semibold tabular-nums">{metric.value}%</dd>
            </div>
            <Progress value={metric.value} className="h-1.5" />
          </div>
        ))}
      </dl>
      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
        <p className="text-right">
          <span className="text-3xl font-extrabold tabular-nums text-primary">{toPercent(result.skorSaw)}</span>
          <span className="text-sm font-semibold text-primary">%</span>
          <span className="block text-xs text-muted-foreground">skor akhir</span>
        </p>
        <Button asChild variant={top ? "default" : "outline"} size="sm">
          <Link href={`/rekomendasi/${career.id}`}>
            Lihat detail <ArrowRight />
          </Link>
        </Button>
      </div>
    </Card>
  );
}

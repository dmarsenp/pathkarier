import { Progress } from "@/components/ui/progress";
import { formatTanggal, type PlanProgress } from "@/lib/plans";
import { toPercent } from "@/lib/format";
import type { CareerPlan } from "@/types";

interface PlanStatsProps {
  plan: CareerPlan;
  progress: PlanProgress;
}

export function PlanStats({ plan, progress }: PlanStatsProps) {
  const stats = [
    { label: "Langkah selesai", value: `${progress.done}/${progress.total}` },
    { label: "Sisa estimasi", value: `${progress.remainingWeeks} minggu` },
    { label: "Skor saat disimpan", value: `${toPercent(plan.skorSaw)}%`, hint: formatTanggal(plan.disimpanPada) },
    { label: "Aktivitas terakhir", value: progress.lastActivity ? formatTanggal(progress.lastActivity) : "Belum ada" },
  ];

  return (
    <div className="space-y-4 rounded-2xl border bg-card p-5">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <p className="text-sm font-medium">Progres roadmap</p>
          <p className="text-2xl font-bold text-primary">{progress.percent}%</p>
        </div>
        <Progress value={progress.percent} className="h-3" />
      </div>
      <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-muted/50 p-3">
            <dt className="text-xs text-muted-foreground">{stat.label}</dt>
            <dd className="mt-1 font-semibold">{stat.value}</dd>
            {stat.hint && <dd className="text-xs text-muted-foreground">{stat.hint}</dd>}
          </div>
        ))}
      </dl>
    </div>
  );
}

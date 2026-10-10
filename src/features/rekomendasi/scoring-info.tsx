import { Calculator } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toPercent } from "@/lib/format";

interface ScoringInfoProps {
  bobotMinat: number;
  bobotSkill: number;
}

export function ScoringInfo({ bobotMinat, bobotSkill }: ScoringInfoProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 sm:flex-row sm:items-center">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
        <Calculator className="size-5" />
      </span>
      <div className="flex-1 space-y-1">
        <p className="text-sm font-semibold">Bagaimana skor dihitung?</p>
        <p className="text-sm text-muted-foreground">
          Skor akhir menggabungkan kecocokan minat dan kesiapan skill dengan metode SAW. Peringkat tidak dipengaruhi AI.
        </p>
      </div>
      <div className="w-full space-y-1.5 sm:w-60">
        <Progress value={toPercent(bobotMinat)} className="h-2.5 bg-lime-300" aria-label="Pembagian bobot" />
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-primary">Minat {toPercent(bobotMinat)}%</span>
          <span className="text-lime-700">Skill {toPercent(bobotSkill)}%</span>
        </div>
      </div>
    </div>
  );
}

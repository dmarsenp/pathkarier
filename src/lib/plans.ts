import type { CareerPlan, RoadmapStep } from "@/types";

export const MAX_PLANS = 3;

export interface PlanProgress {
  done: number;
  total: number;
  percent: number;
  remainingWeeks: number;
  nextStep?: RoadmapStep;
  lastActivity?: string;
}

export function planProgress(plan: CareerPlan): PlanProgress {
  const pending = plan.roadmap.filter((step) => !plan.selesai[step.urutan]);
  const dates = Object.values(plan.selesai).sort();
  const total = plan.roadmap.length;
  const done = total - pending.length;
  return {
    done,
    total,
    percent: total === 0 ? 0 : Math.round((done / total) * 100),
    remainingWeeks: pending.reduce((sum, step) => sum + step.estimasiMinggu, 0),
    nextStep: pending[0],
    lastActivity: dates[dates.length - 1],
  };
}

export function planLabel(prioritas: number): string {
  return prioritas === 1 ? "Jalur utama" : `Alternatif ${prioritas - 1}`;
}

export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

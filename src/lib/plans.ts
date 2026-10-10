import { getCareer } from "@/constants/careers";
import { MOCK_RECOMMENDATIONS, MOCK_USER_SKILLS } from "@/constants/mock";
import { skillGaps } from "@/lib/engine/readiness";
import { buildMockRoadmap } from "@/lib/mock-roadmap";
import type { CareerId, CareerPlan, RoadmapStep } from "@/types";

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

export function renumber(plans: CareerPlan[]): CareerPlan[] {
  return plans.map((plan, index) => ({ ...plan, prioritas: index + 1 }));
}

export function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function seedPlan(idKarier: CareerId, prioritas: number, selesai: Record<number, string>): CareerPlan | null {
  const career = getCareer(idKarier);
  const result = MOCK_RECOMMENDATIONS.find((r) => r.idKarier === idKarier);
  if (!career || !result) return null;
  return {
    idKarier,
    prioritas,
    disimpanPada: "2026-09-30T09:00:00.000Z",
    skorSaw: result.skorSaw,
    roadmap: buildMockRoadmap(career.nama, skillGaps(career.skills, MOCK_USER_SKILLS)).roadmap,
    selesai,
  };
}

// Data contoh saat pengguna belum pernah menyimpan jalur. TODO: ganti dengan GET /api/jalur.
export function demoPlans(): CareerPlan[] {
  return [
    seedPlan("frontend", 1, { 1: "2026-10-02T10:00:00.000Z", 2: "2026-10-07T10:00:00.000Z" }),
    seedPlan("ui-ux", 2, {}),
  ].filter((plan): plan is CareerPlan => plan !== null);
}

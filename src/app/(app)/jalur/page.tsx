import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PlanTracker } from "@/features/jalur/plan-tracker";
import { ProgressSummary } from "@/features/jalur/progress-summary";

export const metadata: Metadata = { title: "Jalur belajar" };

interface JalurPageProps {
  searchParams: { karier?: string };
}

export default function JalurPage({ searchParams }: JalurPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Jalur belajar"
        title="Riwayat, statistik, dan progres belajarmu"
        description="Ringkasan hasil tes minat, skill, dan rekomendasimu, lalu roadmap belajar untuk tiap jalur karier yang kamu simpan."
      />
      <ProgressSummary />
      <PlanTracker initialId={searchParams.karier} />
    </div>
  );
}

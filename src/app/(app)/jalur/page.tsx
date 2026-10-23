import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { PlanTracker } from "@/features/jalur/plan-tracker";

export const metadata: Metadata = { title: "Jalur belajar" };

interface JalurPageProps {
  searchParams: { karier?: string };
}

export default function JalurPage({ searchParams }: JalurPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Jalur belajar"
        title="Pantau progres belajarmu"
        description="Setiap jalur yang kamu simpan punya roadmap dan catatan progresnya sendiri. Pindah fokus kapan saja tanpa kehilangan progres."
      />
      <PlanTracker initialId={searchParams.karier} />
    </div>
  );
}

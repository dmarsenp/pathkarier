import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { CAREERS } from "@/constants/careers";
import { MOCK_USER_SKILLS } from "@/constants/mock";
import { PlanTracker } from "@/features/jalur/plan-tracker";
import { ResourceExplorer } from "@/features/sumber-belajar/resource-explorer";
import { resourcesForCareer } from "@/lib/resources";

export const metadata: Metadata = { title: "Jalur belajar" };

interface JalurPageProps {
  searchParams: { karier?: string };
}

export default function JalurPage({ searchParams }: JalurPageProps) {
  const resourcesByCareer = Object.fromEntries(
    CAREERS.map((career) => [career.id, <ResourceExplorer key={career.id} items={resourcesForCareer(career, MOCK_USER_SKILLS)} />]),
  );

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Jalur belajar"
        title="Pantau progres belajarmu"
        description="Setiap jalur yang kamu simpan punya roadmap dan catatan progresnya sendiri. Pindah fokus kapan saja tanpa kehilangan progres."
      />
      <PlanTracker initialId={searchParams.karier} resourcesByCareer={resourcesByCareer} />
    </div>
  );
}

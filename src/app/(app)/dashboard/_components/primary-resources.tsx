"use client";

import { ResourceExplorer } from "@/components/learning/resource-explorer";
import { useCareerPlans } from "@/hooks/use-career-plans";
import { useCareers } from "@/hooks/use-careers";
import { useRecommendations } from "@/hooks/use-recommendations";
import { useUserSkills } from "@/hooks/use-user-skills";
import { resourcesForCareer } from "@/lib/resources";

export function PrimaryResources() {
  const { plans, ready: plansReady } = useCareerPlans();
  const { recommendations, ready: recsReady } = useRecommendations();
  const { skills, ready: skillsReady } = useUserSkills();
  const { getCareer, ready: careersReady } = useCareers();
  if (!plansReady || !recsReady || !skillsReady || !careersReady) return null;

  const id = plans[0]?.idKarier ?? recommendations[0]?.idKarier;
  if (!id) return null;
  const career = getCareer(id);
  if (!career) return null;

  return (
    <section className="space-y-4" aria-label="Rekomendasi kursus dan sertifikasi">
      <div>
        <h2 className="text-xl font-bold">Kursus & sertifikasi gratis untukmu</h2>
        <p className="text-sm text-muted-foreground">
          Untuk jalur {plans.length > 0 ? "utama" : "teratas"}mu, {career.nama}. Diurutkan dari skill yang paling perlu kamu kejar.
        </p>
      </div>
      <ResourceExplorer items={resourcesForCareer(career, skills)} />
    </section>
  );
}

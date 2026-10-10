"use client";

import { useCareerPlans } from "@/hooks/use-career-plans";
import { getCareer } from "@/constants/careers";

interface PrimaryResourcesProps {
  fallbackId: string;
  resourcesByCareer: Record<string, React.ReactNode>;
}

export function PrimaryResources({ fallbackId, resourcesByCareer }: PrimaryResourcesProps) {
  const { plans, ready } = useCareerPlans();
  if (!ready) return null;

  const id = plans[0]?.idKarier ?? fallbackId;
  const career = getCareer(id);

  return (
    <section className="space-y-4" aria-label="Rekomendasi kursus dan sertifikasi">
      <div>
        <h2 className="text-xl font-bold">Kursus & sertifikasi gratis untukmu</h2>
        <p className="text-sm text-muted-foreground">
          Untuk jalur {plans.length > 0 ? "utama" : "teratas"}mu, {career?.nama}. Diurutkan dari skill yang paling perlu kamu kejar.
        </p>
      </div>
      {resourcesByCareer[id]}
    </section>
  );
}

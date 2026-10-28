"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCareerPlans } from "@/hooks/use-career-plans";
import { useCareers } from "@/hooks/use-careers";
import { AltPlanCard } from "@/features/jalur/alt-plan-card";
import { PrimaryPlanCard } from "@/features/jalur/primary-plan-card";
import type { CareerId } from "@/types";

export function PlansOverview() {
  const { plans, ready, canAdd, setPrimary } = useCareerPlans();
  const { getCareer, ready: careersReady } = useCareers();
  const [pendingId, setPendingId] = useState<CareerId | null>(null);

  if (!ready || !careersReady) return <Skeleton className="h-[34rem] w-full rounded-2xl md:h-[27rem]" />;

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card p-10 text-center">
        <Compass className="size-8 text-primary" />
        <p className="text-lg font-semibold">Belum ada jalur yang kamu tekuni</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Pilih satu jalur utama dari rekomendasimu. Kamu juga bisa menambah jalur alternatif untuk dicoba.
        </p>
        <Button asChild>
          <Link href="/rekomendasi">Lihat rekomendasi</Link>
        </Button>
      </div>
    );
  }

  const [primary, ...alternatives] = plans;
  const primaryCareer = getCareer(primary.idKarier);

  async function makePrimary(id: CareerId) {
    setPendingId(id);
    try {
      await setPrimary(id);
      toast.success(`${getCareer(id)?.nama} sekarang jadi jalur utama`);
    } catch {
      toast.error("Gagal menjadikan jalur utama.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <section className="space-y-4" aria-label="Jalur karier pilihanmu">
      {primaryCareer && <PrimaryPlanCard plan={primary} career={primaryCareer} />}
      <div className="grid gap-4 md:grid-cols-3">
        {alternatives.map((plan) => {
          const career = getCareer(plan.idKarier);
          if (!career) return null;
          return (
            <AltPlanCard
              key={plan.idKarier}
              plan={plan}
              career={career}
              onMakePrimary={() => makePrimary(plan.idKarier)}
              isMakingPrimary={pendingId === plan.idKarier}
            />
          );
        })}
        {canAdd && (
          <Link
            href="/rekomendasi"
            className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-5 text-center text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary/40 hover:text-foreground"
          >
            <Plus className="size-5" />
            <span className="font-medium">Coba jalur lain</span>
            <span className="text-xs">Tambahkan sebagai alternatif dari rekomendasimu</span>
          </Link>
        )}
      </div>
    </section>
  );
}

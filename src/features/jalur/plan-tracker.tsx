"use client";

import { useState } from "react";
import Link from "next/link";
import { Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCareer } from "@/constants/careers";
import { useCareerPlans } from "@/hooks/use-career-plans";
import { PlanDetail } from "@/features/jalur/plan-detail";
import { planLabel, planProgress } from "@/lib/plans";

interface PlanTrackerProps {
  initialId?: string;
  resourcesByCareer: Record<string, React.ReactNode>;
}

export function PlanTracker({ initialId, resourcesByCareer }: PlanTrackerProps) {
  const { plans, ready } = useCareerPlans();
  const [selected, setSelected] = useState(initialId);

  if (!ready) return <Skeleton className="h-96 w-full rounded-2xl" />;

  if (plans.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed bg-card p-12 text-center">
        <Route className="size-8 text-primary" />
        <p className="text-lg font-semibold">Belum ada jalur belajar</p>
        <p className="max-w-md text-sm text-muted-foreground">Simpan karier dari halaman rekomendasi untuk mulai melacak progres.</p>
        <Button asChild>
          <Link href="/rekomendasi">Lihat rekomendasi</Link>
        </Button>
      </div>
    );
  }

  const active = plans.find((p) => p.idKarier === selected) ?? plans[0];
  const career = getCareer(active.idKarier);

  return (
    <div className="space-y-6">
      <Tabs value={active.idKarier} onValueChange={setSelected}>
        <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-xl p-1 sm:w-auto">
          {plans.map((plan) => (
            <TabsTrigger
              key={plan.idKarier}
              value={plan.idKarier}
              className="flex-col items-start gap-0.5 rounded-lg px-4 py-2 text-left data-[state=active]:shadow-sm"
            >
              <span className="text-sm font-semibold">{getCareer(plan.idKarier)?.nama}</span>
              <span className="text-[11px] font-normal text-muted-foreground">
                {planLabel(plan.prioritas)} · {planProgress(plan).percent}%
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {career && <PlanDetail key={active.idKarier} plan={active} career={career} resources={resourcesByCareer[career.id]} />}
    </div>
  );
}

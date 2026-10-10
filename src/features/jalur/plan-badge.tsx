"use client";

import { Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCareerPlans } from "@/hooks/use-career-plans";
import { planLabel } from "@/lib/plans";
import type { CareerId } from "@/types";

export function PlanBadge({ idKarier }: { idKarier: CareerId }) {
  const { getPlan } = useCareerPlans();
  const plan = getPlan(idKarier);
  if (!plan) return null;

  return (
    <Badge variant="outline" className="gap-1 rounded-full border-primary/30 bg-card text-primary">
      <Bookmark className="size-3 fill-current" /> {planLabel(plan.prioritas)}
    </Badge>
  );
}

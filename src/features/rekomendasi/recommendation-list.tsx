"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { enterStagger } from "@/lib/motion";
import { useCareers } from "@/hooks/use-careers";
import { useRecommendations } from "@/hooks/use-recommendations";
import { PlanBadge } from "@/components/plan/plan-badge";
import { CareerRankCard } from "@/features/rekomendasi/career-rank-card";
import { RecommendationBlockerCard } from "@/features/rekomendasi/recommendation-blocker";

export function RecommendationList() {
  const { recommendations, ready, blocker } = useRecommendations();
  const { getCareer, ready: careersReady } = useCareers();

  if (!ready || !careersReady) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (blocker) return <RecommendationBlockerCard reason={blocker} />;

  return (
    <ol className="space-y-4">
      {recommendations.map((result, index) => {
        const career = getCareer(result.idKarier);
        if (!career) return null;
        return (
          <li key={result.idKarier} className={enterStagger(index)}>
            <CareerRankCard career={career} result={result} badge={<PlanBadge idKarier={career.id} />} />
          </li>
        );
      })}
    </ol>
  );
}

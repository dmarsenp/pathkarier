"use client";

import Link from "next/link";
import { useCareers } from "@/hooks/use-careers";
import { useRecommendations } from "@/hooks/use-recommendations";
import { toPercent } from "@/lib/format";

const BLOCKER_TEXT = {
  "no-assessment": "Kerjakan tes minat untuk melihat rekomendasi.",
  "no-skill": "Lengkapi skill untuk melihat rekomendasi.",
};

export function RecommendationSummary() {
  const { recommendations, ready, blocker } = useRecommendations();
  const { getCareer, ready: careersReady } = useCareers();
  if (!ready || !careersReady) return null;

  if (blocker) {
    return <p className="text-sm text-muted-foreground">{BLOCKER_TEXT[blocker]}</p>;
  }

  return (
    <ol className="space-y-2">
      {recommendations.map((result) => (
        <li key={result.idKarier}>
          <Link href={`/rekomendasi/${result.idKarier}`} className="flex items-center justify-between gap-2 py-1.5 text-sm hover:text-primary">
            <span className="truncate">
              <span className="mr-2 text-muted-foreground">#{result.peringkat}</span>
              {getCareer(result.idKarier)?.nama}
            </span>
            <span className="font-semibold tabular-nums">{toPercent(result.skorSaw)}%</span>
          </Link>
        </li>
      ))}
    </ol>
  );
}

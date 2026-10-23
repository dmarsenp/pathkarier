"use client";

import { useEffect, useState } from "react";
import type { Recommendation } from "@/types";

export type RecommendationBlocker = "no-assessment" | "no-skill";

interface RecommendationsValue {
  recommendations: Recommendation[];
  ready: boolean;
  blocker: RecommendationBlocker | null;
}

// FR-08 s/d FR-12: peringkat SAW dihitung oleh server dari data asesmen & skill nyata (lihat /api/rekomendasi).
export function useRecommendations(): RecommendationsValue {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [ready, setReady] = useState(false);
  const [blocker, setBlocker] = useState<RecommendationBlocker | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/rekomendasi")
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        if (!res.ok) {
          setBlocker((data.error as RecommendationBlocker) ?? null);
          setRecommendations([]);
          return;
        }
        setBlocker(null);
        setRecommendations(data.recommendations ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setBlocker(null);
          setRecommendations([]);
        }
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { recommendations, ready, blocker };
}

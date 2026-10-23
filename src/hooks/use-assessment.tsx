"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Question, RiasecScores } from "@/types";

export interface AssessmentResult {
  scores: RiasecScores;
  selesaiPada: string;
}

interface AssessmentValue {
  result: AssessmentResult | null;
  ready: boolean;
  saveResult: (questions: Question[], answers: Record<number, number>) => Promise<RiasecScores>;
}

const AssessmentContext = createContext<AssessmentValue | null>(null);

// FR-04/FR-05: skor RIASEC dihitung & disimpan oleh server (lihat /api/asesmen).
export function AssessmentProvider({ children }: { children: React.ReactNode }) {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/asesmen")
      .then((res) => (res.ok ? res.json() : { result: null }))
      .then((data) => {
        if (cancelled) return;
        setResult(data.result ? { scores: data.result.scores, selesaiPada: data.result.completedAt } : null);
      })
      .catch(() => {
        if (!cancelled) setResult(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveResult = useCallback(async (questions: Question[], answers: Record<number, number>) => {
    const res = await fetch("/api/asesmen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan hasil asesmen.");
    setResult({ scores: data.scores, selesaiPada: data.completedAt });
    return data.scores as RiasecScores;
  }, []);

  const value = useMemo(() => ({ result, ready, saveResult }), [result, ready, saveResult]);

  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment(): AssessmentValue {
  const context = useContext(AssessmentContext);
  if (!context) throw new Error("useAssessment harus dipakai di dalam AssessmentProvider");
  return context;
}

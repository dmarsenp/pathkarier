"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MAX_PLANS, demoPlans, renumber } from "@/lib/plans";
import type { CareerId, CareerPlan, RoadmapStep } from "@/types";

const STORAGE_KEY = "pathkarier:jalur";

interface SavePlanInput {
  idKarier: CareerId;
  skorSaw: number;
  roadmap: RoadmapStep[];
}

interface CareerPlansValue {
  plans: CareerPlan[];
  ready: boolean;
  canAdd: boolean;
  getPlan: (id: CareerId) => CareerPlan | undefined;
  savePlan: (input: SavePlanInput, asPrimary: boolean) => void;
  removePlan: (id: CareerId) => void;
  setPrimary: (id: CareerId) => void;
  toggleStep: (id: CareerId, urutan: number) => void;
}

const CareerPlansContext = createContext<CareerPlansValue | null>(null);

function readStorage(): CareerPlan[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw === null ? demoPlans() : (JSON.parse(raw) as CareerPlan[]);
  } catch {
    return demoPlans();
  }
}

// Penyimpanan sementara di browser. TODO: ganti dengan API `/api/jalur` (lihat docs/usulan-jalur-belajar.md).
export function CareerPlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<CareerPlan[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setPlans(readStorage());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch {
      console.warn("[jalur] gagal menyimpan ke localStorage");
    }
  }, [plans, ready]);

  const getPlan = useCallback((id: CareerId) => plans.find((p) => p.idKarier === id), [plans]);

  const savePlan = useCallback((input: SavePlanInput, asPrimary: boolean) => {
    setPlans((prev) => {
      const others = prev.filter((p) => p.idKarier !== input.idKarier);
      const existing = prev.find((p) => p.idKarier === input.idKarier);
      const plan: CareerPlan = existing ?? { ...input, prioritas: 0, disimpanPada: new Date().toISOString(), selesai: {} };
      return renumber(asPrimary ? [plan, ...others] : [...others, plan]);
    });
  }, []);

  const removePlan = useCallback((id: CareerId) => setPlans((prev) => renumber(prev.filter((p) => p.idKarier !== id))), []);

  const setPrimary = useCallback((id: CareerId) => {
    setPlans((prev) => {
      const target = prev.find((p) => p.idKarier === id);
      return target ? renumber([target, ...prev.filter((p) => p.idKarier !== id)]) : prev;
    });
  }, []);

  const toggleStep = useCallback((id: CareerId, urutan: number) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.idKarier !== id) return plan;
        const selesai = { ...plan.selesai };
        if (selesai[urutan]) delete selesai[urutan];
        else selesai[urutan] = new Date().toISOString();
        return { ...plan, selesai };
      }),
    );
  }, []);

  const value = useMemo(
    () => ({ plans, ready, canAdd: plans.length < MAX_PLANS, getPlan, savePlan, removePlan, setPrimary, toggleStep }),
    [plans, ready, getPlan, savePlan, removePlan, setPrimary, toggleStep],
  );

  return <CareerPlansContext.Provider value={value}>{children}</CareerPlansContext.Provider>;
}

export function useCareerPlans(): CareerPlansValue {
  const context = useContext(CareerPlansContext);
  if (!context) throw new Error("useCareerPlans harus dipakai di dalam CareerPlansProvider");
  return context;
}

"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { MAX_PLANS } from "@/lib/plans";
import type { CareerId, CareerPlan, RoadmapStep } from "@/types";

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
  savePlan: (input: SavePlanInput, asPrimary: boolean) => Promise<void>;
  removePlan: (id: CareerId) => Promise<void>;
  setPrimary: (id: CareerId) => Promise<void>;
  toggleStep: (id: CareerId, urutan: number) => Promise<void>;
  setCertificate: (id: CareerId, urutan: number, url: string) => Promise<void>;
}

const CareerPlansContext = createContext<CareerPlansValue | null>(null);

async function fetchPlans(): Promise<CareerPlan[]> {
  const res = await fetch("/api/jalur");
  if (!res.ok) return [];
  const data = await res.json().catch(() => ({}));
  return data.plans ?? [];
}

// FR-? Jalur belajar: karier yang disimpan pengguna beserta progres roadmap-nya, disimpan
// server-side (lihat /api/jalur) agar konsisten dengan arsitektur DB-backed lainnya.
export function CareerPlansProvider({ children }: { children: React.ReactNode }) {
  const [plans, setPlans] = useState<CareerPlan[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPlans()
      .then((data) => {
        if (!cancelled) setPlans(data);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getPlan = useCallback((id: CareerId) => plans.find((p) => p.idKarier === id), [plans]);

  const refresh = useCallback(async () => setPlans(await fetchPlans()), []);

  const savePlan = useCallback(
    async (input: SavePlanInput, asPrimary: boolean) => {
      const res = await fetch("/api/jalur", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, asPrimary }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan jalur.");
      await refresh();
    },
    [refresh],
  );

  const removePlan = useCallback(
    async (id: CareerId) => {
      const res = await fetch(`/api/jalur/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus jalur.");
      await refresh();
    },
    [refresh],
  );

  const setPrimary = useCallback(
    async (id: CareerId) => {
      const res = await fetch(`/api/jalur/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setPrimary" }),
      });
      if (!res.ok) throw new Error("Gagal menjadikan jalur utama.");
      await refresh();
    },
    [refresh],
  );

  const toggleStep = useCallback(async (id: CareerId, urutan: number) => {
    setPlans((prev) =>
      prev.map((plan) => {
        if (plan.idKarier !== id) return plan;
        const selesai = { ...plan.selesai };
        if (selesai[urutan]) delete selesai[urutan];
        else selesai[urutan] = new Date().toISOString();
        return { ...plan, selesai };
      }),
    );
    const res = await fetch(`/api/jalur/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleStep", urutan }),
    });
    if (!res.ok) throw new Error("Gagal menyimpan progres roadmap.");
  }, []);

  const setCertificate = useCallback(async (id: CareerId, urutan: number, url: string) => {
    const res = await fetch(`/api/jalur/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setCertificate", urutan, url }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan link sertifikat.");
    setPlans((prev) => prev.map((plan) => (plan.idKarier === id ? { ...plan, roadmap: data.roadmap } : plan)));
  }, []);

  const value = useMemo(
    () => ({ plans, ready, canAdd: plans.length < MAX_PLANS, getPlan, savePlan, removePlan, setPrimary, toggleStep, setCertificate }),
    [plans, ready, getPlan, savePlan, removePlan, setPrimary, toggleStep, setCertificate],
  );

  return <CareerPlansContext.Provider value={value}>{children}</CareerPlansContext.Provider>;
}

export function useCareerPlans(): CareerPlansValue {
  const context = useContext(CareerPlansContext);
  if (!context) throw new Error("useCareerPlans harus dipakai di dalam CareerPlansProvider");
  return context;
}

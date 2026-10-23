"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Career, CareerId } from "@/types";

interface CareersValue {
  careers: Career[];
  ready: boolean;
  getCareer: (id: string) => Career | undefined;
}

const CareersContext = createContext<CareersValue | null>(null);

// NFR-05: daftar karier dibaca dari DB, bukan daftar statis di kode — perubahan admin
// (tambah/ubah/hapus karier) langsung terlihat di seluruh aplikasi tanpa redeploy.
export function CareersProvider({ children }: { children: React.ReactNode }) {
  const [careers, setCareers] = useState<Career[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/karier")
      .then((res) => (res.ok ? res.json() : { careers: [] }))
      .then((data) => {
        if (!cancelled) setCareers(data.careers ?? []);
      })
      .catch(() => {
        if (!cancelled) setCareers([]);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getCareer = useCallback((id: string) => careers.find((c) => c.id === (id as CareerId)), [careers]);

  const value = useMemo(() => ({ careers, ready, getCareer }), [careers, ready, getCareer]);

  return <CareersContext.Provider value={value}>{children}</CareersContext.Provider>;
}

export function useCareers(): CareersValue {
  const context = useContext(CareersContext);
  if (!context) throw new Error("useCareers harus dipakai di dalam CareersProvider");
  return context;
}

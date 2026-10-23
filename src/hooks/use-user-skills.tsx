"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { UserSkill } from "@/types";

interface UserSkillsValue {
  skills: UserSkill[];
  ready: boolean;
  saveSkills: (skills: UserSkill[]) => Promise<void>;
}

const UserSkillsContext = createContext<UserSkillsValue | null>(null);

// FR-06/FR-07: skill & level pengguna disimpan dan divalidasi oleh server (lihat /api/skill).
export function UserSkillsProvider({ children }: { children: React.ReactNode }) {
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/skill")
      .then((res) => (res.ok ? res.json() : { skills: [] }))
      .then((data) => {
        if (!cancelled) setSkills(data.skills ?? []);
      })
      .catch(() => {
        if (!cancelled) setSkills([]);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const saveSkills = useCallback(async (next: UserSkill[]) => {
    const res = await fetch("/api/skill", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skills: next }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error ?? "Gagal menyimpan skill.");
    setSkills(next);
  }, []);

  const value = useMemo(() => ({ skills, ready, saveSkills }), [skills, ready, saveSkills]);

  return <UserSkillsContext.Provider value={value}>{children}</UserSkillsContext.Provider>;
}

export function useUserSkills(): UserSkillsValue {
  const context = useContext(UserSkillsContext);
  if (!context) throw new Error("useUserSkills harus dipakai di dalam UserSkillsProvider");
  return context;
}

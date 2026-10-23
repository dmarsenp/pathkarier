"use client";

import { useUserSkills } from "@/hooks/use-user-skills";

export function SkillSummary() {
  const { skills, ready } = useUserSkills();
  if (!ready) return null;

  const mahir = skills.filter((s) => s.level === "mahir").length;
  const dasar = skills.filter((s) => s.level === "dasar").length;

  return (
    <>
      <p className="text-4xl font-extrabold">{skills.length}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {mahir} mahir · {dasar} dasar
      </p>
    </>
  );
}

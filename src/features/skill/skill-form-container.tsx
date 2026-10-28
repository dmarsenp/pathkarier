"use client";

import { Skeleton } from "@/components/ui/skeleton";
import type { SkillGroup } from "@/types";
import { SkillForm } from "@/features/skill/skill-form";
import { useUserSkills } from "@/hooks/use-user-skills";

interface SkillFormContainerProps {
  groups: SkillGroup[];
}

export function SkillFormContainer({ groups }: SkillFormContainerProps) {
  const { skills, ready, saveSkills } = useUserSkills();

  if (!ready) return <Skeleton className="h-96 w-full rounded-2xl" />;

  return <SkillForm groups={groups} initial={skills} onSave={saveSkills} />;
}

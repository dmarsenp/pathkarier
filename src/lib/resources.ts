import { LEARNING_RESOURCES } from "@/constants/learning-resources";
import { skillGaps } from "@/lib/engine/readiness";
import type { Career, LearningResource, UserSkill } from "@/types";

export interface RankedResource {
  resource: LearningResource;
  matched: string[];
}

// Urutkan sumber belajar menurut skill prioritas: skill di urutan awal bernilai lebih besar.
export function rankResources(resources: LearningResource[], prioritySkills: string[], limit = 6): RankedResource[] {
  const weight = (skill: string): number => prioritySkills.length - prioritySkills.indexOf(skill);
  return resources
    .map((resource) => {
      const matched = prioritySkills.filter((skill) => resource.skills.includes(skill));
      const score = matched.reduce((sum, skill) => sum + weight(skill), 0) + (resource.biaya === "gratis" ? 0.5 : 0);
      return { resource, matched, score };
    })
    .filter((item) => item.matched.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ resource, matched }) => ({ resource, matched }));
}

// Sumber belajar untuk satu karier, diprioritaskan dari skill gap terbesar.
export function resourcesForCareer(career: Career, userSkills: UserSkill[], limit = LEARNING_RESOURCES.length): RankedResource[] {
  const priority = skillGaps(career.skills, userSkills, career.skills.length).map((gap) => gap.nama);
  return rankResources(LEARNING_RESOURCES, priority, limit);
}

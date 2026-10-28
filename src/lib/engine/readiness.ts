import type { CareerSkill, SkillGap, SkillLevel, UserSkill } from "@/types";

const LEVEL_VALUE: Record<SkillLevel, number> = { belum: 0, dasar: 0.5, mahir: 1 };

function levelOf(nama: string, userSkills: UserSkill[]): SkillLevel {
  return userSkills.find((s) => s.nama === nama)?.level ?? "belum";
}

// Skill gap = bobot × (1 − penguasaan), diurutkan menurun dan dipotong sebanyak topK.
export function skillGaps(careerSkills: CareerSkill[], userSkills: UserSkill[], topK = 5): SkillGap[] {
  return careerSkills
    .map((skill) => {
      const level = levelOf(skill.nama, userSkills);
      return { nama: skill.nama, bobot: skill.bobot, level, gap: skill.bobot * (1 - LEVEL_VALUE[level]) };
    })
    .filter((item) => item.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, topK);
}

// Skor kesiapan skill = Σ(bobot × penguasaan) / Σbobot.
export function skillReadinessScore(careerSkills: CareerSkill[], userSkills: UserSkill[]): number {
  let weightedSum = 0;
  let totalWeight = 0;
  for (const skill of careerSkills) {
    weightedSum += skill.bobot * LEVEL_VALUE[levelOf(skill.nama, userSkills)];
    totalWeight += skill.bobot;
  }
  return totalWeight === 0 ? 0 : weightedSum / totalWeight;
}

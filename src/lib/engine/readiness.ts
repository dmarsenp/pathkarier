import type { CareerSkill, SkillGap, SkillLevel, UserSkill } from "@/types";

const LEVEL_VALUE: Record<SkillLevel, number> = { belum: 0, dasar: 0.5, mahir: 1 };

export function levelOf(nama: string, userSkills: UserSkill[]): SkillLevel {
  return userSkills.find((s) => s.nama === nama)?.level ?? "belum";
}

// SPEC 6.3: skill_gap_k = b_k × (1 − h_k), urut menurun, ambil top K.
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

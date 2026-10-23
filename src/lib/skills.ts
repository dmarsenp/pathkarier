import { prisma } from "@/lib/prisma";

export interface SkillGroup {
  karier: string;
  skills: string[];
}

// Master skill dikelompokkan per karier (skill yang sama hanya muncul sekali), dari basis data (FR-19).
export async function getSkillGroupsFromDb(): Promise<SkillGroup[]> {
  const careers = await prisma.career.findMany({
    include: { skills: { include: { skill: true } } },
  });

  const seen = new Set<string>();
  return careers.map((career) => {
    const names = career.skills.map((cs) => cs.skill.nama).filter((nama) => !seen.has(nama));
    names.forEach((nama) => seen.add(nama));
    return { karier: career.nama, skills: names };
  });
}

import { prisma } from "@/lib/prisma";
import { skillGaps } from "@/lib/engine/readiness";
import { topContributors } from "@/lib/engine/riasec";
import { rankCareers, type SawWeights } from "@/lib/engine/saw";
import { generateRoadmapWithFallback } from "@/lib/llm/generate-roadmap";
import { buildBaseRoadmap } from "@/lib/base-roadmap";
import type { AiRoadmap, Career, Recommendation, RiasecDim, RiasecScores, SkillGap, UserSkill } from "@/types";
import type { Prisma } from "@prisma/client";

type PrerequisiteReason = "no-assessment" | "no-skill";

export class RecommendationPrerequisiteError extends Error {
  constructor(public reason: PrerequisiteReason) {
    super(reason);
  }
}

interface ComputeResult {
  recommendations: Recommendation[];
  userRiasec: RiasecScores;
  userSkills: UserSkill[];
  careers: Career[];
  weights: SawWeights;
}

// FR-08 s/d FR-13/FR-16: hitung ulang peringkat SAW dari data pengguna terbaru di DB, lalu simpan.
export async function computeAndSaveRecommendations(userId: string): Promise<ComputeResult> {
  const [assessment, userSkillRows, careerRows, weightRow] = await Promise.all([
    prisma.riasecAssessment.findFirst({ where: { userId }, orderBy: { completedAt: "desc" } }),
    prisma.userSkill.findMany({ where: { userId }, include: { skill: true } }),
    prisma.career.findMany({ include: { skills: { include: { skill: true } } } }),
    prisma.criteriaWeight.findUnique({ where: { id: 1 } }),
  ]);

  if (!assessment) throw new RecommendationPrerequisiteError("no-assessment");
  if (userSkillRows.length === 0) throw new RecommendationPrerequisiteError("no-skill");

  const userRiasec: RiasecScores = {
    R: assessment.r,
    I: assessment.i,
    A: assessment.a,
    S: assessment.s,
    E: assessment.e,
    C: assessment.c,
  };
  const userSkills: UserSkill[] = userSkillRows.map((us) => ({ nama: us.skill.nama, level: us.level }));
  const careers: Career[] = careerRows.map((c) => ({
    id: c.id as Career["id"],
    nama: c.nama,
    ringkas: c.ringkas,
    deskripsi: c.deskripsi,
    tanggungJawab: c.tanggungJawab as string[],
    profil: { R: c.profilR, I: c.profilI, A: c.profilA, S: c.profilS, E: c.profilE, C: c.profilC },
    skills: c.skills.map((cs) => ({ nama: cs.skill.nama, bobot: cs.bobot })),
  }));
  const weights = weightRow ? { minat: weightRow.minat, skill: weightRow.skill } : { minat: 0.45, skill: 0.55 };

  const recommendations = rankCareers(careers, userRiasec, userSkills, weights);

  await prisma.$transaction(
    recommendations.map((rec) =>
      prisma.recommendation.upsert({
        where: { userId_careerId: { userId, careerId: rec.idKarier } },
        update: {
          skorRiasec: rec.skorRiasec,
          skorSkill: rec.skorSkill,
          skorSaw: rec.skorSaw,
          peringkat: rec.peringkat,
          computedAt: new Date(),
        },
        create: {
          userId,
          careerId: rec.idKarier,
          skorRiasec: rec.skorRiasec,
          skorSkill: rec.skorSkill,
          skorSaw: rec.skorSaw,
          peringkat: rec.peringkat,
        },
      }),
    ),
  );

  return { recommendations, userRiasec, userSkills, careers, weights };
}

interface CareerDetail {
  career: Career;
  result: Recommendation;
  gaps: SkillGap[];
  dims: RiasecDim[];
  roadmap: AiRoadmap;
  aiGenerated: boolean;
  userSkills: UserSkill[];
  weights: SawWeights;
}

function toJson(value: unknown): Prisma.InputJsonValue {
  return value as unknown as Prisma.InputJsonValue;
}

async function resolveCareerAndGaps(userId: string, idKarier: string) {
  const { recommendations, userRiasec, userSkills, careers, weights } = await computeAndSaveRecommendations(userId);
  const career = careers.find((c) => c.id === idKarier);
  const result = recommendations.find((r) => r.idKarier === idKarier);
  if (!career || !result) return null;

  const gaps = skillGaps(career.skills, userSkills);
  const dims = topContributors(userRiasec, career.profil);
  return { career, result, gaps, dims, userSkills, weights };
}

// FR-13: skor, alasan kecocokan, dan skill gap untuk satu karier. Roadmap diambil dari cache
// DB bila sudah pernah dibuat (FR-16); bila belum, dibuat versi dasar tanpa memanggil AI —
// pengguna memicu pembuatan versi AI lewat POST /api/rekomendasi/{idKarier}/roadmap.
export async function getCareerDetail(userId: string, idKarier: string): Promise<CareerDetail | null> {
  const resolved = await resolveCareerAndGaps(userId, idKarier);
  if (!resolved) return null;
  const { career, result, gaps, dims, userSkills, weights } = resolved;

  const recRow = await prisma.recommendation.findUnique({
    where: { userId_careerId: { userId, careerId: career.id } },
  });
  const existing = recRow ? await prisma.roadmap.findUnique({ where: { recommendationId: recRow.id } }) : null;

  if (existing) {
    const roadmap: AiRoadmap = {
      penjelasan: existing.penjelasan as string[],
      roadmap: existing.steps as unknown as AiRoadmap["roadmap"],
      proyekPortofolio: existing.proyekPortofolio as unknown as AiRoadmap["proyekPortofolio"],
    };
    return { career, result, gaps, dims, roadmap, aiGenerated: existing.aiGenerated, userSkills, weights };
  }

  const roadmap = buildBaseRoadmap(career.nama, gaps);
  if (recRow) {
    await prisma.roadmap.create({
      data: {
        recommendationId: recRow.id,
        penjelasan: roadmap.penjelasan,
        steps: toJson(roadmap.roadmap),
        proyekPortofolio: toJson(roadmap.proyekPortofolio),
        aiGenerated: false,
      },
    });
  }

  return { career, result, gaps, dims, roadmap, aiGenerated: false, userSkills, weights };
}

interface GeneratedRoadmap {
  roadmap: AiRoadmap;
  aiGenerated: boolean;
}

// FR-14/FR-15: panggil Gemini API untuk penjelasan naratif & roadmap personal, simpan hasilnya.
// NFR-06: bila API gagal/timeout, tetap kembalikan versi dasar (aiGenerated: false) tanpa error.
export async function generateAiRoadmap(userId: string, idKarier: string): Promise<GeneratedRoadmap | null> {
  const resolved = await resolveCareerAndGaps(userId, idKarier);
  if (!resolved) return null;
  const { career, result, gaps } = resolved;

  const generated = await generateRoadmapWithFallback({
    careerName: career.nama,
    riasecFitPercent: Math.round(result.skorRiasec * 100),
    skillReadinessPercent: Math.round(result.skorSkill * 100),
    gaps,
  });

  const roadmap = generated?.roadmap ?? buildBaseRoadmap(career.nama, gaps);
  const aiGenerated = generated !== null;

  const recRow = await prisma.recommendation.findUnique({
    where: { userId_careerId: { userId, careerId: career.id } },
  });
  if (recRow) {
    await prisma.roadmap.upsert({
      where: { recommendationId: recRow.id },
      update: {
        penjelasan: roadmap.penjelasan,
        steps: toJson(roadmap.roadmap),
        proyekPortofolio: toJson(roadmap.proyekPortofolio),
        aiGenerated,
        generatedAt: new Date(),
      },
      create: {
        recommendationId: recRow.id,
        penjelasan: roadmap.penjelasan,
        steps: toJson(roadmap.roadmap),
        proyekPortofolio: toJson(roadmap.proyekPortofolio),
        aiGenerated,
      },
    });
  }

  return { roadmap, aiGenerated };
}

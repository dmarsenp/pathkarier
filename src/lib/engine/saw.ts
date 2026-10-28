import { skillReadinessScore } from "@/lib/engine/readiness";
import { riasecFitScore } from "@/lib/engine/riasec";
import type { Career, Recommendation, RiasecScores, UserSkill } from "@/types";

export interface SawWeights {
  minat: number;
  skill: number;
}

// Model perhitungan SAW (kedua kriteria bersifat benefit):
// 1) Susun matriks keputusan (C1 = RIASEC-fit, C2 = kesiapan skill).
// 2) Normalisasi tiap kolom terhadap nilai maksimumnya (kedua kriteria benefit).
// 3) Kalikan dengan bobot kriteria & jumlahkan untuk skor akhir V.
// 4) Urutkan dari skor tertinggi ke terendah sebagai peringkat.
export function rankCareers(
  careers: Career[],
  userRiasec: RiasecScores,
  userSkills: UserSkill[],
  weights: SawWeights,
): Recommendation[] {
  const matrix = careers.map((career) => ({
    idKarier: career.id,
    c1: riasecFitScore(userRiasec, career.profil),
    c2: skillReadinessScore(career.skills, userSkills),
  }));

  const maxC1 = Math.max(...matrix.map((row) => row.c1));
  const maxC2 = Math.max(...matrix.map((row) => row.c2));

  return matrix
    .map((row) => {
      const r1 = maxC1 === 0 ? 0 : row.c1 / maxC1;
      const r2 = maxC2 === 0 ? 0 : row.c2 / maxC2;
      return {
        idKarier: row.idKarier,
        skorRiasec: row.c1,
        skorSkill: row.c2,
        skorSaw: weights.minat * r1 + weights.skill * r2,
        peringkat: 0,
      };
    })
    .sort((a, b) => b.skorSaw - a.skorSaw)
    .map((rec, index) => ({ ...rec, peringkat: index + 1 }));
}

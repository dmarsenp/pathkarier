import { RIASEC_ORDER } from "@/constants/riasec";
import type { Question, RiasecDim, RiasecScores } from "@/types";

// Kecocokan minat = cosine similarity antara vektor
// RIASEC pengguna dan profil RIASEC karier.
export function riasecFitScore(user: RiasecScores, career: RiasecScores): number {
  const dot = RIASEC_ORDER.reduce((sum, dim) => sum + user[dim] * career[dim], 0);
  const normUser = Math.sqrt(RIASEC_ORDER.reduce((sum, dim) => sum + user[dim] ** 2, 0));
  const normCareer = Math.sqrt(RIASEC_ORDER.reduce((sum, dim) => sum + career[dim] ** 2, 0));
  return normUser === 0 || normCareer === 0 ? 0 : dot / (normUser * normCareer);
}

// FR-04: skor tiap dimensi = rata-rata jawaban Likert (1-5) pada pernyataan dimensi tsb.
export function scoreAssessment(questions: Question[], answers: Record<number, number>): RiasecScores {
  const sums: Record<RiasecDim, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  const counts: Record<RiasecDim, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const question of questions) {
    const value = answers[question.id];
    if (value === undefined) continue;
    sums[question.dimensi] += value;
    counts[question.dimensi] += 1;
  }
  return Object.fromEntries(
    RIASEC_ORDER.map((dim) => [dim, counts[dim] === 0 ? 0 : sums[dim] / counts[dim]]),
  ) as RiasecScores;
}

// Top N dimensi dengan skor tertinggi; bila seri, urutan R, I, A, S, E, C.
export function topCode(scores: RiasecScores, n = 3): RiasecDim[] {
  return [...RIASEC_ORDER]
    .sort((a, b) => scores[b] - scores[a] || RIASEC_ORDER.indexOf(a) - RIASEC_ORDER.indexOf(b))
    .slice(0, n);
}

// Dimensi dengan kontribusi terbesar pada perkalian titik vektor pengguna dan karier.
export function topContributors(user: RiasecScores, career: RiasecScores, n = 2): RiasecDim[] {
  return [...RIASEC_ORDER].sort((a, b) => user[b] * career[b] - user[a] * career[a]).slice(0, n);
}

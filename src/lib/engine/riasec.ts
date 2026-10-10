import { RIASEC_ORDER } from "@/constants/riasec";
import type { RiasecDim, RiasecScores } from "@/types";

// Top N dimensi; seri diurut R, I, A, S, E, C (SPEC 5, tambahan UI).
export function topCode(scores: RiasecScores, n = 3): RiasecDim[] {
  return [...RIASEC_ORDER]
    .sort((a, b) => scores[b] - scores[a] || RIASEC_ORDER.indexOf(a) - RIASEC_ORDER.indexOf(b))
    .slice(0, n);
}

// SPEC 6.6: dimensi dengan kontribusi terbesar terhadap u · c.
export function topContributors(user: RiasecScores, career: RiasecScores, n = 2): RiasecDim[] {
  return [...RIASEC_ORDER].sort((a, b) => user[b] * career[b] - user[a] * career[a]).slice(0, n);
}

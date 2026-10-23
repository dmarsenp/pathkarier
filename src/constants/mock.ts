import { CAREERS } from "@/constants/careers";
import { rankCareers } from "@/lib/engine/saw";
import type { Recommendation, RiasecScores, UserSkill } from "@/types";

// Data contoh untuk tampilan UI sebelum API (SPEC Bagian 9) tersambung.
export const MOCK_USER = { nama: "Nadia Putri", email: "nadia@kampus.ac.id" };

export const MOCK_ASSESSMENT_DATE = "30 September 2026";

export const MOCK_RIASEC: RiasecScores = { R: 2.8, I: 4.4, A: 4.6, S: 4.0, E: 2.6, C: 3.0 };

export const MOCK_USER_SKILLS: UserSkill[] = [
  { nama: "HTML & CSS", level: "mahir" },
  { nama: "JavaScript", level: "mahir" },
  { nama: "Responsive & cross-browser design", level: "mahir" },
  { nama: "Version control (Git)", level: "mahir" },
  { nama: "Framework frontend (React/Vue/Angular)", level: "dasar" },
  { nama: "Konsumsi REST API", level: "dasar" },
  { nama: "State management", level: "dasar" },
  { nama: "Dasar aksesibilitas & UI", level: "dasar" },
  { nama: "Figma", level: "dasar" },
  { nama: "SQL", level: "dasar" },
];

// Nilai dari fixture uji SPEC 13.1 (w1 = 0,45; w2 = 0,55) — hasil survei 15 praktisi (Subbab 3.2.2).
export const MOCK_WEIGHTS = { minat: 0.45, skill: 0.55 };

// Dihitung oleh engine SAW (Bab 3.3.2.1) dari MOCK_RIASEC + MOCK_USER_SKILLS,
// bukan lagi nilai contoh yang ditulis manual.
export const MOCK_RECOMMENDATIONS: Recommendation[] = rankCareers(CAREERS, MOCK_RIASEC, MOCK_USER_SKILLS, MOCK_WEIGHTS);

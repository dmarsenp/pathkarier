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

// Nilai dari fixture uji SPEC 13.1 (w1 = 0,45; w2 = 0,55).
export const MOCK_WEIGHTS = { minat: 0.45, skill: 0.55 };

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { idKarier: "frontend", peringkat: 1, skorRiasec: 0.942, skorSkill: 0.6492, skorSaw: 0.9816 },
  { idKarier: "ui-ux", peringkat: 2, skorRiasec: 0.9822, skorSkill: 0.55, skorSaw: 0.916 },
  { idKarier: "backend", peringkat: 3, skorRiasec: 0.7928, skorSkill: 0.45, skorSaw: 0.7445 },
  { idKarier: "data-analyst", peringkat: 4, skorRiasec: 0.8292, skorSkill: 0.4, skorSaw: 0.7188 },
  { idKarier: "qa", peringkat: 5, skorRiasec: 0.7564, skorSkill: 0.42, skorSaw: 0.7024 },
];

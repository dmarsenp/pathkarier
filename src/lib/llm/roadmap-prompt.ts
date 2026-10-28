import type { LlmRoadmapInput } from "@/lib/llm/types";

// SPEC 7.7: AI hanya menyusun penjelasan & roadmap setelah peringkat SAW ditentukan.
export const SYSTEM_PROMPT = [
  "Kamu penasihat karier TI yang menyusun penjelasan dan roadmap belajar berbahasa Indonesia.",
  "Peringkat karier sudah ditentukan sistem lain: jangan membuat peringkat, menilai ulang peran, atau menyebut peran lain.",
  "Gunakan HANYA keterampilan dari daftar skill gap, dengan penulisan nama yang persis sama.",
  "Jangan menulis URL, tautan, atau nama situs web apa pun.",
  "Keluarkan HANYA JSON valid sesuai format yang diminta, tanpa teks lain.",
].join(" ");

export const ROADMAP_JSON_SCHEMA = {
  type: "object",
  properties: {
    penjelasan: { type: "array", items: { type: "string" } },
    roadmap: {
      type: "array",
      items: {
        type: "object",
        properties: {
          urutan: { type: "integer" },
          skill: { type: "string" },
          aktivitas: { type: "string" },
          estimasiMinggu: { type: "integer" },
        },
        required: ["urutan", "skill", "aktivitas", "estimasiMinggu"],
      },
    },
    proyekPortofolio: {
      type: "array",
      items: {
        type: "object",
        properties: {
          judul: { type: "string" },
          skillTerkait: { type: "array", items: { type: "string" } },
        },
        required: ["judul", "skillTerkait"],
      },
    },
  },
  required: ["penjelasan", "roadmap", "proyekPortofolio"],
};

const OUTPUT_EXAMPLE = `{
  "penjelasan": ["paragraf 1", "paragraf 2"],
  "roadmap": [{ "urutan": 1, "skill": "<nama persis dari daftar>", "aktivitas": "1 kalimat konkret", "estimasiMinggu": 2 }],
  "proyekPortofolio": [{ "judul": "judul singkat", "skillTerkait": ["<nama persis dari daftar>"] }]
}`;

export function buildUserPrompt({ careerName, riasecFitPercent, skillReadinessPercent, gaps }: LlmRoadmapInput): string {
  const gapList = gaps
    .map((gap) => `- ${gap.nama} (level saat ini: ${gap.level}, bobot kepentingan: ${gap.bobot.toFixed(2)})`)
    .join("\n");

  return `Pengguna mendapat rekomendasi peran "${careerName}".
Kecocokan minat (RIASEC): ${riasecFitPercent}%. Kesiapan skill: ${skillReadinessPercent}%.
Skill yang perlu ditingkatkan, urut dari prioritas tertinggi:
${gapList}

Tugas:
1. "penjelasan": 2 paragraf pendek (maks 2 kalimat per paragraf) tentang mengapa peran ini cocok dan fokus belajar utamanya. Jangan menyebut istilah teknis algoritma.
2. "roadmap": satu langkah untuk tiap skill di atas, mengikuti urutan prioritas (urutan mulai dari 1). "aktivitas" 1 kalimat konkret. "estimasiMinggu" bilangan bulat 1-8.
3. "proyekPortofolio": 2 ide proyek kecil yang relevan, "skillTerkait" berisi nama skill dari daftar.

Format JSON:
${OUTPUT_EXAMPLE}`;
}

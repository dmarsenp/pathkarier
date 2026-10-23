import type { AiRoadmap, SkillGap } from "@/types";

const GEMINI_MODEL = "gemini-flash-latest";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const TIMEOUT_MS = 55000;

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    penjelasan: { type: "ARRAY", items: { type: "STRING" } },
    roadmap: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          urutan: { type: "INTEGER" },
          skill: { type: "STRING" },
          aktivitas: { type: "STRING" },
          estimasiMinggu: { type: "INTEGER" },
        },
        required: ["urutan", "skill", "aktivitas", "estimasiMinggu"],
      },
    },
    proyekPortofolio: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          judul: { type: "STRING" },
          skillTerkait: { type: "ARRAY", items: { type: "STRING" } },
        },
        required: ["judul", "skillTerkait"],
      },
    },
  },
  required: ["penjelasan", "roadmap", "proyekPortofolio"],
};

interface GenerateRoadmapInput {
  careerName: string;
  riasecFitPercent: number;
  skillReadinessPercent: number;
  gaps: SkillGap[];
}

function buildPrompt({ careerName, riasecFitPercent, skillReadinessPercent, gaps }: GenerateRoadmapInput): string {
  const gapList = gaps
    .map((g) => `- ${g.nama} (level saat ini: ${g.level}, bobot kepentingan: ${g.bobot.toFixed(2)})`)
    .join("\n");

  return `Kamu adalah penasihat karier TI. Pengguna mendapat rekomendasi peran "${careerName}" dari sistem pendukung keputusan berbasis SAW (bukan dari kamu — jangan ubah atau sebut peringkat lain).
Kecocokan minat (RIASEC): ${riasecFitPercent}%. Kesiapan skill: ${skillReadinessPercent}%.
Skill yang masih perlu ditingkatkan, diurutkan dari prioritas tertinggi:
${gapList || "- (tidak ada gap signifikan)"}

Tugasmu, dalam Bahasa Indonesia yang ringkas dan memotivasi:
1. "penjelasan": 2 paragraf pendek (maks 2 kalimat tiap paragraf) yang menjelaskan mengapa peran ini cocok dan apa fokus belajar utamanya. Jangan sebut kata "SAW" atau istilah teknis algoritma.
2. "roadmap": urutan belajar untuk tiap skill gap di atas (urutan dimulai dari 1, mengikuti prioritas yang diberikan), masing-masing dengan "aktivitas" konkret (1 kalimat) dan "estimasiMinggu" yang realistis (1-8 minggu per skill).
3. "proyekPortofolio": 2 ide proyek portofolio kecil yang relevan, masing-masing dengan "judul" singkat dan "skillTerkait" (nama-nama skill dari daftar gap yang dipakai).

Balas HANYA dengan JSON sesuai skema yang diberikan.`;
}

// FR-14/FR-15: penjelasan naratif & roadmap pembelajaran dari Generative AI (explanation layer).
// Mengembalikan null bila panggilan gagal/timeout — pemanggil wajib fallback (NFR-06).
export async function generateRoadmapWithGemini(input: GenerateRoadmapInput): Promise<AiRoadmap | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(input) }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
          temperature: 0.6,
        },
      }),
    });

    if (!res.ok) {
      console.error("[gemini] request failed:", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string") {
      console.error("[gemini] unexpected response shape:", JSON.stringify(data).slice(0, 500));
      return null;
    }

    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed.penjelasan) || !Array.isArray(parsed.roadmap) || !Array.isArray(parsed.proyekPortofolio)) {
      console.error("[gemini] parsed JSON missing expected fields:", text.slice(0, 500));
      return null;
    }

    return parsed as AiRoadmap;
  } catch (error) {
    console.error("[gemini] call threw:", error instanceof Error ? error.message : error);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

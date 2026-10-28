import { InvalidLlmOutputError } from "@/lib/llm/types";
import { videoLinkFor } from "@/lib/video-link";
import type { AiRoadmap, PortfolioProject, RoadmapStep, SkillGap } from "@/types";

const MAX_PARAGRAPH = 800;
const MAX_ACTIVITY = 400;
const MAX_TITLE = 150;
const URL_PATTERN = /(https?:\/\/|www\.)/i;

function asText(value: unknown, field: string, maxLength: number): string {
  if (typeof value !== "string" || value.trim() === "") throw new InvalidLlmOutputError(`${field} kosong atau bukan teks`);
  const text = value.trim();
  if (text.length > maxLength) throw new InvalidLlmOutputError(`${field} terlalu panjang`);
  if (URL_PATTERN.test(text)) throw new InvalidLlmOutputError(`${field} memuat URL (dilarang)`);
  return text;
}

function stripCodeFence(raw: string): string {
  return raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
}

interface ValidatedRoadmap {
  roadmap: AiRoadmap;
  // Irisan skill roadmap dengan skill gap, dibagi jumlah skill gap.
  coverage: number;
}

// FR-23: keluaran LLM wajib JSON, memakai skill dari daftar skill gap, tanpa URL, dan dalam batas panjang.
// Nilai yang salah tapi bisa dibetulkan (urutan, estimasi minggu) dirapikan; yang melanggar aturan ditolak.
export function validateRoadmap(raw: string, gaps: SkillGap[]): ValidatedRoadmap {
  let data: unknown;
  try {
    data = JSON.parse(stripCodeFence(raw));
  } catch {
    throw new InvalidLlmOutputError("bukan JSON valid");
  }
  if (typeof data !== "object" || data === null) throw new InvalidLlmOutputError("JSON bukan objek");
  const { penjelasan, roadmap, proyekPortofolio } = data as Record<string, unknown>;
  if (!Array.isArray(penjelasan) || !Array.isArray(roadmap) || !Array.isArray(proyekPortofolio)) {
    throw new InvalidLlmOutputError("field penjelasan/roadmap/proyekPortofolio tidak lengkap");
  }

  const canonical = new Map(gaps.map((gap) => [gap.nama.toLowerCase(), gap.nama]));
  const toCanonical = (value: unknown): string | undefined => (typeof value === "string" ? canonical.get(value.trim().toLowerCase()) : undefined);

  const paragraphs = penjelasan.slice(0, 3).map((item) => asText(item, "penjelasan", MAX_PARAGRAPH));
  if (paragraphs.length === 0) throw new InvalidLlmOutputError("penjelasan kosong");

  const seen = new Set<string>();
  const steps: RoadmapStep[] = [];
  for (const item of roadmap) {
    const entry = item as Record<string, unknown> | null;
    const skill = toCanonical(entry?.skill);
    if (!skill || seen.has(skill)) continue; // skill di luar daftar gap atau dobel: dibuang
    seen.add(skill);
    const weeks = Math.round(Number(entry?.estimasiMinggu));
    steps.push({
      urutan: steps.length + 1,
      skill,
      aktivitas: asText(entry?.aktivitas, "aktivitas", MAX_ACTIVITY),
      estimasiMinggu: Number.isFinite(weeks) ? Math.min(12, Math.max(1, weeks)) : 2,
      ...videoLinkFor(skill),
    });
  }
  if (steps.length === 0) throw new InvalidLlmOutputError("roadmap tidak memuat satu pun skill dari daftar gap");

  const projects: PortfolioProject[] = proyekPortofolio.slice(0, 3).map((item) => {
    const entry = item as Record<string, unknown> | null;
    const related = Array.isArray(entry?.skillTerkait) ? entry.skillTerkait.map(toCanonical).filter((s): s is string => Boolean(s)) : [];
    return { judul: asText(entry?.judul, "judul proyek", MAX_TITLE), skillTerkait: related.length > 0 ? related : [steps[0].skill] };
  });
  if (projects.length === 0) throw new InvalidLlmOutputError("proyek portofolio kosong");

  return { roadmap: { penjelasan: paragraphs, roadmap: steps, proyekPortofolio: projects }, coverage: steps.length / gaps.length };
}

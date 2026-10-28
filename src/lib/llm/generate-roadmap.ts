import { getProviderChain, readMs } from "@/lib/llm/config";
import { buildUserPrompt, ROADMAP_JSON_SCHEMA, SYSTEM_PROMPT } from "@/lib/llm/roadmap-prompt";
import { validateRoadmap } from "@/lib/llm/roadmap-validate";
import type { LlmRoadmapInput } from "@/lib/llm/types";
import type { AiRoadmap } from "@/types";

export interface RoadmapGeneration {
  roadmap: AiRoadmap;
  provider: string;
  model: string;
  latencyMs: number;
  coverage: number;
}

const MIN_REMAINING_MS = 3_000;

// FR-14/FR-15/FR-23: coba tiap model/penyedia berurutan sampai ada keluaran yang valid.
// Mengembalikan null bila semuanya gagal atau waktunya habis: pemanggil wajib fallback (NFR-06).
export async function generateRoadmapWithFallback(input: LlmRoadmapInput): Promise<RoadmapGeneration | null> {
  if (input.gaps.length === 0) return null; // tidak ada skill gap, tidak ada yang perlu disusun AI

  const chain = getProviderChain();
  if (chain.length === 0) {
    console.error("[llm] tidak ada penyedia AI yang dikonfigurasi (isi GEMINI_API_KEY atau GROQ_API_KEY)");
    return null;
  }

  const attemptTimeoutMs = readMs(process.env.LLM_TIMEOUT_MS, 20_000);
  const budgetMs = readMs(process.env.LLM_TOTAL_BUDGET_MS, 50_000);
  const startedAt = Date.now();
  const user = buildUserPrompt(input);

  for (const provider of chain) {
    const remainingMs = budgetMs - (Date.now() - startedAt);
    if (remainingMs < MIN_REMAINING_MS) break;

    const attemptStartedAt = Date.now();
    try {
      const output = await provider.generate({
        system: SYSTEM_PROMPT,
        user,
        jsonSchema: ROADMAP_JSON_SCHEMA,
        timeoutMs: Math.min(attemptTimeoutMs, remainingMs),
      });
      const { roadmap, coverage } = validateRoadmap(output.text, input.gaps);
      console.info("[llm] berhasil", { provider: provider.name, model: output.model, latencyMs: output.latencyMs, coverage });
      return { roadmap, provider: provider.name, model: output.model, latencyMs: output.latencyMs, coverage };
    } catch (error) {
      console.warn("[llm] gagal, mencoba berikutnya", {
        provider: provider.name,
        model: provider.model,
        ms: Date.now() - attemptStartedAt,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }
  return null;
}

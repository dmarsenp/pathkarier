import { createGeminiProvider, createOpenAiCompatibleProvider } from "@/lib/llm/providers";
import type { LlmProvider } from "@/lib/llm/types";

// Model dicek berjalan pada Okt 2026 (lite: 2-4 dtk, flash: 10-17 dtk untuk prompt roadmap ini). Google sering mengganti model, jadi daftar ini bisa diubah lewat env
// GEMINI_MODELS tanpa deploy ulang kode. Hindari alias "-latest": bisa berpindah ke model preview yang lambat.
const DEFAULT_GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-3.6-flash"];
const DEFAULT_ORDER = ["gemini", "groq", "openrouter", "openai"];
const DEFAULT_GROQ_MODEL = "llama-3.3-70b-versatile";

function csv(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

// Urutan percobaan: tiap model/penyedia yang punya API key dicoba bergantian bila yang sebelumnya gagal.
// Penyedia tanpa key dilewati, jadi cukup mengisi env untuk mengaktifkan cadangan.
export function getProviderChain(env: NodeJS.ProcessEnv = process.env): LlmProvider[] {
  const order = csv(env.LLM_PROVIDER_ORDER);
  const chain: LlmProvider[] = [];

  for (const name of order.length > 0 ? order : DEFAULT_ORDER) {
    if (name === "gemini" && env.GEMINI_API_KEY) {
      const models = csv(env.GEMINI_MODELS);
      for (const model of models.length > 0 ? models : DEFAULT_GEMINI_MODELS) {
        chain.push(createGeminiProvider(env.GEMINI_API_KEY, model));
      }
    }
    if (name === "groq" && env.GROQ_API_KEY) {
      chain.push(
        createOpenAiCompatibleProvider({
          name: "groq",
          baseUrl: "https://api.groq.com/openai/v1",
          apiKey: env.GROQ_API_KEY,
          model: env.GROQ_MODEL || DEFAULT_GROQ_MODEL,
          temperature: 0.3,
        }),
      );
    }
    if (name === "openrouter" && env.OPENROUTER_API_KEY && env.OPENROUTER_MODEL) {
      chain.push(
        createOpenAiCompatibleProvider({
          name: "openrouter",
          baseUrl: "https://openrouter.ai/api/v1",
          apiKey: env.OPENROUTER_API_KEY,
          model: env.OPENROUTER_MODEL,
          temperature: 0.3,
        }),
      );
    }
    if (name === "openai" && env.OPENAI_API_KEY && env.OPENAI_MODEL) {
      chain.push(
        createOpenAiCompatibleProvider({
          name: "openai",
          baseUrl: "https://api.openai.com/v1",
          apiKey: env.OPENAI_API_KEY,
          model: env.OPENAI_MODEL,
        }),
      );
    }
  }
  return chain;
}

export function readMs(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

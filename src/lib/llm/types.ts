import type { SkillGap } from "@/types";

export interface LlmRoadmapInput {
  careerName: string;
  riasecFitPercent: number;
  skillReadinessPercent: number;
  gaps: SkillGap[];
}

// Antarmuka penyedia LLM agar Gemini, Groq, atau OpenAI dapat ditukar lewat env.
export interface LlmGenerateInput {
  system: string;
  user: string;
  jsonSchema: Record<string, unknown>;
  timeoutMs: number;
}

export interface LlmGenerateOutput {
  text: string;
  model: string;
  latencyMs: number;
}

export interface LlmProvider {
  name: string;
  model: string;
  generate(input: LlmGenerateInput): Promise<LlmGenerateOutput>;
}

export class LlmError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "LlmError";
  }
}

export class InvalidLlmOutputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidLlmOutputError";
  }
}

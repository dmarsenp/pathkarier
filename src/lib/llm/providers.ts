import { LlmError, type LlmProvider } from "@/lib/llm/types";

interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}

interface ChatResponse {
  choices?: { message?: { content?: string | null } }[];
}

async function postJson(url: string, headers: Record<string, string>, body: unknown, timeoutMs: number): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      const detail = (await res.text().catch(() => "")).slice(0, 200);
      throw new LlmError(`HTTP ${res.status}: ${detail}`, res.status);
    }
    return await res.json();
  } catch (error) {
    if (error instanceof LlmError) throw error;
    if (error instanceof Error && error.name === "AbortError") throw new LlmError(`timeout setelah ${timeoutMs} ms`);
    throw new LlmError(error instanceof Error ? error.message : "kesalahan jaringan");
  } finally {
    clearTimeout(timer);
  }
}

// Gemini memakai tipe huruf besar ("OBJECT") dan tidak mengenal additionalProperties.
function toGeminiSchema(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(toGeminiSchema);
  if (node === null || typeof node !== "object") return node;
  return Object.fromEntries(
    Object.entries(node)
      .filter(([key]) => key !== "additionalProperties")
      .map(([key, value]) => [key, key === "type" && typeof value === "string" ? value.toUpperCase() : toGeminiSchema(value)]),
  );
}

export function createGeminiProvider(apiKey: string, model: string): LlmProvider {
  return {
    name: "gemini",
    model,
    async generate({ system, user, jsonSchema, timeoutMs }) {
      const startedAt = Date.now();
      const data = (await postJson(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        { "x-goog-api-key": apiKey },
        {
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: "user", parts: [{ text: user }] }],
          generationConfig: { responseMimeType: "application/json", responseSchema: toGeminiSchema(jsonSchema), temperature: 0.3 },
        },
        timeoutMs,
      )) as GeminiResponse;
      const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("");
      if (!text) throw new LlmError("respons Gemini kosong");
      return { text, model, latencyMs: Date.now() - startedAt };
    },
  };
}

interface OpenAiCompatibleOptions {
  name: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature?: number;
}

// Berlaku untuk Groq, OpenRouter, OpenAI, Cerebras, dll. yang memakai format /chat/completions.
export function createOpenAiCompatibleProvider({ name, baseUrl, apiKey, model, temperature }: OpenAiCompatibleOptions): LlmProvider {
  return {
    name,
    model,
    async generate({ system, user, timeoutMs }) {
      const startedAt = Date.now();
      const data = (await postJson(
        `${baseUrl}/chat/completions`,
        { Authorization: `Bearer ${apiKey}` },
        {
          model,
          ...(temperature === undefined ? {} : { temperature }),
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        },
        timeoutMs,
      )) as ChatResponse;
      const text = data.choices?.[0]?.message?.content;
      if (!text) throw new LlmError(`respons ${name} kosong`);
      return { text, model, latencyMs: Date.now() - startedAt };
    },
  };
}

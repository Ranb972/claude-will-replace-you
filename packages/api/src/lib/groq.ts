import OpenAI from "openai";
import { ANALYZER_SYSTEM_PROMPT } from "../prompts/analyzer.js";
import { generateLocalFallback } from "./fallback.js";
import type { HumorContent, ProfileInput } from "./types.js";
import type { ScoringResult } from "../types.js";

const MODELS = {
  primary: [
    "meta-llama/llama-4-scout-17b-16e-instruct",
    "llama-3.3-70b-versatile",
  ],
  fallback: "llama-3.1-8b-instant",
} as const;

const PRIMARY_TIMEOUT_MS = 4000;
const FALLBACK_TIMEOUT_MS = 8000;

let requestCounter = 0;

function buildUserMessage(input: ProfileInput, result: ScoringResult): string {
  return JSON.stringify({
    name: input.name,
    role: input.role,
    experience: input.experience,
    description: input.description,
    technologies: input.technologies,
    assignedModel: result.model.name,
    modelKey: result.model.key,
    score: result.score,
    daysLeft: result.daysLeft,
    tier: result.tier,
  });
}

function isRateLimited(err: unknown): boolean {
  return (
    err instanceof Error &&
    "status" in err &&
    (err as { status: number }).status === 429
  );
}

async function callGroq(
  client: OpenAI,
  model: string,
  userMessage: string,
  timeoutMs: number,
): Promise<HumorContent> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await client.chat.completions.create(
      {
        model,
        messages: [
          { role: "system", content: ANALYZER_SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.9,
        max_tokens: 800,
        response_format: { type: "json_object" },
      },
      { signal: controller.signal as any },
    );
  } finally {
    clearTimeout(timeout);
  }

  const text = response.choices[0]?.message?.content || "";
  return JSON.parse(text) as HumorContent;
}

function generatedByLabel(model: string): string {
  if (model.includes("scout")) return "groq-scout";
  if (model.includes("70b")) return "groq-70b";
  return "groq-8b";
}

export async function generateHumorContent(
  input: ProfileInput,
  scoringResult: ScoringResult,
  lang: "en" | "he" = "en",
  gender: "male" | "female" | "other" = "other",
): Promise<{ content: HumorContent; generatedBy: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.log("CWRU: No GROQ_API_KEY, using local fallback");
    const content = generateLocalFallback(input, scoringResult.model.key, lang, gender);
    return { content, generatedBy: "local-fallback" };
  }

  // Wrap entire Groq attempt in try-catch — any failure falls back to local
  try {
    const client = new OpenAI({
      baseURL: "https://api.groq.com/openai/v1",
      apiKey,
    });

    const userMessage = buildUserMessage(input, scoringResult);

    const primaryIndex = requestCounter % MODELS.primary.length;
    requestCounter++;
    const orderedPrimaries = [
      MODELS.primary[primaryIndex],
      MODELS.primary[(primaryIndex + 1) % MODELS.primary.length],
    ];

    for (const model of orderedPrimaries) {
      try {
        const content = await callGroq(client, model, userMessage, PRIMARY_TIMEOUT_MS);
        return { content, generatedBy: generatedByLabel(model) };
      } catch (err) {
        console.log(`CWRU: Groq ${model} failed:`, err instanceof Error ? err.message : err);
        if (!isRateLimited(err)) break; // Non-rate-limit error — skip to fallback
      }
    }

    try {
      const content = await callGroq(client, MODELS.fallback, userMessage, FALLBACK_TIMEOUT_MS);
      return { content, generatedBy: "groq-8b" };
    } catch (err) {
      console.log(`CWRU: Groq fallback failed:`, err instanceof Error ? err.message : err);
    }
  } catch (err) {
    console.log("CWRU: Groq client error, using local fallback:", err instanceof Error ? err.message : err);
  }

  // All Groq attempts failed — local fallback (always works)
  const content = generateLocalFallback(input, scoringResult.model.key, lang, gender);
  return { content, generatedBy: "local-fallback" };
}

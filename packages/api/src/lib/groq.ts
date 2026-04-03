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
  userMessage: string
): Promise<HumorContent> {
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: ANALYZER_SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    temperature: 0.9,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

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
): Promise<{ content: HumorContent; generatedBy: string }> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    const content = generateLocalFallback(
      input,
      scoringResult.model.key,
      lang,
    );
    return { content, generatedBy: "local-fallback" };
  }

  const client = new OpenAI({
    baseURL: "https://api.groq.com/openai/v1",
    apiKey,
  });

  const userMessage = buildUserMessage(input, scoringResult);

  // Round-robin between primary models
  const primaryIndex = requestCounter % MODELS.primary.length;
  requestCounter++;
  const orderedPrimaries = [
    MODELS.primary[primaryIndex],
    MODELS.primary[(primaryIndex + 1) % MODELS.primary.length],
  ];

  // Try primary models in round-robin order
  for (const model of orderedPrimaries) {
    try {
      const content = await callGroq(client, model, userMessage);
      return { content, generatedBy: generatedByLabel(model) };
    } catch (err) {
      if (!isRateLimited(err)) throw err;
    }
  }

  // Both primaries rate limited — try 8B fallback
  try {
    const content = await callGroq(client, MODELS.fallback, userMessage);
    return { content, generatedBy: "groq-8b" };
  } catch (err) {
    if (!isRateLimited(err)) throw err;
  }

  // All Groq models exhausted — local fallback
  const content = generateLocalFallback(input, scoringResult.model.key, lang);
  return { content, generatedBy: "local-fallback" };
}

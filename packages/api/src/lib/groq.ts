/**
 * Groq API Integration with Round-Robin + Fallback Chain
 *
 * Strategy:
 * 1. Round-robin between Scout 17B (1K RPD) ↔ Llama 70B (1K RPD)
 * 2. On 429 from both → Llama 8B (14.4K RPD)
 * 3. On 429 from all → local fallback bank
 *
 * Uses the OpenAI SDK pointed at Groq's endpoint.
 */

import OpenAI from "openai";
import type { ProfileInput, ScoringResult, HumorContent } from "../types.js";
import { buildSystemPrompt, buildUserPrompt } from "../prompts/analyzer.js";
import { generateLocalFallback } from "./fallback.js";

// ---------------------------------------------------------------------------
// Model Configuration
// ---------------------------------------------------------------------------

const PRIMARY_MODELS = [
  "meta-llama/llama-4-scout-17b-16e-instruct", // 1K RPD
  "llama-3.3-70b-versatile",                     // 1K RPD
] as const;

const FALLBACK_MODEL = "llama-3.1-8b-instant"; // 14.4K RPD

const GENERATED_BY: Record<string, string> = {
  "meta-llama/llama-4-scout-17b-16e-instruct": "groq-scout",
  "llama-3.3-70b-versatile": "groq-70b",
  "llama-3.1-8b-instant": "groq-8b",
};

// ---------------------------------------------------------------------------
// Round-Robin State
// ---------------------------------------------------------------------------

let roundRobinIndex = 0;

function getNextPrimaryModel(): string {
  const model = PRIMARY_MODELS[roundRobinIndex % PRIMARY_MODELS.length];
  roundRobinIndex++;
  return model;
}

// ---------------------------------------------------------------------------
// Groq Client (lazy init — env may not be set at import time)
// ---------------------------------------------------------------------------

let _client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: process.env.GROQ_API_KEY ?? "",
      baseURL: "https://api.groq.com/openai/v1",
    });
  }
  return _client;
}

// ---------------------------------------------------------------------------
// Call a single model with timeout + JSON parsing
// ---------------------------------------------------------------------------

interface GroqCallResult {
  content: HumorContent;
  generatedBy: string;
}

async function callModel(
  model: string,
  systemPrompt: string,
  userPrompt: string,
): Promise<GroqCallResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const client = getClient();
    const response = await client.chat.completions.create(
      {
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 800,
        response_format: { type: "json_object" },
      },
      { signal: controller.signal },
    );

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      throw new Error("Empty response from Groq");
    }

    const parsed = JSON.parse(raw) as {
      headline?: string;
      quote?: string;
      skillsAnalysis?: Array<{ skill: string; replaced: boolean; comment: string }>;
    };

    if (!parsed.headline || !parsed.quote || !Array.isArray(parsed.skillsAnalysis)) {
      throw new Error("Invalid JSON structure from Groq");
    }

    return {
      content: {
        headline: parsed.headline,
        quote: parsed.quote,
        skillsAnalysis: parsed.skillsAnalysis,
      },
      generatedBy: GENERATED_BY[model] ?? model,
    };
  } finally {
    clearTimeout(timeout);
  }
}

// ---------------------------------------------------------------------------
// Rate-limit detection
// ---------------------------------------------------------------------------

function isRateLimited(error: unknown): boolean {
  if (error instanceof OpenAI.APIError && error.status === 429) {
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// Main Export
// ---------------------------------------------------------------------------

export async function generateHumorContent(
  input: ProfileInput,
  scoringResult: ScoringResult,
): Promise<{ content: HumorContent; generatedBy: string }> {
  // Skip API calls entirely if no API key is configured
  if (!process.env.GROQ_API_KEY) {
    return {
      content: generateLocalFallback(input, scoringResult),
      generatedBy: "local-fallback",
    };
  }

  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(input, scoringResult);

  // Step 1: Try the first primary model (round-robin)
  const firstModel = getNextPrimaryModel();
  try {
    return await callModel(firstModel, systemPrompt, userPrompt);
  } catch (error) {
    if (!isRateLimited(error)) {
      // Non-429 error — try the other primary before giving up
      console.error(`Groq ${firstModel} error:`, error);
    }
  }

  // Step 2: Try the other primary model
  const secondModel = getNextPrimaryModel();
  try {
    return await callModel(secondModel, systemPrompt, userPrompt);
  } catch (error) {
    if (!isRateLimited(error)) {
      console.error(`Groq ${secondModel} error:`, error);
    }
  }

  // Step 3: Try the high-RPD fallback model
  try {
    return await callModel(FALLBACK_MODEL, systemPrompt, userPrompt);
  } catch (error) {
    console.error(`Groq ${FALLBACK_MODEL} error:`, error);
  }

  // Step 4: All Groq models failed — use local fallback bank
  return {
    content: generateLocalFallback(input, scoringResult),
    generatedBy: "local-fallback",
  };
}

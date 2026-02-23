import { Hono } from "hono";
import { z } from "zod";
import { nanoid } from "nanoid";
import { calculateScore } from "../lib/scoring.js";
import { generateHumorContent } from "../lib/groq.js";

const analyzeSchema = z.object({
  name: z.string().min(1).max(50),
  role: z.string().min(1).max(100),
  experience: z.number().int().min(0).max(40),
  description: z.string().min(20).max(500),
  technologies: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional(),
});

// --- Rate limiting: 5 req/IP/10 min ---
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

interface RateLimitEntry {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitEntry>();

function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    entry.timestamps = entry.timestamps.filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );
    if (entry.timestamps.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}

// Periodic cleanup every 5 minutes
setInterval(cleanupRateLimits, 5 * 60 * 1000);

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry) {
    rateLimitMap.set(ip, { timestamps: [now] });
    return false;
  }

  // Filter out old timestamps
  entry.timestamps = entry.timestamps.filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );

  if (entry.timestamps.length >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.timestamps.push(now);
  return false;
}

// --- Route ---
const analyze = new Hono();

analyze.post("/", async (c) => {
  // Rate limit check
  const ip =
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return c.json(
      { error: "לאט לאט! נסה שוב בעוד כמה דקות 😅" },
      429
    );
  }

  // Validate input
  const body = await c.req.json().catch(() => null);
  const parsed = analyzeSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      400
    );
  }

  const input = parsed.data;

  try {
    // 1. Score algorithmically
    const scoringResult = calculateScore({
      experience: input.experience,
      role: input.role,
      description: input.description,
      technologies: input.technologies,
      hasGithub: !!input.githubUrl,
    });

    // 2. Generate humor content (Groq → fallback chain)
    const { content: humor, generatedBy } = await generateHumorContent(
      {
        name: input.name,
        role: input.role,
        experience: input.experience,
        description: input.description,
        technologies: input.technologies,
        githubUrl: input.githubUrl,
      },
      scoringResult
    );

    // 3. Generate ID
    const id = nanoid(12);

    // 4. TODO: Save to Turso DB (Issue #6 — db.ts not yet implemented)
    // await db.insert(results).values({ id, ...input, ...scoringResult, ...humor, generatedBy });

    // 5. Return result
    const baseUrl = process.env.BASE_URL || "https://claude-will-replace-you.vercel.app";

    return c.json({
      id,
      model: scoringResult.model,
      score: scoringResult.score,
      daysLeft: scoringResult.daysLeft,
      headline: humor.headline,
      quote: humor.quote,
      skillsAnalysis: humor.skillsAnalysis,
      shareUrl: `${baseUrl}/r/${id}`,
      certificateUrl: `${baseUrl}/api/og/${id}`,
      generatedBy,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default analyze;

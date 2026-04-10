import { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { profileInputSchema } from "../types.js";
import { calculateScore } from "../lib/scoring.js";
import { generateHumorContent } from "../lib/groq.js";
import { saveResult } from "../lib/db.js";

const analyze = new Hono();

analyze.post("/", async (c) => {
  // Validate input
  const body = await c.req.json().catch(() => null);
  const parsed = profileInputSchema.safeParse(body);

  if (!parsed.success) {
    return c.json(
      { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
      400,
    );
  }

  const input = parsed.data;

  // 1. Score algorithmically
  const scoringResult = calculateScore({
    experience: input.experience,
    role: input.role,
    description: input.description,
    technologies: input.technologies,
    githubUrl: input.githubUrl,
  });

  // 2. Determine language
  const hasHebrew = /[\u0590-\u05FF]/.test(input.description ?? "");
  const lang = input.lang ?? (hasHebrew ? "he" : "en");
  const gender = (input.gender as "male" | "female" | "other") ?? "other";

  // 3. Generate humor content (Groq → fallback chain)
  const { content: humor, generatedBy } = await generateHumorContent(
    input,
    scoringResult,
    lang as "en" | "he",
    gender,
  );

  // 4. Generate ID + save to DB
  const id = randomBytes(9).toString("base64url").slice(0, 12);

  await saveResult({
    id,
    name: input.name,
    role: input.role,
    experience: input.experience,
    description: input.description,
    technologies: input.technologies,
    githubUrl: input.githubUrl || undefined,
    gender: input.gender || "other",
    showOnLeaderboard: input.showOnLeaderboard ? 1 : 0,
    modelKey: scoringResult.model.key,
    modelName: scoringResult.model.name,
    score: scoringResult.score,
    daysLeft: scoringResult.daysLeft,
    headline: humor.headline,
    quote: humor.quote,
    skillsAnalysis: humor.skillsAnalysis,
    generatedBy,
  });

  // 5. Return result
  const baseUrl =
    process.env.BASE_URL || "https://claude-will-replace-you.vercel.app";

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
});

export default analyze;

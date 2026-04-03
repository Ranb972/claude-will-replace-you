import { Hono } from "hono";
import { nanoid } from "nanoid";
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

  // 2. Determine language: explicit lang field > Hebrew char detection > default "en"
  const hasHebrew = /[\u0590-\u05FF]/.test(input.description);
  const lang = input.lang ?? (hasHebrew ? "he" : "en");

  // 3. Generate humor content (Groq → fallback chain)
  const { content: humor, generatedBy } = await generateHumorContent(
    input,
    scoringResult,
    lang as "en" | "he",
  );

  // 4. Generate ID + save to DB
  const id = nanoid(12);

  await saveResult({
    id,
    name: input.name,
    role: input.role,
    experience: input.experience,
    description: input.description,
    technologies: input.technologies,
    githubUrl: input.githubUrl || undefined,
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

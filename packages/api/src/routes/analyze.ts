import { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { profileInputSchema } from "../types.js";
import { calculateScore } from "../lib/scoring.js";
import { generateHumorContent } from "../lib/groq.js";
import { saveResult } from "../lib/db.js";

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout: ${label} took longer than ${ms}ms`)), ms),
    ),
  ]);
}

const analyze = new Hono();

analyze.post("/", async (c) => {
  try {
    console.log("Step 1: Validating input...");
    const body = await c.req.json().catch(() => null);
    const parsed = profileInputSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        400,
      );
    }

    const input = parsed.data;

    console.log("Step 2: Calculating score...");
    const scoringResult = calculateScore({
      experience: input.experience,
      role: input.role,
      description: input.description,
      technologies: input.technologies,
      githubUrl: input.githubUrl,
    });

    console.log("Step 3: Generating humor...");
    const hasHebrew = /[\u0590-\u05FF]/.test(input.description ?? "");
    const lang = input.lang ?? (hasHebrew ? "he" : "en");
    const gender = (input.gender as "male" | "female" | "other") ?? "other";

    const { content: humor, generatedBy } = await withTimeout(
      generateHumorContent(input, scoringResult, lang as "en" | "he", gender),
      10000,
      "generateHumorContent",
    );

    console.log(`Step 3 done: generatedBy=${generatedBy}`);

    console.log("Step 4: Saving to DB...");
    const id = randomBytes(9).toString("base64url").slice(0, 12);

    await withTimeout(
      saveResult({
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
      }),
      5000,
      "saveResult",
    );

    console.log("Step 5: Returning result...");
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
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: `Analysis failed: ${message}` }, 500);
  }
});

export default analyze;

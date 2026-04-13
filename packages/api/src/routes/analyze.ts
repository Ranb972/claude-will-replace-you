import { Hono } from "hono";
import { randomBytes } from "node:crypto";
import { profileInputSchema } from "../types.js";
import { calculateScore } from "../lib/scoring.js";
import { generateHumorContent } from "../lib/groq.js";
import { saveResult } from "../lib/db.js";

const HANDLER_TIMEOUT = 15000;

const analyze = new Hono();

analyze.post("/", async (c) => {
  console.log("CWRU: Request received");

  // 15-second overall timeout
  const result = await Promise.race([
    handleAnalyze(c),
    new Promise<Response>((resolve) =>
      setTimeout(() => {
        console.error("CWRU: Handler timeout (15s)");
        resolve(c.json({ error: "Analysis timed out. Please try again." }, 504));
      }, HANDLER_TIMEOUT),
    ),
  ]);

  return result;
});

async function handleAnalyze(c: any): Promise<Response> {
  try {
    console.log("CWRU: Validating input...");
    const body = await c.req.json().catch(() => null);
    const parsed = profileInputSchema.safeParse(body);

    if (!parsed.success) {
      return c.json(
        { error: "Invalid input", details: parsed.error.flatten().fieldErrors },
        400,
      );
    }

    const input = parsed.data;
    console.log("CWRU: Input validated");

    console.log("CWRU: Calculating score...");
    const scoringResult = calculateScore({
      experience: input.experience,
      role: input.role,
      description: input.description,
      technologies: input.technologies,
      githubUrl: input.githubUrl,
    });
    console.log(`CWRU: Score calculated: ${scoringResult.score}`);

    console.log("CWRU: Generating humor...");
    const hasHebrew = /[\u0590-\u05FF]/.test(input.description ?? "");
    const lang = input.lang ?? (hasHebrew ? "he" : "en");
    const gender = (input.gender as "male" | "female" | "other") ?? "other";

    const { content: humor, generatedBy } = await generateHumorContent(
      input,
      scoringResult,
      lang as "en" | "he",
      gender,
    );
    console.log(`CWRU: Humor generated via: ${generatedBy}`);

    // Build the response BEFORE DB save — so we can return even if DB fails
    const id = randomBytes(9).toString("base64url").slice(0, 12);
    const baseUrl = process.env.BASE_URL || "";

    const responseData = {
      id,
      model: scoringResult.model,
      score: scoringResult.score,
      daysLeft: scoringResult.daysLeft,
      headline: humor.headline,
      quote: humor.quote,
      skillsAnalysis: humor.skillsAnalysis,
      shareUrl: `${baseUrl}/r/${id}`,
      generatedBy,
    };

    // DB save — best effort, don't block the response
    console.log("CWRU: Saving to DB...");
    try {
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
      console.log("CWRU: DB save success");
    } catch (dbErr) {
      console.error("CWRU: DB save failed (returning result anyway):", dbErr instanceof Error ? dbErr.message : dbErr);
    }

    console.log("CWRU: Response sent");
    return c.json(responseData);
  } catch (err) {
    console.error("CWRU: Unexpected error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return c.json({ error: `Analysis failed: ${message}` }, 500);
  }
}

export default analyze;

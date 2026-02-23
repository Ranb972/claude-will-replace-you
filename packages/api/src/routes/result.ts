import { Hono } from "hono";
import { getResult } from "../lib/db.js";
import { MODEL_TIERS } from "../lib/models.js";

const result = new Hono();

result.get("/:id", async (c) => {
  const { id } = c.req.param();

  const row = await getResult(id);
  if (!row) {
    return c.json({ error: "Result not found" }, 404);
  }

  const model = MODEL_TIERS.find((m) => m.key === row.modelKey) ?? MODEL_TIERS[0];

  return c.json({
    id: row.id,
    model,
    score: row.score,
    daysLeft: row.daysLeft,
    headline: row.headline,
    quote: row.quote,
    skillsAnalysis: row.skillsAnalysis,
    shareUrl: `${process.env.BASE_URL || "https://claude-will-replace-you.vercel.app"}/r/${row.id}`,
    certificateUrl: `${process.env.BASE_URL || "https://claude-will-replace-you.vercel.app"}/api/og/${row.id}`,
    generatedBy: row.generatedBy,
  });
});

export default result;

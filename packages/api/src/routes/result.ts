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

  const baseUrl = process.env.BASE_URL || "";

  return c.json({
    id: row.id,
    model,
    score: row.score,
    daysLeft: row.daysLeft,
    headline: row.headline,
    quote: row.quote,
    skillsAnalysis: row.skillsAnalysis,
    shareUrl: `${baseUrl}/r/${row.id}`,
    generatedBy: row.generatedBy,
  });
});

export default result;

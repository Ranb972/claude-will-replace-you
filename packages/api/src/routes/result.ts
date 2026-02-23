import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db, schema } from "../lib/db";
import { getModelByKey } from "../lib/models";

const app = new Hono();

// GET /api/result/:id — Get single result (for share page / ResultPage)
app.get("/:id", async (c) => {
  const { id } = c.req.param();

  const row = await db
    .select()
    .from(schema.results)
    .where(eq(schema.results.id, id))
    .get();

  if (!row) {
    return c.json({ error: "Result not found" }, 404);
  }

  const model = getModelByKey(row.modelKey);

  return c.json({
    id: row.id,
    name: row.name,
    role: row.role,
    experience: row.experience,
    model: model
      ? {
          key: model.key,
          name: model.name,
          emoji: model.emoji,
          year: model.year,
          exists: model.exists,
          description: model.description,
        }
      : { key: row.modelKey, name: row.modelName },
    score: row.score,
    daysLeft: row.daysLeft,
    headline: row.headline,
    quote: row.quote,
    skillsAnalysis: JSON.parse(row.skillsAnalysis),
    shareUrl: `${getBaseUrl(c)}/r/${row.id}`,
    certificateUrl: `${getBaseUrl(c)}/api/og/${row.id}`,
    generatedBy: row.generatedBy,
    createdAt: row.createdAt,
    shareCount: row.shareCount,
  });
});

function getBaseUrl(c: { req: { url: string } }): string {
  const url = new URL(c.req.url);
  return `${url.protocol}//${url.host}`;
}

export default app;

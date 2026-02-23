import { Hono } from "hono";
import { eq, sql } from "drizzle-orm";
import { db, schema } from "../lib/db";

const VALID_PLATFORMS = ["twitter", "linkedin", "whatsapp", "download"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

const app = new Hono();

// POST /api/result/:id/share — Increment share_count
app.post("/:id/share", async (c) => {
  const { id } = c.req.param();

  let body: { platform?: string };
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON body" }, 400);
  }

  const platform = body.platform as Platform | undefined;
  if (!platform || !VALID_PLATFORMS.includes(platform)) {
    return c.json(
      { error: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}` },
      400
    );
  }

  const row = await db
    .select({ id: schema.results.id })
    .from(schema.results)
    .where(eq(schema.results.id, id))
    .get();

  if (!row) {
    return c.json({ error: "Result not found" }, 404);
  }

  await db
    .update(schema.results)
    .set({ shareCount: sql`${schema.results.shareCount} + 1` })
    .where(eq(schema.results.id, id));

  return c.json({ success: true, platform });
});

export default app;

import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimit } from "./middleware/rate-limit.js";
import analyze from "./routes/analyze.js";
import result from "./routes/result.js";
import share from "./routes/share.js";
import { leaderboard } from "./routes/leaderboard.js";
import og from "./routes/og.js";
import { getResult } from "./lib/db.js";
import { MODEL_TIERS } from "./lib/models.js";

const app = new Hono();

// ---------------------------------------------------------------------------
// CORS — * in dev, deployment URL in production
// ---------------------------------------------------------------------------

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.BASE_URL || "https://claude-will-replace-you.vercel.app"]
    : ["*"];

app.use(
  "/api/*",
  cors({
    origin: allowedOrigins,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  }),
);

// ---------------------------------------------------------------------------
// Global error handler — log + safe 500
// ---------------------------------------------------------------------------

app.onError((err, c) => {
  console.error(`[${c.req.method}] ${c.req.url} — Error:`, err);
  return c.json({ error: "שגיאה פנימית — נסה שוב מאוחר יותר 🤖" }, 500);
});

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Rate limit only on analyze (the expensive / abusable endpoint)
app.use("/api/analyze", rateLimit());
app.route("/api/analyze", analyze);

app.route("/api/result", result);
app.route("/api/result", share);
app.route("/", leaderboard);
app.route("/api/og", og);

// ---------------------------------------------------------------------------
// Share page — minimal HTML with OG meta tags for social crawlers,
// then redirects to the SPA.
// ---------------------------------------------------------------------------

app.get("/r/:id", async (c) => {
  const { id } = c.req.param();
  const row = await getResult(id);

  if (!row) {
    return c.redirect("/");
  }

  const baseUrl =
    process.env.BASE_URL || "https://claude-will-replace-you.vercel.app";
  const model = MODEL_TIERS.find((m) => m.key === row.modelKey);
  const modelName = model?.name ?? row.modelName;

  const title = `${row.name} — ${row.score}% replaceable by ${modelName}`;
  const description = row.headline;
  const ogImage = `${baseUrl}/api/og/${id}`;
  const pageUrl = `${baseUrl}/r/${id}`;
  const spaUrl = `${baseUrl}/result/${id}`;

  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title} | Claude Will Replace You</title>
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:url" content="${pageUrl}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <meta http-equiv="refresh" content="0;url=${spaUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${spaUrl}">${spaUrl}</a>...</p>
</body>
</html>`);
});

// ---------------------------------------------------------------------------
// Dev server (skip on Vercel — the Edge Function entry point handles it)
// ---------------------------------------------------------------------------

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3001;
  console.log(`API server running on http://localhost:${port}`);
  serve({ fetch: app.fetch, port });
}

export default app;

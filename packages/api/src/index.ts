import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimit } from "./middleware/rate-limit.js";
import { checkDb } from "./lib/db.js";
import analyze from "./routes/analyze.js";
import result from "./routes/result.js";
import share from "./routes/share.js";
// import og from "./routes/og.js"; // disabled — @vercel/og hangs on module load
import { leaderboard } from "./routes/leaderboard.js";
import sharePage from "./routes/share-page.js";

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

app.get("/api/health", async (c) => {
  const dbStatus = await checkDb();
  return c.json({
    status: "ok",
    db: dbStatus.ok ? "connected" : `error: ${dbStatus.error}`,
    region: process.env.VERCEL_REGION ?? "local",
  });
});

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Rate limit only on analyze (the expensive / abusable endpoint)
app.use("/api/analyze", rateLimit());
app.route("/api/analyze", analyze);

app.route("/api/result", result);
app.route("/api/result", share);
// app.route("/api/og", og); // disabled — re-enable after deploy works
app.route("/", leaderboard);

// ---------------------------------------------------------------------------
// Share page — minimal HTML with OG meta tags for social crawlers,
// then redirects to the SPA.
// ---------------------------------------------------------------------------

app.route("/r", sharePage);

// ---------------------------------------------------------------------------
// Dev server (skip on Vercel — the Edge Function entry point handles it)
// ---------------------------------------------------------------------------

if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 3001;
  console.log(`API server running on http://localhost:${port}`);
  serve({ fetch: app.fetch, port });
}

export default app;

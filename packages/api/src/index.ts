import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { existsSync } from "fs";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { rateLimit } from "./middleware/rate-limit.js";
import { checkDb } from "./lib/db.js";
import analyze from "./routes/analyze.js";
import result from "./routes/result.js";
import share from "./routes/share.js";
import og from "./routes/og.js";
import { leaderboard } from "./routes/leaderboard.js";
import sharePage from "./routes/share-page.js";

const app = new Hono();

// ---------------------------------------------------------------------------
// CORS — open; API and SPA are same-origin on Render
// ---------------------------------------------------------------------------

app.use(
  "/api/*",
  cors({
    origin: "*",
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
app.route("/api/og", og);
app.route("/", leaderboard);

// ---------------------------------------------------------------------------
// Share page — minimal HTML with OG meta tags for social crawlers,
// then redirects to the SPA.
// ---------------------------------------------------------------------------

app.route("/r", sharePage);

// ---------------------------------------------------------------------------
// Static frontend (production) — mount only if the built SPA exists.
// Registered AFTER API routes so /api/* takes precedence.
// ---------------------------------------------------------------------------

const distPath = "./packages/web/dist";
if (existsSync(distPath)) {
  app.use("/*", serveStatic({ root: distPath }));
  app.get("*", serveStatic({ path: `${distPath}/index.html` }));
}

// ---------------------------------------------------------------------------
// Server — Render provides PORT; bind to 0.0.0.0 so it's reachable.
// ---------------------------------------------------------------------------

const port = Number(process.env.PORT) || 3001;
const hostname = "0.0.0.0";
console.log(`API server running on http://${hostname}:${port}`);
serve({ fetch: app.fetch, port, hostname });

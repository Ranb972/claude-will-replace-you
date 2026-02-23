import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import og from "./routes/og.js";

const app = new Hono();

// CORS for local dev (Vite on 5173 → API on 3001)
app.use(
  "/api/*",
  cors({
    origin: ["http://localhost:5173"],
  })
);

// Health check
app.get("/api/health", (c) => {
  return c.json({ status: "ok" });
});

// OG certificate image generation
app.route("/api/og", og);

const port = 3001;
console.log(`API server running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export default app;

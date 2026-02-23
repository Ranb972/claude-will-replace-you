import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { createOgRoute } from "./routes/og.js";
import type { OgResultRow } from "./routes/og.js";

const app = new Hono();

// CORS for local dev (Vite on 5173 -> API on 3001)
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

// ---------------------------------------------------------------------------
// OG Certificate route
// ---------------------------------------------------------------------------
// TODO: Replace this stub with the real DB query once the database layer lands.
// The stub allows this route to be tested in isolation.
const getResultById = async (_id: string): Promise<OgResultRow | undefined> => {
  // Will be replaced by:  db.select().from(results).where(eq(results.id, id)).get()
  return undefined;
};

const ogRoute = createOgRoute(getResultById);
app.route("/api/og", ogRoute);

// ---------------------------------------------------------------------------

const port = 3001;
console.log(`API server running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });

export default app;

import { Hono } from "hono";
import { cors } from "hono/cors";
import resultRoutes from "./routes/result";
import shareRoutes from "./routes/share";
import sharePage from "./routes/share-page";

const app = new Hono();

// CORS for local dev (SPA on different port)
app.use("/api/*", cors());

// API routes
app.route("/api/result", resultRoutes);
app.route("/api/result", shareRoutes);

// Share page (server-rendered HTML with OG tags)
app.route("/r", sharePage);

// Health check
app.get("/api/health", (c) => c.json({ ok: true }));

export default app;

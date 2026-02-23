import type { MiddlewareHandler } from "hono";

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS = 5;

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Periodic cleanup every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of store) {
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
    if (entry.timestamps.length === 0) {
      store.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function getClientIp(c: Parameters<MiddlewareHandler>[0]): string {
  return (
    c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ||
    c.req.header("x-real-ip") ||
    "unknown"
  );
}

/**
 * Rate limiting middleware: 5 requests per IP per 10 minutes.
 * Applied only to POST /api/analyze.
 */
export function rateLimit(): MiddlewareHandler {
  return async (c, next) => {
    const ip = getClientIp(c);
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry) {
      store.set(ip, { timestamps: [now] });
      return next();
    }

    // Filter stale timestamps
    entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

    if (entry.timestamps.length >= MAX_REQUESTS) {
      return c.json(
        { error: "לאט לאט! נסה שוב בעוד כמה דקות 😅", code: "RATE_LIMITED" },
        429,
      );
    }

    entry.timestamps.push(now);
    return next();
  };
}

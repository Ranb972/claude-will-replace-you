import { Hono } from "hono";
import { ImageResponse } from "@vercel/og";
import { MODEL_COLORS, getModelByKey } from "../lib/models.js";
import { getResult } from "../lib/db.js";

const og = new Hono();

og.get("/:id", async (c) => {
  const id = c.req.param("id");

  let row;
  try {
    row = await getResult(id);
  } catch {
    return createFallbackImage();
  }

  if (!row) {
    return c.json({ error: "Result not found" }, 404);
  }

  try {
    const image = renderCertificate(row);
    return new Response(image.body, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch {
    return createFallbackImage();
  }
});

export default og;

interface CertRow {
  id: string;
  name: string;
  role: string;
  experience: number;
  modelKey: string;
  modelName: string;
  score: number;
  daysLeft: number;
  quote: string;
  createdAt: string | null;
}

function renderCertificate(result: CertRow): ImageResponse {
  const model = getModelByKey(result.modelKey);
  const colors = MODEL_COLORS[result.modelKey] ?? MODEL_COLORS.opus;
  const accent = colors.accent;
  const scorePercent = Math.min(100, Math.max(0, result.score));
  const daysLabel = formatDaysLeft(result.daysLeft);
  const yearLabel = model?.year ? `Expected ${model.year}` : model?.exists ? "Available Now" : "";
  const dateStr = result.createdAt
    ? new Date(result.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const quote = result.quote.length > 110 ? result.quote.slice(0, 107) + "..." : result.quote;

  return new ImageResponse(
    (
      <div style={{
        width: "1200px", height: "630px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", backgroundColor: "#0f0f1a",
        fontFamily: "sans-serif", color: "#e0e0e0", position: "relative", overflow: "hidden",
      }}>
        {/* Accent border */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, border: `2px solid ${accent}40`, display: "flex" }} />

        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "50px 80px", width: "100%", height: "100%" }}>

          {/* Header */}
          <div style={{ display: "flex", fontSize: "14px", fontWeight: 600, color: "#888", letterSpacing: "4px", textTransform: "uppercase" as const, marginBottom: "24px" }}>
            CLAUDE WILL REPLACE YOU
          </div>

          {/* Name */}
          <div style={{ display: "flex", fontSize: "44px", fontWeight: 800, color: "#ffffff", marginBottom: "6px" }}>
            {result.name}
          </div>

          {/* Role */}
          <div style={{ display: "flex", fontSize: "18px", color: "#999", marginBottom: "28px" }}>
            {result.role} - {result.experience} years
          </div>

          {/* Replaced by label */}
          <div style={{ display: "flex", fontSize: "13px", color: "#666", letterSpacing: "2px", textTransform: "uppercase" as const, marginBottom: "8px" }}>
            WILL BE REPLACED BY
          </div>

          {/* Model name */}
          <div style={{ display: "flex", fontSize: "36px", fontWeight: 700, color: accent, marginBottom: "6px" }}>
            {result.modelName}
          </div>

          {/* Year */}
          {yearLabel && (
            <div style={{ display: "flex", fontSize: "13px", color: accent, opacity: 0.7, marginBottom: "24px" }}>
              {yearLabel}
            </div>
          )}
          {!yearLabel && <div style={{ marginBottom: "24px", display: "flex" }} />}

          {/* Score bar */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "440px", marginBottom: "16px" }}>
            <div style={{ display: "flex", width: "380px", height: "14px", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "7px", overflow: "hidden" }}>
              <div style={{ width: `${scorePercent}%`, height: "100%", background: `linear-gradient(90deg, ${accent}, ${accent}cc)`, borderRadius: "7px", display: "flex" }} />
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: accent, marginLeft: "14px", display: "flex" }}>
              {scorePercent}%
            </div>
          </div>

          {/* Days */}
          <div style={{ display: "flex", fontSize: "15px", color: "#aaa", marginBottom: "20px" }}>
            Time remaining: <span style={{ fontWeight: 700, color: "#f59e0b", marginLeft: "6px" }}>{daysLabel}</span>
          </div>

          {/* Quote */}
          <div style={{ display: "flex", fontSize: "14px", color: "#999", fontStyle: "italic", textAlign: "center" as const, maxWidth: "650px", marginBottom: "24px", lineHeight: 1.5 }}>
            "{quote}"
          </div>

          {/* Footer */}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", paddingLeft: "20px", paddingRight: "20px" }}>
            <div style={{ fontSize: "11px", color: "#444", display: "flex" }}>#{result.id} - {dateStr}</div>
            <div style={{ fontSize: "11px", color: "#444", display: "flex" }}>claude-will-replace-you.vercel.app</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

function formatDaysLeft(days: number): string {
  if (days >= 99999) return "Forever";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `~${years} year${years > 1 ? "s" : ""}`;
  }
  return `${days} days`;
}

function createFallbackImage(): Response {
  const fallback = new ImageResponse(
    (
      <div style={{
        width: "1200px", height: "630px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", backgroundColor: "#0f0f1a",
        fontFamily: "sans-serif", color: "#e0e0e0",
      }}>
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#E8734A", marginBottom: "12px", display: "flex" }}>
          Claude Will Replace You
        </div>
        <div style={{ fontSize: "16px", color: "#888", display: "flex" }}>
          Find out which Claude model will take your job
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );

  return new Response(fallback.body, {
    headers: { "Content-Type": "image/png", "Cache-Control": "public, max-age=86400, s-maxage=86400" },
  });
}

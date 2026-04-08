import { Hono } from "hono";
import { ImageResponse } from "@vercel/og";
import { getModelByKey } from "../lib/models.js";
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

function hasHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}

function rtlStyle(text: string): Record<string, string> {
  return hasHebrew(text) ? { direction: "rtl", textAlign: "right" } : {};
}

function renderCertificate(result: CertRow): ImageResponse {
  const model = getModelByKey(result.modelKey);
  const isReal = model?.exists ?? false;
  const scorePercent = Math.min(100, Math.max(0, result.score));
  const daysLabel = formatDaysLeft(result.daysLeft);
  const yearLine = isReal ? "Current Model" : `Expected ${model?.year ?? "TBD"}`;
  const quote = result.quote.length > 100 ? result.quote.slice(0, 97) + "..." : result.quote;
  const infoLine = `${result.name}  -  ${result.role}  -  ${result.experience} years`;

  const gold = "#e8c56d";

  return new ImageResponse(
    (
      <div style={{
        width: "1200px", height: "630px", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0c0c14 0%, #1c1a18 50%, #3d3015 100%)",
        fontFamily: "sans-serif", color: "#e0e0e0",
        padding: "44px 80px",
      }}>

        {/* Top label */}
        <div style={{
          display: "flex", fontSize: "11px", fontWeight: 600,
          color: "rgba(255,255,255,0.3)", letterSpacing: "4px",
          textTransform: "uppercase" as const, marginBottom: "14px",
        }}>
          CLAUDE WILL REPLACE YOU
        </div>

        {/* Name / Role / Years */}
        <div style={{
          display: "flex", fontSize: "13px", color: "rgba(255,255,255,0.45)",
          marginBottom: "28px", ...rtlStyle(infoLine),
        }}>
          {infoLine}
        </div>

        {/* Hero score */}
        <div style={{
          display: "flex", fontSize: "80px", fontWeight: 800,
          color: gold, lineHeight: 1, marginBottom: "6px",
        }}>
          {scorePercent}%
        </div>

        {/* REPLACEABLE label */}
        <div style={{
          display: "flex", fontSize: "13px", fontWeight: 600,
          color: "rgba(255,255,255,0.35)", letterSpacing: "3px",
          textTransform: "uppercase" as const, marginBottom: "28px",
        }}>
          REPLACEABLE
        </div>

        {/* Model card */}
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          backgroundColor: "rgba(232,197,109,0.08)",
          border: "1px solid rgba(232,197,109,0.15)",
          borderRadius: "12px", padding: "14px 32px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "flex", fontSize: "20px", fontWeight: 700, color: gold, marginBottom: "4px" }}>
            {result.modelName}
          </div>
          <div style={{ display: "flex", fontSize: "11px", color: "rgba(255,255,255,0.3)", marginBottom: "3px" }}>
            {yearLine}
          </div>
          <div style={{ display: "flex", fontSize: "12px", color: "rgba(255,255,255,0.35)" }}>
            {daysLabel} left
          </div>
        </div>

        {/* Quote */}
        <div style={{
          display: "flex", fontSize: "12px", color: "rgba(255,255,255,0.35)",
          fontStyle: "italic", textAlign: "center" as const,
          maxWidth: "800px", lineHeight: 1.6,
          marginBottom: "auto",
          ...rtlStyle(quote),
        }}>
          "{quote}"
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", flexDirection: "row",
          justifyContent: "space-between", alignItems: "center",
          width: "100%",
        }}>
          <div style={{ display: "flex", fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>
            claude-will-replace-you.vercel.app
          </div>
          <div style={{ display: "flex", fontSize: "10px", fontWeight: 600, color: gold }}>
            Find out YOUR fate
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
        alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0c0c14 0%, #1c1a18 50%, #3d3015 100%)",
        fontFamily: "sans-serif", color: "#e0e0e0",
      }}>
        <div style={{ fontSize: "28px", fontWeight: 700, color: "#e8c56d", marginBottom: "12px", display: "flex" }}>
          Claude Will Replace You
        </div>
        <div style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", display: "flex" }}>
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

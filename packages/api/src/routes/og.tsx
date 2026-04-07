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

function getBarColor(score: number): string {
  if (score < 30) return "#2dd4bf";
  if (score < 60) return "#f59e0b";
  if (score < 85) return "#E8734A";
  return "#ef4444";
}

function renderCertificate(result: CertRow): ImageResponse {
  const model = getModelByKey(result.modelKey);
  const isReal = model?.exists ?? false;
  const scorePercent = Math.min(100, Math.max(0, result.score));
  const barColor = getBarColor(scorePercent);
  const daysLabel = formatDaysLeft(result.daysLeft);
  const badgeText = isReal ? "Current Model" : `Future Model - ${model?.year ?? "TBD"}`;
  const badgeBg = isReal ? "rgba(45,212,191,0.15)" : "rgba(168,85,247,0.15)";
  const badgeColor = isReal ? "#2dd4bf" : "#c084fc";
  const quote = result.quote.length > 100 ? result.quote.slice(0, 97) + "..." : result.quote;

  const line = { width: "100%", height: "1px", backgroundColor: "rgba(255,255,255,0.06)", display: "flex" as const };

  return new ImageResponse(
    (
      <div style={{
        width: "1200px", height: "630px", display: "flex", flexDirection: "column",
        backgroundColor: "#0f0f1a", fontFamily: "sans-serif", color: "#e0e0e0",
        padding: "40px 56px",
      }}>

        {/* Chat header: avatar + name + timestamp */}
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "16px" }}>
          {/* Orange avatar with C */}
          <div style={{
            width: "44px", height: "44px", borderRadius: "22px", display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "linear-gradient(135deg, #E8734A, #ef4444)",
          }}>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#fff", display: "flex" }}>C</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", marginLeft: "14px", flex: 1 }}>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#fff", display: "flex" }}>Claude</div>
          </div>
          <div style={{ fontSize: "14px", color: "#555", display: "flex" }}>just now</div>
        </div>

        {/* Separator */}
        <div style={line} />

        {/* Greeting */}
        <div style={{ display: "flex", fontSize: "28px", fontWeight: 700, color: "#fff", marginTop: "24px" }}>
          Hey {result.name}!
        </div>
        <div style={{ display: "flex", fontSize: "16px", color: "#999", marginTop: "8px", marginBottom: "20px" }}>
          So about your {result.role} position...
        </div>

        {/* Embedded card */}
        <div style={{
          display: "flex", flexDirection: "column",
          backgroundColor: "#0a0a14", borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "24px 28px",
          marginBottom: "20px",
        }}>
          {/* Card header */}
          <div style={{ display: "flex", fontSize: "11px", fontWeight: 600, color: "#666", letterSpacing: "2px", textTransform: "uppercase" as const, marginBottom: "12px" }}>
            YOUR REPLACEMENT
          </div>

          {/* Model name + badge row */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ display: "flex", fontSize: "26px", fontWeight: 700, color: "#E8734A" }}>
              {result.modelName}
            </div>
            <div style={{
              display: "flex", fontSize: "11px", fontWeight: 600,
              marginLeft: "14px", padding: "3px 10px", borderRadius: "20px",
              backgroundColor: badgeBg, color: badgeColor,
            }}>
              {badgeText}
            </div>
          </div>

          {/* Score bar */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "12px" }}>
            <div style={{
              display: "flex", flex: 1, height: "10px",
              backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "5px", overflow: "hidden",
            }}>
              <div style={{
                width: `${scorePercent}%`, height: "100%",
                backgroundColor: barColor, borderRadius: "5px", display: "flex",
              }} />
            </div>
            <div style={{ display: "flex", fontSize: "18px", fontWeight: 700, color: barColor, marginLeft: "14px" }}>
              {scorePercent}%
            </div>
          </div>

          {/* Days */}
          <div style={{ display: "flex", fontSize: "13px", color: "#aaa" }}>
            Time left: <span style={{ fontWeight: 600, color: "#f59e0b", marginLeft: "4px" }}>{daysLabel}</span>
          </div>
        </div>

        {/* Quote */}
        <div style={{
          display: "flex", fontSize: "15px", color: "#bbb",
          fontStyle: "italic", lineHeight: 1.6, marginBottom: "auto",
        }}>
          "{quote}"
        </div>

        {/* Footer separator */}
        <div style={line} />

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
          <div style={{ display: "flex", fontSize: "12px", color: "#555" }}>
            claude-will-replace-you.vercel.app
          </div>
          <div style={{ display: "flex", fontSize: "13px", fontWeight: 600, color: "#E8734A" }}>
            Find out YOUR fate -&gt;
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
    const rem = days % 365;
    return `~${years} year${years > 1 ? "s" : ""} (${days.toLocaleString()} days)`;
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

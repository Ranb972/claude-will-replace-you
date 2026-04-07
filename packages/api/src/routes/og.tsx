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

function rtlWrap(text: string): { direction?: "rtl"; textAlign?: "right" } {
  return hasHebrew(text) ? { direction: "rtl", textAlign: "right" } : {};
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
  const quote = result.quote.length > 90 ? result.quote.slice(0, 87) + "..." : result.quote;

  const bodyText = `Hey ${result.name}, about your ${result.role} position -- ${result.modelName} is ready to take over. ${scorePercent}% match. You have ${daysLabel} left.`;

  const notifCard = {
    display: "flex" as const,
    flexDirection: "column" as const,
    backgroundColor: "rgba(30,30,55,0.9)",
    borderRadius: "18px",
    padding: "20px 24px",
    width: "100%",
  };

  const notifHeader = {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: "14px",
  };

  return new ImageResponse(
    (
      <div style={{
        width: "1200px", height: "630px", display: "flex", flexDirection: "column",
        backgroundColor: "#0a0a18", fontFamily: "sans-serif", color: "#e0e0e0",
        padding: "0 100px",
        alignItems: "center",
        justifyContent: "center",
      }}>

        {/* Status bar */}
        <div style={{ display: "flex", justifyContent: "center", width: "100%", marginBottom: "28px" }}>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "#fff", display: "flex" }}>9:41</div>
        </div>

        {/* Main notification */}
        <div style={notifCard}>
          {/* Header */}
          <div style={notifHeader}>
            <div style={{
              width: "28px", height: "28px", borderRadius: "14px", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #E8734A, #ef4444)",
            }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#fff", display: "flex" }}>C</div>
            </div>
            <div style={{ display: "flex", fontSize: "14px", fontWeight: 600, color: "#fff", marginLeft: "10px", flex: 1 }}>Claude</div>
            <div style={{ display: "flex", fontSize: "12px", color: "#666" }}>now</div>
          </div>

          {/* Body text */}
          <div style={{ display: "flex", fontSize: "17px", color: "#ddd", lineHeight: 1.5, ...rtlWrap(bodyText) }}>
            {bodyText}
          </div>

          {/* Model + score row */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "14px", gap: "12px" }}>
            <div style={{ display: "flex", fontSize: "20px", fontWeight: 700, color: "#E8734A" }}>
              {result.modelName}
            </div>
            <div style={{
              display: "flex", fontSize: "10px", fontWeight: 600,
              padding: "2px 8px", borderRadius: "12px",
              backgroundColor: badgeBg, color: badgeColor,
            }}>
              {badgeText}
            </div>
          </div>

          {/* Score bar */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: "12px" }}>
            <div style={{
              display: "flex", flex: 1, height: "8px",
              backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden",
            }}>
              <div style={{
                width: `${scorePercent}%`, height: "100%",
                backgroundColor: barColor, borderRadius: "4px", display: "flex",
              }} />
            </div>
            <div style={{ display: "flex", fontSize: "16px", fontWeight: 700, color: barColor, marginLeft: "12px" }}>
              {scorePercent}%
            </div>
          </div>
        </div>

        {/* Second notification — quote */}
        <div style={{ ...notifCard, marginTop: "12px", padding: "16px 24px" }}>
          <div style={notifHeader}>
            <div style={{
              width: "24px", height: "24px", borderRadius: "12px", display: "flex",
              alignItems: "center", justifyContent: "center",
              background: "linear-gradient(135deg, #E8734A, #ef4444)",
            }}>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", display: "flex" }}>C</div>
            </div>
            <div style={{ display: "flex", fontSize: "13px", fontWeight: 600, color: "#fff", marginLeft: "8px", flex: 1 }}>Claude</div>
            <div style={{ display: "flex", fontSize: "11px", color: "#666" }}>now</div>
          </div>
          <div style={{ display: "flex", fontSize: "15px", color: "#bbb", fontStyle: "italic", lineHeight: 1.5, ...rtlWrap(quote) }}>
            "{quote}"
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: "20px" }}>
          <div style={{ display: "flex", fontSize: "12px", color: "#444" }}>
            claude-will-replace-you.vercel.app
          </div>
          <div style={{ display: "flex", fontSize: "12px", fontWeight: 600, color: "#E8734A" }}>
            Find out YOUR fate
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

function formatDaysLeft(days: number): string {
  if (days >= 99999) return "forever";
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
        alignItems: "center", justifyContent: "center", backgroundColor: "#0a0a18",
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

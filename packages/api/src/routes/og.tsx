import { Hono } from "hono";
import { ImageResponse } from "@vercel/og";
import { getResult } from "../lib/db.js";
import { MODEL_TIERS } from "../lib/models.js";

interface ResultRow {
  id: string;
  name: string;
  role: string;
  experience: number;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  modelKey: string;
  modelName: string;
  score: number;
  daysLeft: number;
  headline: string;
  quote: string;
  skillsAnalysis: { skill: string; replaced: boolean; comment: string }[];
  generatedBy: string;
  createdAt: string | null;
  shareCount: number | null;
}

const og = new Hono();

// Color accent by danger level (score ranges)
function getDangerColor(score: number): string {
  if (score >= 85) return "#ef4444"; // red — imminent replacement
  if (score >= 65) return "#f97316"; // orange — high danger
  if (score >= 45) return "#eab308"; // yellow — moderate
  if (score >= 30) return "#22c55e"; // green — relatively safe
  return "#3b82f6"; // blue — very safe
}

function getDangerLabel(score: number): string {
  if (score >= 85) return "CRITICAL";
  if (score >= 65) return "HIGH";
  if (score >= 45) return "MODERATE";
  if (score >= 30) return "LOW";
  return "MINIMAL";
}

function getModelYear(modelKey: string): string | null {
  const model = MODEL_TIERS.find((m) => m.key === modelKey);
  if (!model || model.exists) return null;
  if (model.year === null) return "∞";
  return String(model.year);
}

og.get("/:id", async (c) => {
  const { id } = c.req.param();

  const raw = await getResult(id);
  if (!raw) {
    return c.notFound();
  }
  const result = raw as ResultRow;

  const dangerColor = getDangerColor(result.score);
  const dangerLabel = getDangerLabel(result.score);
  const fictionalYear = getModelYear(result.modelKey);
  const scorePercent = Math.min(100, Math.max(0, result.score));
  const createdDate = result.createdAt
    ? new Date(result.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "N/A";

  // Truncate quote if too long for the image
  const displayQuote =
    result.quote.length > 120
      ? result.quote.slice(0, 117) + "..."
      : result.quote;

  try {
    const image = new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#0f172a",
            fontFamily: "sans-serif",
            padding: "0",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent bar */}
          <div
            style={{
              width: "100%",
              height: "6px",
              backgroundColor: dangerColor,
              display: "flex",
            }}
          />

          {/* Content area */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "32px 48px 24px",
              flex: 1,
            }}
          >
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span style={{ fontSize: "28px" }}>🤖</span>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#f8fafc",
                    letterSpacing: "3px",
                    textTransform: "uppercase" as const,
                  }}
                >
                  OFFICIAL REPLACEMENT CERTIFICATE
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  backgroundColor: dangerColor + "22",
                  border: `1px solid ${dangerColor}`,
                  borderRadius: "6px",
                  padding: "4px 12px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: dangerColor,
                    letterSpacing: "1px",
                  }}
                >
                  THREAT LEVEL: {dangerLabel}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                width: "100%",
                height: "1px",
                backgroundColor: "#334155",
                display: "flex",
                marginBottom: "24px",
              }}
            />

            {/* Name and role */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#f8fafc",
                  lineHeight: 1.2,
                }}
              >
                {result.name}
              </span>
              <span
                style={{
                  fontSize: "18px",
                  color: "#94a3b8",
                  marginTop: "4px",
                }}
              >
                {result.role} · {result.experience}{" "}
                {result.experience === 1 ? "year" : "years"} experience
              </span>
            </div>

            {/* Model + Score row */}
            <div
              style={{
                display: "flex",
                gap: "32px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              {/* Replacing model */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                    marginBottom: "4px",
                  }}
                >
                  Will be replaced by
                </span>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: dangerColor,
                  }}
                >
                  {result.modelName}
                  {fictionalYear ? ` (${fictionalYear})` : ""}
                </span>
              </div>

              {/* Days remaining */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#1e293b",
                  borderRadius: "12px",
                  padding: "12px 24px",
                  minWidth: "140px",
                }}
              >
                <span
                  style={{
                    fontSize: "32px",
                    fontWeight: 700,
                    color: dangerColor,
                  }}
                >
                  {result.daysLeft.toLocaleString()}
                </span>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  days remaining
                </span>
              </div>
            </div>

            {/* Score bar */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    textTransform: "uppercase" as const,
                    letterSpacing: "1px",
                  }}
                >
                  Replacement Probability
                </span>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: dangerColor,
                  }}
                >
                  {scorePercent}%
                </span>
              </div>
              {/* Bar background */}
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "14px",
                  backgroundColor: "#1e293b",
                  borderRadius: "7px",
                  overflow: "hidden",
                }}
              >
                {/* Bar fill */}
                <div
                  style={{
                    width: `${scorePercent}%`,
                    height: "100%",
                    backgroundColor: dangerColor,
                    borderRadius: "7px",
                    display: "flex",
                  }}
                />
              </div>
            </div>

            {/* Quote */}
            <div
              style={{
                display: "flex",
                backgroundColor: "#1e293b",
                borderLeft: `3px solid ${dangerColor}`,
                borderRadius: "0 8px 8px 0",
                padding: "12px 16px",
                marginBottom: "20px",
              }}
            >
              <span
                style={{
                  fontSize: "15px",
                  color: "#cbd5e1",
                  fontStyle: "italic",
                  lineHeight: 1.4,
                }}
              >
                "{displayQuote}"
              </span>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <span style={{ fontSize: "13px", color: "#475569" }}>
                claudewillreplaceyou.com
              </span>
              <span style={{ fontSize: "12px", color: "#334155" }}>
                Certificate #{id} · {createdDate}
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    // Copy headers from ImageResponse and add caching
    const headers = new Headers(image.headers);
    headers.set(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400"
    );
    headers.set("Content-Type", "image/png");

    return new Response(image.body, {
      status: 200,
      headers,
    });
  } catch {
    // Generic fallback image on error
    const fallback = new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: "48px", marginBottom: "16px" }}>🤖</span>
          <span
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#f8fafc",
              marginBottom: "8px",
            }}
          >
            Claude Will Replace You
          </span>
          <span style={{ fontSize: "16px", color: "#94a3b8" }}>
            Find out which AI model will take your job
          </span>
          <span
            style={{
              fontSize: "14px",
              color: "#475569",
              marginTop: "24px",
            }}
          >
            claudewillreplaceyou.com
          </span>
        </div>
      ),
      { width: 1200, height: 630 }
    );

    const headers = new Headers(fallback.headers);
    headers.set(
      "Cache-Control",
      "public, max-age=86400, s-maxage=86400"
    );
    headers.set("Content-Type", "image/png");

    return new Response(fallback.body, {
      status: 200,
      headers,
    });
  }
});

export default og;

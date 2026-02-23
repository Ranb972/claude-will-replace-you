import { Hono } from "hono";
import { ImageResponse } from "@vercel/og";
import { MODEL_COLORS, getModelByKey } from "../lib/models.js";

// Stub type for the DB result row used by this route.
// The actual DB module is provided by the database layer — this route
// only needs these fields from the result row.
export interface OgResultRow {
  id: string;
  name: string;
  role: string;
  experience: number;
  model_key: string;
  model_name: string;
  score: number;
  days_left: number;
  quote: string;
  created_at: string | null;
}

// Dependency: a function that fetches a result row by ID.
// Injected at wire-up time so the route is decoupled from the DB layer.
export type GetResultById = (id: string) => Promise<OgResultRow | undefined>;

export function createOgRoute(getResultById: GetResultById) {
  const og = new Hono();

  og.get("/:id", async (c) => {
    const id = c.req.param("id");

    let result: OgResultRow | undefined;
    try {
      result = await getResultById(id);
    } catch {
      // DB error — return generic fallback image
      return createFallbackImage();
    }

    if (!result) {
      return c.json({ error: "Result not found" }, 404);
    }

    try {
      const image = renderCertificate(result);
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

  return og;
}

// ---------------------------------------------------------------------------
// Certificate renderer
// ---------------------------------------------------------------------------

function renderCertificate(result: OgResultRow): ImageResponse {
  const model = getModelByKey(result.model_key);
  const colors = MODEL_COLORS[result.model_key] ?? MODEL_COLORS.opus;
  const accent = colors.accent;
  const bgColor = colors.bg;

  const yearLabel = model?.year ? `Expected ${model.year}` : model?.exists ? "Available Now" : "";
  const futureEmoji = model?.exists ? "" : " 🔮";
  const daysLabel = formatDaysLeft(result.days_left);
  const scorePercent = Math.min(100, Math.max(0, result.score));
  const dateStr = result.created_at
    ? new Date(result.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  // Truncate quote to fit certificate
  const quote = result.quote.length > 120 ? result.quote.slice(0, 117) + "..." : result.quote;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bgColor,
          fontFamily: "sans-serif",
          color: "#e0e0e0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Border glow */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            border: `3px solid ${accent}`,
            borderRadius: "0px",
            boxShadow: `inset 0 0 60px ${colors.glow}, 0 0 60px ${colors.glow}`,
            display: "flex",
          }}
        />

        {/* Inner border */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            left: "12px",
            right: "12px",
            bottom: "12px",
            border: `1px solid ${accent}40`,
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 60px",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "26px",
              fontWeight: 700,
              color: accent,
              letterSpacing: "3px",
              textTransform: "uppercase" as const,
              marginBottom: "4px",
            }}
          >
            🤖 OFFICIAL REPLACEMENT CERTIFICATE
          </div>

          {/* Divider */}
          <div
            style={{
              width: "500px",
              height: "2px",
              backgroundColor: accent,
              marginBottom: "20px",
              display: "flex",
            }}
          />

          {/* "This certifies that" */}
          <div
            style={{
              fontSize: "16px",
              color: "#888",
              marginBottom: "8px",
              display: "flex",
            }}
          >
            This certifies that
          </div>

          {/* Name */}
          <div
            style={{
              fontSize: "38px",
              fontWeight: 700,
              color: "#ffffff",
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            ★ {result.name} ★
          </div>

          {/* Role + Years */}
          <div
            style={{
              fontSize: "18px",
              color: "#aaa",
              marginBottom: "16px",
              display: "flex",
            }}
          >
            {result.role} • {result.experience} years
          </div>

          {/* "will be officially replaced by" */}
          <div
            style={{
              fontSize: "15px",
              color: "#888",
              marginBottom: "8px",
              display: "flex",
            }}
          >
            will be officially replaced by
          </div>

          {/* Model name */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: 700,
              color: accent,
              marginBottom: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            ✦ {result.model_name}{futureEmoji} ✦
          </div>

          {/* Year label */}
          {yearLabel && (
            <div
              style={{
                fontSize: "14px",
                color: accent,
                opacity: 0.8,
                marginBottom: "14px",
                display: "flex",
              }}
            >
              🔮 {yearLabel}
            </div>
          )}
          {!yearLabel && (
            <div style={{ marginBottom: "14px", display: "flex" }} />
          )}

          {/* Score bar */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "#888",
                marginBottom: "6px",
                display: "flex",
              }}
            >
              Replacement Score:
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "420px",
              }}
            >
              {/* Bar background */}
              <div
                style={{
                  display: "flex",
                  width: "360px",
                  height: "24px",
                  backgroundColor: "#222",
                  borderRadius: "12px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Filled portion */}
                <div
                  style={{
                    width: `${scorePercent}%`,
                    height: "100%",
                    backgroundColor: accent,
                    borderRadius: "12px",
                    display: "flex",
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: accent,
                  marginLeft: "12px",
                  display: "flex",
                }}
              >
                {scorePercent}%
              </div>
            </div>
          </div>

          {/* Days remaining */}
          <div
            style={{
              fontSize: "16px",
              color: "#ccc",
              marginBottom: "12px",
              display: "flex",
            }}
          >
            Days Remaining: <span style={{ fontWeight: 700, color: accent, marginLeft: "6px" }}>{daysLabel}</span>
          </div>

          {/* Quote */}
          <div
            style={{
              fontSize: "15px",
              color: "#bbb",
              fontStyle: "italic",
              textAlign: "center" as const,
              maxWidth: "700px",
              marginBottom: "16px",
              display: "flex",
            }}
          >
            &ldquo;{quote}&rdquo;
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingLeft: "40px",
              paddingRight: "40px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#555", display: "flex" }}>
              Certificate #{result.id} • {dateStr}
            </div>
            <div style={{ fontSize: "12px", color: "#555", display: "flex" }}>
              claude-will-replace-you.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDaysLeft(days: number): string {
  if (days >= 99999) return "♾️";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `~${years} year${years > 1 ? "s" : ""} (${days.toLocaleString()} days)`;
  }
  return `${days}`;
}

function createFallbackImage(): Response {
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
          backgroundColor: "#0a0a0a",
          fontFamily: "sans-serif",
          color: "#e0e0e0",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "16px", display: "flex" }}>
          🤖
        </div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: "#f97316",
            marginBottom: "12px",
            display: "flex",
          }}
        >
          Claude Will Replace You
        </div>
        <div style={{ fontSize: "18px", color: "#888", display: "flex" }}>
          Find out which Claude model will take your job
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );

  return new Response(fallback.body, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

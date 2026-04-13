import { Hono } from "hono";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { getModelByKey } from "../lib/models.js";
import { getResult } from "../lib/db.js";

const og = new Hono();

og.get("/:id", async (c) => {
  const id = c.req.param("id");

  let row;
  try {
    row = await getResult(id);
  } catch {
    return await createFallbackImage();
  }

  if (!row) {
    return c.json({ error: "Result not found" }, 404);
  }

  try {
    const png = await renderCertificate(row);
    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("OG cert render failed:", err);
    return await createFallbackImage();
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

type FontDescriptor = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 700 | 900;
  style: "normal";
};

// Google Fonts serves TTF when the User-Agent looks like an old browser that
// doesn't support WOFF2 — satori only accepts TTF/OTF/WOFF, not WOFF2.
async function fetchGoogleFont(
  family: string,
  weight: number,
): Promise<ArrayBuffer> {
  const cssUrl = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}`;
  const cssRes = await fetch(cssUrl, {
    headers: {
      "User-Agent":
        "Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident/4.0)",
    },
  });
  if (!cssRes.ok) {
    throw new Error(`Google Fonts CSS ${cssRes.status} for ${family} ${weight}`);
  }
  const css = await cssRes.text();
  const match = css.match(/src:\s*url\(([^)]+)\)/);
  if (!match) {
    throw new Error(`No font URL for ${family} ${weight}`);
  }
  const fontRes = await fetch(match[1]);
  if (!fontRes.ok) {
    throw new Error(`Font file ${fontRes.status} for ${family} ${weight}`);
  }
  return fontRes.arrayBuffer();
}

let fontsPromise: Promise<FontDescriptor[]> | null = null;

async function getFonts(): Promise<FontDescriptor[]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetchGoogleFont("Inter", 400),
      fetchGoogleFont("Inter", 700),
      fetchGoogleFont("Inter", 900),
      fetchGoogleFont("Noto Sans Hebrew", 400),
    ])
      .then(
        ([regular, bold, black, hebrew]): FontDescriptor[] => [
          { name: "Inter", data: regular, weight: 400, style: "normal" },
          { name: "Inter", data: bold, weight: 700, style: "normal" },
          { name: "Inter", data: black, weight: 900, style: "normal" },
          {
            name: "Noto Sans Hebrew",
            data: hebrew,
            weight: 400,
            style: "normal",
          },
        ],
      )
      .catch((err) => {
        fontsPromise = null;
        throw err;
      });
  }
  return fontsPromise;
}

function hasHebrew(text: string): boolean {
  return /[\u0590-\u05FF]/.test(text);
}

// Satori renders all text LTR regardless of direction:rtl.
// To make Hebrew readable, reverse the entire string char-by-char
// (so Satori's LTR layout shows Hebrew correctly), then re-reverse
// any English/number runs so they stay readable.
function reverseForSatori(text: string): string {
  if (!hasHebrew(text)) return text;
  const reversed = [...text].reverse().join("");
  return reversed.replace(/[A-Za-z0-9][A-Za-z0-9 ._\-:%\/]*/g, (match) =>
    [...match].reverse().join(""),
  );
}

async function renderCertificate(result: CertRow): Promise<Buffer> {
  const model = getModelByKey(result.modelKey);
  const isReal = model?.exists ?? false;
  const scorePercent = Math.min(100, Math.max(0, result.score));
  const daysLabel = formatDaysLeft(result.daysLeft);
  const yearLine = isReal ? "Current Model" : `Expected ${model?.year ?? "TBD"}`;
  const rawQuote =
    result.quote.length > 120 ? result.quote.slice(0, 117) + "..." : result.quote;
  const quote = reverseForSatori(rawQuote);
  const reversedName = reverseForSatori(result.name);
  const infoLine = `${reversedName}  \u00b7  ${result.role}  \u00b7  ${result.experience} years`;

  const gold = "#e8c56d";

  const svg = await satori(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0c0c14 0%, #1c1a18 50%, #3d3015 100%)",
          fontFamily: "Inter, Noto Sans Hebrew, sans-serif",
          color: "#e0e0e0",
          padding: "44px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            width: "160px",
            height: "1px",
            backgroundColor: "rgba(232,197,109,0.2)",
            marginBottom: "10px",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: "14px",
            fontWeight: 700,
            color: gold,
            letterSpacing: "6px",
            textTransform: "uppercase" as const,
            marginBottom: "10px",
          }}
        >
          CLAUDE WILL REPLACE YOU
        </div>

        <div
          style={{
            display: "flex",
            width: "160px",
            height: "1px",
            backgroundColor: "rgba(232,197,109,0.2)",
            marginBottom: "20px",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: "15px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.75)",
            marginBottom: "36px",
            textAlign: "center" as const,
          }}
        >
          {infoLine}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "84px",
            fontWeight: 900,
            color: gold,
            lineHeight: 1,
            marginBottom: "6px",
          }}
        >
          {scorePercent}%
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "14px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "4px",
            textTransform: "uppercase" as const,
            marginBottom: "32px",
          }}
        >
          REPLACEABLE
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(232,197,109,0.08)",
            border: "1px solid rgba(232,197,109,0.15)",
            borderRadius: "12px",
            padding: "16px 36px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "26px",
              fontWeight: 700,
              color: gold,
              marginBottom: "5px",
            }}
          >
            {result.modelName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "12px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.55)",
              marginBottom: "3px",
            }}
          >
            {yearLine}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "14px",
              fontWeight: 400,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            {daysLabel} left
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: "15px",
            fontWeight: 400,
            color: "rgba(255,255,255,0.65)",
            fontStyle: "italic",
            textAlign: "center" as const,
            maxWidth: "800px",
            lineHeight: 1.6,
            marginBottom: "auto",
          }}
        >
          "{quote}"
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: "11px",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            claude-will-replace-you
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "13px",
              fontWeight: 700,
              color: gold,
            }}
          >
            Find out YOUR fate
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: await getFonts(),
    },
  );

  return new Resvg(svg).render().asPng();
}

function formatDaysLeft(days: number): string {
  if (days >= 99999) return "Forever";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `~${years} year${years > 1 ? "s" : ""}`;
  }
  return `${days} days`;
}

async function createFallbackImage(): Promise<Response> {
  try {
    const svg = await satori(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #0c0c14 0%, #1c1a18 50%, #3d3015 100%)",
            fontFamily: "Inter, sans-serif",
            color: "#e0e0e0",
          }}
        >
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              color: "#e8c56d",
              marginBottom: "12px",
              display: "flex",
            }}
          >
            Claude Will Replace You
          </div>
          <div
            style={{
              fontSize: "16px",
              color: "rgba(255,255,255,0.4)",
              display: "flex",
            }}
          >
            Find out which Claude model will take your job
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: await getFonts(),
      },
    );

    const png = new Resvg(svg).render().asPng();
    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (err) {
    console.error("OG fallback image failed:", err);
    return new Response("Image generation failed", { status: 500 });
  }
}

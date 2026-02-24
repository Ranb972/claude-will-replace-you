import { Hono } from "hono";
import { getResult } from "../lib/db.js";
import { getModelByKey } from "../lib/models.js";

const app = new Hono();

// GET /r/:id — Server-rendered share page with OG meta tags
// Crawlers (Twitter, LinkedIn, WhatsApp) get the meta tags.
// Browsers get a JS redirect to the SPA at /result/:id.
app.get("/:id", async (c) => {
  const { id } = c.req.param();

  const row = await getResult(id);

  if (!row) {
    return c.html(
      `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Not Found</title></head>
<body><p>Result not found.</p></body></html>`,
      404
    );
  }

  const model = getModelByKey(row.modelKey);
  const modelName = model?.name ?? row.modelName;

  const baseUrl = getBaseUrl(c);
  const ogTitle = `${row.name} יוחלף ע״י ${modelName} בעוד ${formatDays(row.daysLeft)}!`;
  const ogDescription = "גלה איזה מודל של Claude יחליף אותך בעבודה 🤖";
  const ogImage = `${baseUrl}/api/og/${row.id}`;
  const ogUrl = `${baseUrl}/r/${row.id}`;
  const spaUrl = `${baseUrl}/result/${row.id}`;

  const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(ogTitle)}</title>

  <!-- OG Meta Tags -->
  <meta property="og:title" content="${escapeAttr(ogTitle)}" />
  <meta property="og:description" content="${escapeAttr(ogDescription)}" />
  <meta property="og:image" content="${escapeAttr(ogImage)}" />
  <meta property="og:url" content="${escapeAttr(ogUrl)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Claude Will Replace You" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeAttr(ogTitle)}" />
  <meta name="twitter:description" content="${escapeAttr(ogDescription)}" />
  <meta name="twitter:image" content="${escapeAttr(ogImage)}" />

  <!-- Redirect to SPA -->
  <meta http-equiv="refresh" content="0;url=${escapeAttr(spaUrl)}" />
</head>
<body>
  <p>Redirecting...</p>
  <p><a href="${escapeAttr(spaUrl)}">Click here if not redirected</a></p>
  <script>window.location.replace(${JSON.stringify(spaUrl)});</script>
</body>
</html>`;

  return c.html(html);
});

function getBaseUrl(c: { req: { url: string } }): string {
  const url = new URL(c.req.url);
  return `${url.protocol}//${url.host}`;
}

function formatDays(days: number): string {
  if (days >= 99999) return "∞";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `${years.toLocaleString("he-IL")} שנים`;
  }
  return `${days.toLocaleString("he-IL")} ימים`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default app;

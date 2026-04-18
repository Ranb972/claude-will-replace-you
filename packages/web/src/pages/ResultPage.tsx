import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ReplacementMeter } from "../components/ReplacementMeter";
import { fetchResult, getErrorMessage, type AnalysisResult } from "../lib/api";
import { useLang } from "../lib/i18n";

function RevealSection({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setRevealed(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <section ref={ref} className={`transition-all duration-500 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"} ${className ?? ""}`} style={style}>
      {children}
    </section>
  );
}

function getModelEmoji(key: string): string {
  return ({ haiku: "\u26A1", sonnet: "\uD83C\uDFAF", opus: "\uD83E\uDDE0", titan: "\uD83D\uDD2E", colossus: "\uD83C\uDF0B", singularity: "\uD83C\uDF00", skynet: "\uD83D\uDC80", infinity: "\u267E\uFE0F" })[key] ?? "\uD83E\uDD16";
}

function getScoreColor(score: number): string {
  if (score < 30) return "#2dd4bf";
  if (score < 55) return "#f59e0b";
  if (score < 80) return "#E8734A";
  return "#ef4444";
}

function isRealModel(key: string): boolean {
  return key === "haiku" || key === "sonnet" || key === "opus";
}

const SKILLS_LIMIT = 6;

const SHARE_LINKS = [
  { key: "twitter", label: "Twitter / X", color: "#000000" },
  { key: "linkedin", label: "LinkedIn", color: "#0A66C2" },
  { key: "whatsapp", label: "WhatsApp", color: "#25D366" },
] as const;

export function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, dir, lang } = useLang();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [result, setResult] = useState<AnalysisResult | null>(
    (location.state as { result?: AnalysisResult })?.result ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!result);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownloadCert() {
    if (!result || downloading) return;
    setDownloading(true);
    try {
      const svgString = generateCertificateSvg(result, lang);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load SVG image"));
        img.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 2400;
      canvas.height = 1260;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 2400, 1260);
      URL.revokeObjectURL(svgUrl);

      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) throw new Error("Canvas toBlob returned null");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `replacement-certificate-${result.id || "cwru"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate generation failed:", err);
      alert(lang === "he" ? "\u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05D9\u05E6\u05D9\u05E8\u05EA \u05D4\u05EA\u05E2\u05D5\u05D3\u05D4" : "Error generating certificate. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    if (result || !id) return;
    setLoading(true);
    fetchResult(id).then(setResult).catch((err) => setError(getErrorMessage(err))).finally(() => setLoading(false));
  }, [id, result]);

  function getDaysMessage(days: number): string {
    if (days >= 99999) return t("result.days.safe");
    if (days <= 7) return t("result.days.packing");
    if (days <= 30) return t("result.days.month");
    if (days <= 180) return t("result.days.runway");
    if (days <= 365) return t("result.days.year");
    if (days <= 1000) return t("result.days.time");
    return t("result.days.retire");
  }

  function formatDays(days: number): { big: string; sub: string } {
    if (days >= 99999) return { big: "\u221E", sub: "Forever safe" };
    const y = Math.floor(days / 365);
    const d = days % 365;
    if (y > 0) return { big: days.toLocaleString(), sub: `~${y} year${y > 1 ? "s" : ""}, ${d} days` };
    return { big: days.toLocaleString(), sub: `${days} day${days > 1 ? "s" : ""}` };
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full animate-pulse" style={{ background: "linear-gradient(135deg, #E8734A, #ef4444)" }} />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-[var(--color-text-muted)]">{error ?? t("result.notfound")}</p>
          <Link to="/" className="inline-block rounded-lg px-5 py-2 text-sm" style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "#d1d5db" }}>
            {t("result.tryagain")}
          </Link>
        </div>
      </div>
    );
  }

  const { model, score, daysLeft, headline, quote, skillsAnalysis } = result;
  const emoji = getModelEmoji(model.key);
  const scoreColor = getScoreColor(score);
  const days = formatDays(daysLeft);

  const shareText = encodeURIComponent(`${model.name} will replace me in ${daysLeft} days (${score}% replaceable)! Find out your fate:`);
  const shareUrl = encodeURIComponent(result.shareUrl);

  function getShareHref(key: string): string {
    if (key === "twitter") return `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    if (key === "linkedin") return `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    return `https://wa.me/?text=${shareText}%20${shareUrl}`;
  }

  const cardSt = { backgroundColor: "rgba(22,22,42,0.5)", border: "1px solid rgba(255,255,255,0.06)" };
  const visibleSkills = showAllSkills ? skillsAnalysis : skillsAnalysis.slice(0, SKILLS_LIMIT);

  return (
    <div className="min-h-screen bg-noise bg-scanline bg-grid">
      <div className="max-w-[800px] mx-auto px-4 py-10 sm:py-14 space-y-6">

        {/* Model hero */}
        <section className="text-center space-y-3 animate-reveal-blur">
          <div className="text-5xl sm:text-6xl">{emoji}</div>
          <p className="font-display text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)]">
            {t("result.assigned")}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold" style={{ color: scoreColor }}>
            {model.name}
          </h1>
          <span className="inline-block text-xs px-3 py-1 rounded-full font-display font-medium"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: isRealModel(model.key) ? "#2dd4bf" : "#c084fc", border: "1px solid rgba(255,255,255,0.06)" }}>
            {isRealModel(model.key) ? t("result.model.current") : `${t("result.model.future")} \u2014 ${model.year}`}
          </span>
          {/* Headline */}
          <div dir={dir} className="max-w-lg mx-auto rounded-lg p-4 mt-2" style={{ ...cardSt, borderLeft: dir === "ltr" ? `3px solid ${scoreColor}` : undefined, borderRight: dir === "rtl" ? `3px solid ${scoreColor}` : undefined }}>
            <p className="text-base sm:text-lg text-gray-200 font-medium">{headline}</p>
          </div>
        </section>

        {/* Score + Days side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RevealSection className="rounded-2xl p-5 sm:p-6" style={cardSt}>
            <p className="font-display text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] mb-4">{t("result.score.title")}</p>
            <ReplacementMeter score={score} />
            <div className="flex justify-between text-xs text-[var(--color-text-muted)] mt-2 px-0.5">
              <span>{t("result.score.safe")}</span>
              <span>{t("result.score.doomed")}</span>
            </div>
          </RevealSection>

          <RevealSection className="rounded-2xl p-5 sm:p-6 flex flex-col justify-between" style={cardSt}>
            <p className="font-display text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] mb-4">{t("result.days.title")}</p>
            <div>
              <p className="font-mono text-4xl sm:text-5xl font-bold tabular-nums" style={{ color: "#f59e0b" }}>{days.big}</p>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">{days.sub}</p>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-3">{getDaysMessage(daysLeft)}</p>
          </RevealSection>
        </div>

        {/* Quote */}
        <RevealSection className="rounded-2xl p-5 sm:p-6" style={{ ...cardSt, borderLeft: "3px solid #E8734A" }}>
          <blockquote dir={dir} className="text-base sm:text-lg text-gray-200 italic leading-relaxed">
            &ldquo;{quote}&rdquo;
          </blockquote>
          <p className="font-display text-xs text-[var(--color-text-muted)] mt-3">&mdash; {model.name}</p>
        </RevealSection>

        {/* Skills */}
        {skillsAnalysis.length > 0 && (
          <RevealSection className="rounded-2xl p-5 sm:p-6 space-y-3" style={cardSt}>
            <p className="font-display text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)]">{t("result.skills.title")}</p>
            <ul className="space-y-2">
              {visibleSkills.map((s, i) => (
                <li key={i} className="flex items-center gap-3 py-2 animate-stagger-in" style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.replaced ? "#E8734A" : "#2dd4bf" }} />
                  <span className="font-mono text-sm text-white">{s.skill}</span>
                  <span className="text-xs px-2 py-0.5 rounded font-display"
                    style={{ backgroundColor: s.replaced ? "rgba(232,115,74,0.1)" : "rgba(45,212,191,0.1)", color: s.replaced ? "#E8734A" : "#2dd4bf" }}>
                    {s.replaced ? t("result.skills.replaced") : t("result.skills.safe")}
                  </span>
                  <span className="text-xs text-[var(--color-text-muted)] ml-auto hidden sm:block truncate max-w-[200px]">{s.comment}</span>
                </li>
              ))}
            </ul>
            {skillsAnalysis.length > SKILLS_LIMIT && (
              <button onClick={() => setShowAllSkills((v) => !v)}
                className="text-sm text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer">
                {showAllSkills ? t("result.skills.less") : t("result.skills.more", { n: skillsAnalysis.length - SKILLS_LIMIT })}
              </button>
            )}
          </RevealSection>
        )}

        {/* Share */}
        <RevealSection className="space-y-4">
          <div className="text-center" dir={dir}>
            <p className="font-display text-sm font-semibold text-white">{t("result.share.title")}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{t("result.share.subtitle")}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {SHARE_LINKS.map((s) => (
              <a key={s.key} href={getShareHref(s.key)} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer"
                style={{ backgroundColor: s.color }}>
                {s.label}
              </a>
            ))}
          </div>

          <button onClick={handleDownloadCert} disabled={downloading}
            className="flex items-center justify-center w-full rounded-lg py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/5 cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            style={{ color: "#E8734A", border: "1px solid rgba(232,115,74,0.3)" }}>
            {downloading ? "..." : t("result.cert")}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <Link to="/leaderboard" className="flex items-center justify-center rounded-lg py-2.5 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {t("result.leaderboard")}
            </Link>
            <button onClick={() => navigate("/")}
              className="flex items-center justify-center rounded-lg py-2.5 text-sm text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              {t("result.tryagain")}
            </button>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Pure SVG certificate generator — no DOM capture, no external libraries.
// SVG string → Image → Canvas → PNG download.
// ---------------------------------------------------------------------------

const FONT = "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, system-ui, sans-serif";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateCertificateSvg(
  result: AnalysisResult,
  lang: "en" | "he",
): string {
  const gold = "#e8c56d";
  const score = Math.min(100, Math.max(0, result.score));
  const name = escapeXml((result.name ?? "").trim());
  const role = escapeXml((result.role ?? "").trim());
  const experience = result.experience;
  const isReal = isRealModel(result.model.key);
  const yearLine = escapeXml(
    isReal ? "Current Model" : `Expected ${result.model.year ?? "TBD"}`,
  );
  const daysLabel = escapeXml(formatDaysLeftLabel(result.daysLeft));
  const modelName = escapeXml(result.model.name);

  // Quote: single-language fix
  let displayQuote = result.quote;
  if (lang === "en") {
    displayQuote = displayQuote
      .replace(/[\u0590-\u05FF]+/g, "you")
      .replace(/\s{2,}/g, " ");
  }
  if (displayQuote.length > 140) {
    displayQuote = displayQuote.slice(0, 137) + "...";
  }
  displayQuote = escapeXml(displayQuote);

  // Info line
  const expText =
    experience != null && experience > 0
      ? lang === "he"
        ? `${experience} \u05E9\u05E0\u05D5\u05EA \u05E0\u05D9\u05E1\u05D9\u05D5\u05DF`
        : `${experience} year${experience !== 1 ? "s" : ""} experience`
      : "";
  const infoParts = [name, role, escapeXml(expText)].filter(Boolean);
  const infoLine = infoParts.join("  \u00B7  ");

  // Hebrew text attributes — direction="rtl" sets base direction for BiDi algorithm
  const heDir = lang === "he" ? ` xml:lang="he" direction="rtl"` : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0c14"/>
      <stop offset="50%" stop-color="#1c1a18"/>
      <stop offset="100%" stop-color="#3d3015"/>
    </linearGradient>
    <radialGradient id="medalGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1a1a24"/>
      <stop offset="100%" stop-color="#0c0c14"/>
    </radialGradient>
    <pattern id="dots1" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.8" fill="${gold}"/>
    </pattern>
    <pattern id="dots2" x="10" y="10" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="0.8" fill="${gold}"/>
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#dots1)" opacity="0.04"/>
  <rect width="1200" height="630" fill="url(#dots2)" opacity="0.04"/>

  <!-- CWRU Medallion -->
  <circle cx="600" cy="80" r="40" fill="url(#medalGrad)" stroke="${gold}" stroke-width="2"/>
  <circle cx="600" cy="80" r="34" fill="none" stroke="${gold}" stroke-opacity="0.4" stroke-width="1"/>
  <text x="600" y="87" text-anchor="middle" fill="${gold}" font-family="${FONT}" font-size="18" font-weight="700" letter-spacing="1.8">CWRU</text>

  <!-- Separator 1 -->
  <line x1="520" y1="128" x2="680" y2="128" stroke="${gold}" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Title -->
  <text x="600" y="150" text-anchor="middle" fill="${gold}" font-family="${FONT}" font-size="14" font-weight="700" letter-spacing="6">CLAUDE WILL REPLACE YOU</text>

  <!-- Separator 2 -->
  <line x1="520" y1="164" x2="680" y2="164" stroke="${gold}" stroke-opacity="0.2" stroke-width="1"/>

  <!-- Info line -->
  <text x="600" y="200"${heDir} text-anchor="middle" fill="#b0b0b0" font-family="${FONT}" font-size="13">${infoLine}</text>

  <!-- Score -->
  <text x="600" y="340" text-anchor="middle" fill="${gold}" font-family="${FONT}" font-size="140" font-weight="900" letter-spacing="-5">${score}%</text>

  <!-- REPLACEABLE -->
  <text x="600" y="400" text-anchor="middle" fill="#ffffff" fill-opacity="0.5" font-family="${FONT}" font-size="11" font-weight="700" letter-spacing="4">REPLACEABLE</text>

  <!-- Model card -->
  <rect x="425" y="425" width="350" height="100" rx="10" fill="${gold}" fill-opacity="0.06" stroke="${gold}" stroke-opacity="0.25" stroke-width="1.5"/>
  <text x="600" y="460" text-anchor="middle" fill="${gold}" font-family="${FONT}" font-size="22" font-weight="700">${modelName}</text>
  <text x="600" y="480" text-anchor="middle" fill="#ffffff" fill-opacity="0.5" font-family="${FONT}" font-size="11">${yearLine}</text>
  <text x="600" y="498" text-anchor="middle" fill="#ffffff" fill-opacity="0.55" font-family="${FONT}" font-size="12">${daysLabel} left</text>

  <!-- Quote -->
  <text x="600" y="560"${heDir} text-anchor="middle" fill="#ffffff" fill-opacity="0.6" font-family="${FONT}" font-size="14" font-style="italic">\u201C${displayQuote}\u201D</text>

  <!-- Certification stamp -->
  <circle cx="1100" cy="505" r="47.5" fill="none" stroke="${gold}" stroke-opacity="0.35" stroke-width="2"/>
  <circle cx="1100" cy="505" r="41" fill="none" stroke="${gold}" stroke-opacity="0.25" stroke-width="1"/>
  <text x="1100" y="492" text-anchor="middle" fill="${gold}" fill-opacity="0.6" font-family="${FONT}" font-size="7" font-weight="700" letter-spacing="1.5">CERTIFIED</text>
  <line x1="1080" y1="496" x2="1120" y2="496" stroke="${gold}" stroke-opacity="0.2" stroke-width="0.5"/>
  <text x="1100" y="505" text-anchor="middle" fill="${gold}" fill-opacity="0.6" font-family="${FONT}" font-size="6" font-weight="600">ANTHROPIC</text>
  <text x="1100" y="513" text-anchor="middle" fill="${gold}" fill-opacity="0.6" font-family="${FONT}" font-size="6" font-weight="600">REPLACEMENT DEPT</text>
  <line x1="1080" y1="517" x2="1120" y2="517" stroke="${gold}" stroke-opacity="0.2" stroke-width="0.5"/>
  <text x="1100" y="526" text-anchor="middle" fill="${gold}" fill-opacity="0.6" font-family="${FONT}" font-size="7" font-weight="700" letter-spacing="1.5">EST. 2026</text>

  <!-- Footer -->
  <text x="80" y="600" fill="#ffffff" fill-opacity="0.3" font-family="${FONT}" font-size="11">claude-will-replace-you</text>
  <text x="1100" y="600" text-anchor="middle" fill="${gold}" font-family="${FONT}" font-size="13" font-weight="700">Find out YOUR fate</text>

  <!-- Disclaimer -->
  <text x="600" y="620" text-anchor="middle" fill="#ffffff" fill-opacity="0.25" font-family="${FONT}" font-size="9">This certificate is a parody. No actual replacement has been scheduled. Probably.</text>
</svg>`;
}

function formatDaysLeftLabel(days: number): string {
  if (days >= 99999) return "Forever";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `~${years} year${years > 1 ? "s" : ""}`;
  }
  return `${days} days`;
}

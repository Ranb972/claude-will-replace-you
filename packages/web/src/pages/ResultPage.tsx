import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef, type ReactNode } from "react";
import html2canvas from "html2canvas";
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
  return ({ haiku: "⚡", sonnet: "🎯", opus: "🧠", titan: "🔮", colossus: "🌋", singularity: "🌀", skynet: "💀", infinity: "♾️" })[key] ?? "🤖";
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
  const { t, dir } = useLang();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [result, setResult] = useState<AnalysisResult | null>(
    (location.state as { result?: AnalysisResult })?.result ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!result);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  async function handleDownloadCert() {
    if (!certRef.current || downloading) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: null,
        scale: 2,
        width: 1200,
        height: 630,
        useCORS: true,
        logging: false,
      });
      const blob: Blob | null = await new Promise((resolve) =>
        canvas.toBlob((b) => resolve(b), "image/png"),
      );
      if (!blob) throw new Error("Canvas toBlob returned null");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `replacement-certificate-${id ?? "cwru"}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Certificate download failed:", err);
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
    if (days >= 99999) return { big: "∞", sub: "Forever safe" };
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
            {isRealModel(model.key) ? t("result.model.current") : `${t("result.model.future")} — ${model.year}`}
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
          <p className="font-display text-xs text-[var(--color-text-muted)] mt-3">— {model.name}</p>
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

      <CertificateTemplate innerRef={certRef} result={result} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// CertificateTemplate — off-screen 1200x630 div captured by html2canvas.
// Inline styles only (Tailwind breakpoints would interfere at fixed size).
// ---------------------------------------------------------------------------

function CertificateTemplate({
  innerRef,
  result,
}: {
  innerRef: React.RefObject<HTMLDivElement | null>;
  result: AnalysisResult;
}) {
  const gold = "#e8c56d";
  const score = Math.min(100, Math.max(0, result.score));
  const name = (result.name ?? "").trim();
  const role = result.model.name;
  const isReal = isRealModel(result.model.key);
  const yearLine = isReal
    ? "Current Model"
    : `Expected ${result.model.year ?? "TBD"}`;
  const daysLabel = formatDaysLeftLabel(result.daysLeft);
  const quote =
    result.quote.length > 140
      ? result.quote.slice(0, 137) + "..."
      : result.quote;
  const infoParts = [name, role].filter(Boolean);
  const infoLine = infoParts.join("  \u00b7  ");

  return (
    <div
      ref={innerRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "1200px",
        height: "630px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #0c0c14 0%, #1c1a18 50%, #3d3015 100%)",
        fontFamily: "Inter, system-ui, -apple-system, sans-serif",
        color: "#e0e0e0",
        padding: "44px 80px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "160px",
          height: "1px",
          backgroundColor: "rgba(232,197,109,0.2)",
          marginBottom: "10px",
        }}
      />

      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: gold,
          letterSpacing: "6px",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        CLAUDE WILL REPLACE YOU
      </div>

      <div
        style={{
          width: "160px",
          height: "1px",
          backgroundColor: "rgba(232,197,109,0.2)",
          marginBottom: "20px",
        }}
      />

      <div
        style={{
          fontSize: "15px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.75)",
          marginBottom: "36px",
          textAlign: "center",
        }}
      >
        {infoLine}
      </div>

      <div
        style={{
          fontSize: "84px",
          fontWeight: 900,
          color: gold,
          lineHeight: 1,
          marginBottom: "6px",
        }}
      >
        {score}%
      </div>

      <div
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.55)",
          letterSpacing: "4px",
          textTransform: "uppercase",
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
            fontSize: "26px",
            fontWeight: 700,
            color: gold,
            marginBottom: "5px",
          }}
        >
          {result.model.name}
        </div>
        <div
          style={{
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
          fontSize: "15px",
          fontWeight: 400,
          color: "rgba(255,255,255,0.65)",
          fontStyle: "italic",
          textAlign: "center",
          maxWidth: "800px",
          lineHeight: 1.6,
          marginBottom: "auto",
        }}
      >
        &ldquo;{quote}&rdquo;
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
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
          claude-will-replace-you
        </div>
        <div
          style={{
            fontSize: "13px",
            fontWeight: 700,
            color: gold,
          }}
        >
          Find out YOUR fate
        </div>
      </div>
    </div>
  );
}

function formatDaysLeftLabel(days: number): string {
  if (days >= 99999) return "Forever";
  if (days >= 365) {
    const years = Math.floor(days / 365);
    return `~${years} year${years > 1 ? "s" : ""}`;
  }
  return `${days} days`;
}

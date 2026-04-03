import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { ReplacementMeter } from "../components/ReplacementMeter";
import { fetchResult, getErrorMessage, type AnalysisResult } from "../lib/api";
import { useLang } from "../lib/i18n";

// ── Scroll-reveal wrapper ──

function RevealSection({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`transition-all duration-700 ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"} ${className ?? ""}`}
      style={style}
    >
      {children}
    </section>
  );
}

// ── Helpers ──

function getModelEmoji(key: string): string {
  const emojis: Record<string, string> = {
    haiku: "⚡", sonnet: "🎯", opus: "🧠", titan: "🔮",
    colossus: "🌋", singularity: "🌀", skynet: "💀", infinity: "♾️",
  };
  return emojis[key] ?? "🤖";
}

function getScoreColor(score: number): string {
  if (score < 30) return "#2dd4bf";
  if (score < 55) return "#f59e0b";
  if (score < 80) return "#E8734A";
  return "#ef4444";
}

const SKILLS_COLLAPSED_LIMIT = 8;

// ── Component ──

export function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t, dir } = useLang();

  const [result, setResult] = useState<AnalysisResult | null>(
    (location.state as { result?: AnalysisResult })?.result ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!result);
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [showScoreExplainer, setShowScoreExplainer] = useState(false);

  useEffect(() => {
    if (result || !id) return;
    setLoading(true);
    fetchResult(id)
      .then(setResult)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-grid" style={{ backgroundColor: "#08080c" }}>
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🤖</div>
          <p className="text-[var(--color-text-muted)] font-mono">{t("result.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-grid" style={{ backgroundColor: "#08080c" }}>
        <div className="text-center space-y-4">
          <div className="text-5xl">😵</div>
          <p dir={dir} className="text-red-300 max-w-sm mx-auto">
            {error ?? t("result.notfound")}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 rounded-xl px-6 py-2 text-sm font-mono transition-colors"
            style={{ backgroundColor: "#1a1a2e", color: "#d1d5db" }}
          >
            {t("result.tryagain")}
          </Link>
        </div>
      </div>
    );
  }

  const { model, score, daysLeft, headline, quote, skillsAnalysis } = result;
  const emoji = getModelEmoji(model.key);
  const scoreColor = getScoreColor(score);

  const shareText = encodeURIComponent(
    `${emoji} ${model.name} will replace me in ${daysLeft} days (${score}% replaceable)! Find out your fate:`,
  );
  const shareUrl = encodeURIComponent(result.shareUrl);

  const cardStyle = {
    backgroundColor: "#0f0f17",
    border: "1px solid #1a1a2e",
  };

  const hasExtraSkills = skillsAnalysis.length > SKILLS_COLLAPSED_LIMIT;
  const visibleSkills = showAllSkills ? skillsAnalysis : skillsAnalysis.slice(0, SKILLS_COLLAPSED_LIMIT);

  return (
    <div className="min-h-screen text-white bg-noise bg-scanline bg-grid" style={{ backgroundColor: "#08080c" }}>
      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 800, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, ${scoreColor}12 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto px-4 py-12 sm:py-16 space-y-8">

        {/* Model Card */}
        <section className="text-center space-y-4 animate-reveal-scale">
          <div className="text-6xl sm:text-7xl animate-float">{emoji}</div>

          <div className="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
            {t("result.assigned")}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold" style={{ color: scoreColor }}>
            {model.name}
          </h1>

          {!model.exists && model.year && (
            <span
              className="inline-block font-mono text-xs px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(232,115,74,0.1)", color: "#E8734A", border: "1px solid rgba(232,115,74,0.3)" }}
            >
              🔮 {t("result.expected")} {model.year}
            </span>
          )}

          {/* Headline */}
          <div
            dir={dir}
            className="max-w-lg mx-auto rounded-lg p-4"
            style={{ borderRight: dir === "rtl" ? `3px dashed ${scoreColor}` : undefined, borderLeft: dir === "ltr" ? `3px dashed ${scoreColor}` : undefined, backgroundColor: "rgba(15,15,23,0.6)" }}
          >
            <p className="text-lg sm:text-xl text-gray-200 font-medium font-display">
              {headline}
            </p>
          </div>
        </section>

        {/* Replacement Meter */}
        <RevealSection className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="font-mono text-xs font-semibold text-[var(--color-accent)] uppercase tracking-[0.15em]">
              {t("result.risk")}
            </h2>
            <button
              onClick={() => setShowScoreExplainer((v) => !v)}
              className="font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-accent)] transition-colors cursor-pointer underline underline-offset-2"
            >
              {t("result.explain")}
            </button>
          </div>

          {showScoreExplainer && (
            <div
              dir={dir}
              className="mb-5 rounded-lg p-4 text-sm space-y-1.5 font-display"
              style={{ backgroundColor: "rgba(26,26,40,0.7)", border: "1px dashed #2a2a3a" }}
            >
              <p><span className="text-[#2dd4bf] font-bold">0-30%</span> — {t("result.explain.0")}</p>
              <p><span className="text-[#f59e0b] font-bold">30-60%</span> — {t("result.explain.1")}</p>
              <p><span className="text-[#E8734A] font-bold">60-85%</span> — {t("result.explain.2")}</p>
              <p><span className="text-[#ef4444] font-bold">85-100%</span> — {t("result.explain.3")}</p>
            </div>
          )}

          <ReplacementMeter score={score} />
        </RevealSection>

        {/* Days Countdown */}
        <RevealSection className="rounded-2xl p-6 sm:p-8 text-center space-y-2" style={cardStyle}>
          <p className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-[0.15em] font-semibold">
            {t("result.days.title")}
          </p>
          <p
            className="font-mono text-5xl sm:text-6xl font-bold tabular-nums"
            style={{ color: scoreColor, textShadow: `0 0 30px ${scoreColor}40` }}
          >
            {daysLeft >= 99999 ? "♾️" : daysLeft.toLocaleString()}
          </p>
          <p className="text-[var(--color-text-muted)] text-sm font-display">
            {getDaysMessage(daysLeft)}
          </p>
        </RevealSection>

        {/* Skills Analysis */}
        {skillsAnalysis.length > 0 && (
          <RevealSection className="rounded-2xl p-6 sm:p-8 space-y-4" style={cardStyle}>
            <h2 className="font-mono text-xs font-semibold text-[var(--color-accent)] uppercase tracking-[0.15em]">
              {t("result.skills.title")}
            </h2>
            <ul className="space-y-3">
              {visibleSkills.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{
                    backgroundColor: "rgba(26,26,40,0.5)",
                    borderLeft: `3px solid ${s.replaced ? "#E8734A" : "#2dd4bf"}`,
                  }}
                >
                  <span className="font-mono text-xs mt-1 shrink-0 font-bold" style={{ color: s.replaced ? "#E8734A" : "#2dd4bf" }}>
                    {s.replaced ? t("result.skills.replaced") : t("result.skills.safe")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white font-display">{s.skill}</p>
                    <p className="font-mono text-sm text-[var(--color-text-muted)] mt-0.5 italic">{s.comment}</p>
                  </div>
                </li>
              ))}
            </ul>

            {hasExtraSkills && (
              <button
                onClick={() => setShowAllSkills((v) => !v)}
                className="w-full text-center font-mono text-sm text-[var(--color-accent)] hover:brightness-125 transition-colors cursor-pointer py-2"
              >
                {showAllSkills
                  ? t("result.skills.less")
                  : t("result.skills.more", { n: skillsAnalysis.length - SKILLS_COLLAPSED_LIMIT })}
              </button>
            )}
          </RevealSection>
        )}

        {/* Quote Bubble */}
        <RevealSection className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
          <div className="flex gap-4 items-start">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg"
              style={{ backgroundColor: "rgba(232,115,74,0.15)", border: "1px solid rgba(232,115,74,0.3)" }}
            >
              🤖
            </div>
            <div
              className="flex-1 rounded-lg p-4"
              style={{ borderLeft: "3px solid #E8734A", backgroundColor: "rgba(232,115,74,0.04)" }}
            >
              <p className="font-mono text-xs text-[var(--color-accent)] mb-2 font-bold tracking-wider">
                {model.name}:
              </p>
              <blockquote dir={dir} className="text-gray-200 text-lg italic leading-relaxed font-display">
                &ldquo;{quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </RevealSection>

        {/* Action Buttons */}
        <RevealSection className="space-y-4">
          <div className="text-center mb-2" dir={dir}>
            <h2 className="font-display text-lg font-bold text-white">
              {t("result.share.title")}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm mt-1">
              {t("result.share.subtitle")}
            </p>
          </div>

          <a
            href={result.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 font-bold text-lg text-white font-display hover:scale-[1.02] transition-all"
            style={{
              background: "linear-gradient(135deg, #E8734A, #ef4444)",
              boxShadow: "0 4px 24px rgba(232,115,74,0.25)",
            }}
          >
            {t("result.cert")}
          </a>

          <div className="grid grid-cols-3 gap-3">
            {[
              { href: `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`, icon: "𝕏", label: "Twitter" },
              { href: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, icon: "💼", label: "LinkedIn" },
              { href: `https://wa.me/?text=${shareText}%20${shareUrl}`, icon: "💬", label: "WhatsApp" },
            ].map((btn) => (
              <a
                key={btn.label}
                href={btn.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-medium text-gray-200 transition-all hover:brightness-125 hover:shadow-[0_0_12px_rgba(232,115,74,0.15)] font-display"
                style={cardStyle}
              >
                {btn.icon} <span className="hidden sm:inline">{btn.label}</span>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/leaderboard"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-300 font-display transition-all hover:brightness-125"
              style={{ border: "1px dashed #2a2a3a" }}
            >
              {t("result.leaderboard")}
            </Link>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-300 font-display transition-all hover:brightness-125 cursor-pointer"
              style={{ border: "1px dashed #2a2a3a" }}
            >
              {t("result.tryagain")}
            </button>
          </div>
        </RevealSection>
      </div>
    </div>
  );
}

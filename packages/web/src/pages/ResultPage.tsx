import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ReplacementMeter } from "../components/ReplacementMeter";
import { fetchResult, getErrorMessage, type AnalysisResult } from "../lib/api";

function getModelEmoji(key: string): string {
  const emojis: Record<string, string> = {
    haiku: "⚡",
    sonnet: "🎯",
    opus: "🧠",
    titan: "🔮",
    colossus: "🌋",
    singularity: "🌀",
    skynet: "💀",
    infinity: "♾️",
  };
  return emojis[key] ?? "🤖";
}

function getScoreColor(score: number): string {
  if (score < 30) return "#2dd4bf";
  if (score < 55) return "#f59e0b";
  if (score < 80) return "#E8734A";
  return "#ef4444";
}

export function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState<AnalysisResult | null>(
    (location.state as { result?: AnalysisResult })?.result ?? null,
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!result);

  useEffect(() => {
    if (result || !id) return;
    setLoading(true);
    fetchResult(id)
      .then(setResult)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [id, result]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-grid" style={{ backgroundColor: "#08080c" }}>
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🤖</div>
          <p className="text-[var(--color-text-muted)] font-mono">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-grid" style={{ backgroundColor: "#08080c" }}>
        <div className="text-center space-y-4">
          <div className="text-5xl">😵</div>
          <p dir="rtl" className="text-red-300 max-w-sm mx-auto">
            {error ?? "לא נמצא 🔍 אולי הקישור שגוי?"}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 rounded-xl px-6 py-2 text-sm font-mono transition-colors"
            style={{ backgroundColor: "#1a1a2e", color: "#d1d5db" }}
          >
            Try Again
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

  return (
    <div className="min-h-screen text-white bg-noise bg-scanline bg-grid" style={{ backgroundColor: "#08080c" }}>
      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${scoreColor}12 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto px-4 py-12 sm:py-16 space-y-8">

        {/* Model Card */}
        <section className="text-center space-y-4 animate-reveal-scale">
          <div className="text-6xl sm:text-7xl animate-float">{emoji}</div>

          <div className="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-text-muted)]">
            🤖 AI REPLACEMENT ASSIGNED
          </div>

          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold" style={{ color: scoreColor }}>
            {model.name}
          </h1>

          {!model.exists && model.year && (
            <span
              className="inline-block font-mono text-xs px-3 py-1 rounded-full"
              style={{ backgroundColor: "rgba(232,115,74,0.1)", color: "#E8734A", border: "1px solid rgba(232,115,74,0.3)" }}
            >
              🔮 Expected {model.year}
            </span>
          )}

          {/* Headline */}
          <div
            dir="rtl"
            className="max-w-lg mx-auto rounded-lg p-4"
            style={{ borderRight: `3px dashed ${scoreColor}`, backgroundColor: "rgba(15,15,23,0.6)" }}
          >
            <p className="text-lg sm:text-xl text-gray-200 font-medium font-display">
              {headline}
            </p>
          </div>
        </section>

        {/* Replacement Meter */}
        <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
          <h2 className="font-mono text-xs font-semibold text-[var(--color-accent)] uppercase tracking-[0.15em] mb-5">
            REPLACEMENT RISK ASSESSMENT
          </h2>
          <ReplacementMeter score={score} />
        </section>

        {/* Days Countdown */}
        <section className="rounded-2xl p-6 sm:p-8 text-center space-y-2" style={cardStyle}>
          <p className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-[0.15em] font-semibold">
            DAYS UNTIL TERMINATION
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
        </section>

        {/* Skills Analysis */}
        {skillsAnalysis.length > 0 && (
          <section className="rounded-2xl p-6 sm:p-8 space-y-4" style={cardStyle}>
            <h2 className="font-mono text-xs font-semibold text-[var(--color-accent)] uppercase tracking-[0.15em]">
              SKILLS CLEARANCE STATUS
            </h2>
            <ul className="space-y-3">
              {skillsAnalysis.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{
                    backgroundColor: "rgba(26,26,40,0.5)",
                    borderLeft: `3px solid ${s.replaced ? "#E8734A" : "#2dd4bf"}`,
                  }}
                >
                  <span className="font-mono text-xs mt-1 shrink-0 font-bold tracking-wider" style={{ color: s.replaced ? "#E8734A" : "#2dd4bf" }}>
                    {s.replaced ? "✅ COMPROMISED" : "🛡️ CLASSIFIED"}
                  </span>
                  <div className="min-w-0 mr-auto">
                    <p className="font-semibold text-white font-display">{s.skill}</p>
                    <p className="font-mono text-sm text-[var(--color-text-muted)] mt-0.5 italic">{s.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Quote Bubble */}
        <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
          <div className="flex gap-4 items-start">
            {/* Claude avatar */}
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
              <blockquote dir="rtl" className="text-gray-200 text-lg italic leading-relaxed font-display">
                &ldquo;{quote}&rdquo;
              </blockquote>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-4">
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
            📜 Download Termination Certificate
          </a>

          <div className="grid grid-cols-3 gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-200 transition-all hover:brightness-125 font-display"
              style={cardStyle}
            >
              𝕏 <span className="hidden sm:inline">Twitter</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-200 transition-all hover:brightness-125 font-display"
              style={cardStyle}
            >
              💼 <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-200 transition-all hover:brightness-125 font-display"
              style={cardStyle}
            >
              💬 <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/leaderboard"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-300 font-display transition-all hover:brightness-125"
              style={{ border: "1px dashed #2a2a3a" }}
            >
              🏆 Leaderboard
            </Link>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-300 font-display transition-all hover:brightness-125 cursor-pointer"
              style={{ border: "1px dashed #2a2a3a" }}
            >
              🔄 Try Again
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function getDaysMessage(days: number): string {
  if (days >= 99999) return "You're safe. For now.";
  if (days <= 7) return "Better start packing...";
  if (days <= 30) return "You've got about a month. Use it wisely.";
  if (days <= 180) return "Still some runway left.";
  if (days <= 365) return "A year-ish. Not bad!";
  if (days <= 1000) return "You've got time. Probably.";
  return "You might actually retire before this happens.";
}

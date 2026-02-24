import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ReplacementMeter } from "../components/ReplacementMeter";
import { fetchResult, getErrorMessage, type AnalysisResult } from "../lib/api";

function getDaysMessage(days: number): string {
  if (days <= 7) return "Better start packing...";
  if (days <= 30) return "You've got about a month. Use it wisely.";
  if (days <= 180) return "Still some runway left.";
  if (days <= 365) return "A year-ish. Not bad!";
  if (days <= 1000) return "You've got time. Probably.";
  return "You might actually retire before this happens.";
}

function getModelEmoji(key: string): string {
  const emojis: Record<string, string> = {
    haiku: "⚡",
    sonnet: "🎭",
    opus: "🎼",
    titan: "🔮",
    colossus: "🌋",
    singularity: "🌀",
    skynet: "💀",
    infinity: "♾️",
  };
  return emojis[key] ?? "🤖";
}

function getScoreColor(score: number): string {
  if (score < 30) return "#4ade80";
  if (score < 55) return "#facc15";
  if (score < 80) return "#fb923c";
  return "#f87171";
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
      <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: "#0a0a0f" }}>
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🤖</div>
          <p className="text-gray-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: "#0a0a0f" }}>
        <div className="text-center space-y-4">
          <div className="text-5xl">😵</div>
          <p dir="rtl" className="text-red-300 max-w-sm mx-auto">
            {error ?? "לא נמצא 🔍 אולי הקישור שגוי?"}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 rounded-xl px-6 py-2 text-sm transition-colors"
            style={{ backgroundColor: "#1e1e2e", color: "#d1d5db" }}
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
    backgroundColor: "#12121a",
    border: "1px solid #1e1e2e",
  };

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#0a0a0f" }}>
      {/* Background glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 800,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${scoreColor}15 0%, transparent 70%)`,
          filter: "blur(100px)",
        }}
      />

      <div className="relative z-10 max-w-[800px] mx-auto px-4 py-12 sm:py-16 space-y-8">
        {/* Model Card */}
        <section className="text-center space-y-4 animate-fade-in">
          <div className="text-6xl sm:text-7xl">{emoji}</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold" style={{ color: scoreColor }}>
            {model.name}
          </h1>
          {!model.exists && model.year && (
            <p className="text-sm text-gray-500">
              Coming in ~{model.year} {model.emoji}
            </p>
          )}
          <p dir="rtl" className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto font-medium">
            {headline}
          </p>
        </section>

        {/* Replacement Meter */}
        <section className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
            Replacement Risk
          </h2>
          <ReplacementMeter score={score} />
        </section>

        {/* Days Countdown */}
        <section className="rounded-2xl p-6 sm:p-8 text-center space-y-2" style={cardStyle}>
          <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
            Days Until Replacement
          </p>
          <p className="text-5xl sm:text-6xl font-black tabular-nums" style={{ color: scoreColor }}>
            {daysLeft.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">{getDaysMessage(daysLeft)}</p>
        </section>

        {/* Skills Analysis */}
        {skillsAnalysis.length > 0 && (
          <section className="rounded-2xl p-6 sm:p-8 space-y-4" style={cardStyle}>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Skills Breakdown
            </h2>
            <ul className="space-y-3">
              {skillsAnalysis.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl p-4"
                  style={{ backgroundColor: "#1a1a28" }}
                >
                  <span className="text-xl mt-0.5 shrink-0">
                    {s.replaced ? "✅" : "🛡️"}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-white">{s.skill}</p>
                    <p className="text-sm text-gray-400 mt-0.5">{s.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Quote Bubble */}
        <section className="relative">
          <div className="rounded-2xl p-6 sm:p-8" style={cardStyle}>
            <div className="flex gap-4 items-start">
              <div className="text-3xl shrink-0">🤖</div>
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  {model.name} says:
                </p>
                <blockquote dir="rtl" className="text-gray-200 text-lg italic leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
          <div
            className="absolute -bottom-2 left-10 w-4 h-4 rotate-45"
            style={{ backgroundColor: "#12121a", borderRight: "1px solid #1e1e2e", borderBottom: "1px solid #1e1e2e" }}
          />
        </section>

        {/* Action Buttons */}
        <section className="space-y-4">
          <a
            href={result.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl px-6 py-3.5 font-bold text-lg text-white hover:scale-[1.02] transition-all"
            style={{
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.25)",
            }}
          >
            📜 Download Certificate
          </a>

          <div className="grid grid-cols-3 gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-200 transition-colors hover:brightness-125"
              style={cardStyle}
            >
              𝕏 <span className="hidden sm:inline">Twitter</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-200 transition-colors hover:brightness-125"
              style={cardStyle}
            >
              💼 <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-200 transition-colors hover:brightness-125"
              style={cardStyle}
            >
              💬 <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/leaderboard"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-300 transition-colors hover:brightness-125"
              style={{ border: "1px solid #2a2a3a" }}
            >
              🏆 Leaderboard
            </Link>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-gray-300 transition-colors hover:brightness-125 cursor-pointer"
              style={{ border: "1px solid #2a2a3a" }}
            >
              🔄 Try Again
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

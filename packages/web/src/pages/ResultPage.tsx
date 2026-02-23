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

function getScoreClass(score: number): string {
  if (score < 30) return "text-green-400";
  if (score < 55) return "text-yellow-400";
  if (score < 80) return "text-orange-400";
  return "text-red-400";
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

  // Fetch from API if we don't have the result from route state
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
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center space-y-4">
          <div className="text-5xl animate-bounce">🤖</div>
          <p className="text-gray-400">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center space-y-4">
          <div className="text-5xl">😵</div>
          <p dir="rtl" className="text-red-300 max-w-sm mx-auto">
            {error ?? "לא נמצא 🔍 אולי הקישור שגוי?"}
          </p>
          <Link
            to="/"
            className="inline-block mt-4 rounded-lg bg-gray-800 px-6 py-2 text-sm hover:bg-gray-700 transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  const { model, score, daysLeft, headline, quote, skillsAnalysis } = result;
  const emoji = getModelEmoji(model.key);

  const shareText = encodeURIComponent(
    `${emoji} ${model.name} will replace me in ${daysLeft} days (${score}% replaceable)! Find out your fate:`,
  );
  const shareUrl = encodeURIComponent(result.shareUrl);

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="auto">
      {/* Background glow based on danger level */}
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-15 ${
          score >= 80
            ? "bg-red-500"
            : score >= 55
              ? "bg-orange-500"
              : score >= 30
                ? "bg-yellow-500"
                : "bg-green-500"
        }`}
      />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12 sm:py-16 space-y-10">
        {/* Section 1: Model Card */}
        <section className="text-center space-y-4 animate-fade-in">
          <div className="text-6xl sm:text-7xl">{emoji}</div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold">
            <span className={getScoreClass(score)}>{model.name}</span>
          </h1>
          {!model.exists && model.year && (
            <p className="text-sm text-gray-500">
              Coming in ~{model.year} {model.emoji}
            </p>
          )}
          <p className="text-lg sm:text-xl text-gray-300 max-w-md mx-auto font-medium">
            {headline}
          </p>
        </section>

        {/* Section 2: Animated Replacement Meter */}
        <section className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6 sm:p-8 backdrop-blur-sm">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">
            Replacement Risk
          </h2>
          <ReplacementMeter score={score} />
        </section>

        {/* Section 3: Days Countdown */}
        <section className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6 sm:p-8 backdrop-blur-sm text-center space-y-2">
          <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
            Days Until Replacement
          </p>
          <p
            className={`text-5xl sm:text-6xl font-black tabular-nums ${getScoreClass(score)}`}
          >
            {daysLeft.toLocaleString()}
          </p>
          <p className="text-gray-400 text-sm">{getDaysMessage(daysLeft)}</p>
        </section>

        {/* Section 4: Skills Analysis */}
        {skillsAnalysis.length > 0 && (
          <section className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6 sm:p-8 backdrop-blur-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Skills Breakdown
            </h2>
            <ul className="space-y-3">
              {skillsAnalysis.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-gray-800/50 p-4"
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

        {/* Section 5: Speech Bubble Quote */}
        <section className="relative">
          <div className="rounded-2xl bg-gray-900/60 border border-gray-800 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex gap-4 items-start">
              <div className="text-3xl shrink-0">🤖</div>
              <div>
                <p className="text-sm text-gray-500 mb-1 font-medium">
                  {model.name} says:
                </p>
                <blockquote className="text-gray-200 text-lg italic leading-relaxed">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </div>
            </div>
          </div>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-10 w-4 h-4 bg-gray-900/60 border-b border-r border-gray-800 rotate-45" />
        </section>

        {/* Section 6: Action Buttons */}
        <section className="space-y-4">
          {/* Primary action: Download certificate */}
          <a
            href={result.certificateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3.5 font-bold text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all"
          >
            📜 Download Certificate
          </a>

          {/* Share buttons */}
          <div className="grid grid-cols-3 gap-3">
            <a
              href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 font-medium hover:bg-gray-700 transition-colors"
            >
              𝕏 <span className="hidden sm:inline">Twitter</span>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 font-medium hover:bg-gray-700 transition-colors"
            >
              💼 <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <a
              href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-gray-800 px-4 py-3 font-medium hover:bg-gray-700 transition-colors"
            >
              💬 <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>

          {/* Secondary actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/leaderboard"
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-3 font-medium hover:bg-gray-800 transition-colors"
            >
              🏆 Leaderboard
            </Link>
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-4 py-3 font-medium hover:bg-gray-800 transition-colors cursor-pointer"
            >
              🔄 Try Again
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

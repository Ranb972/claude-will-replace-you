import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { InputForm } from "../components/InputForm";
import { LoadingScreen } from "../components/LoadingScreen";
import { useAnalysis } from "../hooks/useAnalysis";
import type { ProfilePayload } from "../lib/api";

const RECENT_RESULTS = [
  { name: "Doron", role: "Full Stack Developer", model: "Haiku", days: 47, score: 88 },
  { name: "Noa", role: "ML Engineer", model: "Colossus", days: 2541, score: 24 },
  { name: "Yossi", role: "Junior Dev", model: "Haiku", days: 12, score: 92 },
  { name: "Shira", role: "CTO", model: "Singularity", days: 4200, score: 14 },
  { name: "Amit", role: "DevOps Engineer", model: "Sonnet", days: 180, score: 71 },
  { name: "Tal", role: "Backend Developer", model: "Opus", days: 620, score: 52 },
  { name: "Maya", role: "Data Scientist", model: "Titan", days: 1800, score: 35 },
];

const ASCII_ROBOT = `
  ╭─────╮
  │ ^_^ │
  ╰──┬──╯
   ╭─┴─╮
   │   │
   ╰───╯`;

const ERROR_ICONS: Record<string, string> = {
  RATE_LIMITED: "🐌",
  NETWORK_ERROR: "📡",
  API_ERROR: "🤖",
  NOT_FOUND: "🔍",
};

export function HomePage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const { isLoading, error, errorCode, analyze } = useAnalysis();

  async function handleSubmit(data: ProfilePayload) {
    const result = await analyze(data);
    if (result) {
      navigate(`/result/${result.id}`, { state: { result } });
    }
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const errorIcon = errorCode ? ERROR_ICONS[errorCode] ?? "❌" : "❌";

  return (
    <div className="min-h-screen bg-noise bg-scanline" style={{ backgroundColor: "#08080c" }}>
      <LoadingScreen visible={isLoading} />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-grid">
        {/* Background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,115,74,0.06) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 text-center max-w-[800px] mx-auto">
          {/* ASCII Robot */}
          <pre
            className="font-mono text-[var(--color-accent)] text-sm sm:text-base mx-auto mb-6 animate-float select-none"
            style={{ lineHeight: 1.2 }}
          >
            {ASCII_ROBOT}
          </pre>

          {/* Department badge */}
          <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
            🤖 AI HR DEPARTMENT — OFFICIAL NOTICE
          </div>

          <h1
            dir="rtl"
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-glitch"
          >
            <span
              style={{
                background: "linear-gradient(90deg, #E8734A, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              איזה מודל של Claude
            </span>
            <br />
            <span className="text-white">יחליף אותך?</span>
          </h1>

          <p dir="rtl" className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-md mx-auto mb-8">
            <span className="typewriter-cursor">הכנס את הפרופיל שלך וגלה כמה ימים נשארו לך</span>
          </p>

          <button
            onClick={scrollToForm}
            className="font-display rounded-xl px-8 py-3.5 text-lg font-bold text-white cursor-pointer transition-all hover:scale-105 animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, #E8734A, #ef4444)",
            }}
          >
            גלה את האמת
          </button>

          {error && (
            <div
              role="alert"
              dir="rtl"
              className="mt-6 mx-auto max-w-md rounded-xl px-4 py-3 text-sm text-red-300"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <span className="text-lg ml-2">{errorIcon}</span>
              {error}
            </div>
          )}
        </div>

        {/* ── Ticker ── */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden py-3"
          style={{ borderTop: "1px solid rgba(232,115,74,0.1)", borderBottom: "1px solid rgba(232,115,74,0.1)", backgroundColor: "rgba(8,8,12,0.8)" }}
        >
          <div className="ticker-track">
            {[...RECENT_RESULTS, ...RECENT_RESULTS, ...RECENT_RESULTS].map((r, i) => {
              const dotColor = r.score > 60 ? "#ef4444" : r.score < 40 ? "#2dd4bf" : "#f59e0b";
              return (
                <span
                  key={i}
                  className="font-mono text-xs sm:text-sm text-[var(--color-text-muted)] whitespace-nowrap"
                  style={{ padding: "0 24px" }}
                >
                  <span style={{ color: dotColor }}>●</span>{" "}
                  {r.name}, {r.role}
                  <span className="mx-2 opacity-40">·</span>
                  <span style={{ color: dotColor }}>{r.model}</span>
                  {" "}{r.days}d
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Form Section ── */}
      <section
        ref={formRef}
        className="flex justify-center px-4 py-16 sm:py-24"
      >
        <div className="w-full max-w-[800px]">
          <div
            className="relative rounded-2xl p-6 sm:p-10 overflow-hidden"
            style={{
              backgroundColor: "#0f0f17",
              border: "1px dashed rgba(232,115,74,0.25)",
            }}
          >
            {/* Watermark */}
            <div className="watermark-classified">CLASSIFIED</div>

            {/* Header stamp */}
            <div className="relative z-10 text-center mb-8">
              <div className="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] mb-3">
                📋 CLASSIFIED — PERSONNEL FILE
              </div>
              <h2 dir="rtl" className="font-display text-2xl sm:text-3xl font-bold text-white">
                הפרופיל שלך
              </h2>
              <p dir="rtl" className="text-[var(--color-text-muted)] mt-2 text-sm sm:text-base">
                ספר לנו על עצמך ונחשב את סיכוי ההחלפה שלך
              </p>
            </div>

            <div className="relative z-10">
              <InputForm onSubmit={handleSubmit} isSubmitting={isLoading} />
            </div>

            {error && (
              <div
                role="alert"
                dir="rtl"
                className="relative z-10 mt-6 rounded-xl px-4 py-3 text-sm text-red-300 text-center"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <span className="text-lg ml-2">{errorIcon}</span>
                {error}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

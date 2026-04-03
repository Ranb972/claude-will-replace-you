import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { InputForm } from "../components/InputForm";
import { LoadingScreen } from "../components/LoadingScreen";
import { useAnalysis } from "../hooks/useAnalysis";
import { useLang } from "../lib/i18n";
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

/* CSS-art robot */
function CssRobot() {
  return (
    <div className="animate-float select-none mx-auto mb-6" style={{ width: 80 }}>
      {/* Head */}
      <div
        className="mx-auto rounded-2xl relative"
        style={{
          width: 64, height: 52,
          background: "linear-gradient(135deg, rgba(232,115,74,0.15), rgba(232,115,74,0.05))",
          border: "2px solid rgba(232,115,74,0.3)",
        }}
      >
        {/* Eyes */}
        <div className="absolute flex gap-4" style={{ top: 14, left: 12 }}>
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E8734A", boxShadow: "0 0 8px #E8734A" }} />
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#E8734A", boxShadow: "0 0 8px #E8734A" }} />
        </div>
        {/* Mouth */}
        <div className="absolute rounded-full" style={{ bottom: 10, left: 18, width: 28, height: 6, backgroundColor: "rgba(232,115,74,0.2)" }} />
        {/* Antenna */}
        <div className="absolute" style={{ top: -10, left: "50%", marginLeft: -1, width: 2, height: 10, backgroundColor: "rgba(232,115,74,0.4)" }} />
        <div className="absolute rounded-full" style={{ top: -14, left: "50%", marginLeft: -3, width: 6, height: 6, backgroundColor: "#E8734A", boxShadow: "0 0 6px #E8734A" }} />
      </div>
      {/* Neck */}
      <div className="mx-auto" style={{ width: 8, height: 6, backgroundColor: "rgba(232,115,74,0.15)" }} />
      {/* Body */}
      <div
        className="mx-auto rounded-xl"
        style={{
          width: 48, height: 32,
          background: "linear-gradient(180deg, rgba(232,115,74,0.1), rgba(232,115,74,0.03))",
          border: "1.5px solid rgba(232,115,74,0.2)",
        }}
      />
    </div>
  );
}

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
  const { t, dir, lang } = useLang();

  async function handleSubmit(data: ProfilePayload) {
    const result = await analyze({ ...data, lang });
    if (result) {
      navigate(`/result/${result.id}`, { state: { result } });
    }
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const errorIcon = errorCode ? ERROR_ICONS[errorCode] ?? "❌" : "❌";
  const isRtl = dir === "rtl";

  return (
    <div className="min-h-screen bg-noise bg-scanline">
      <LoadingScreen visible={isLoading} />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-shift bg-grid">
        {/* Background glow orb — pulsing */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"
          style={{
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(232,115,74,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 text-center max-w-[800px] mx-auto">
          <CssRobot />

          {/* Department badge */}
          <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-4">
            {t("hero.badge")}
          </div>

          <h1
            dir={dir}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 text-glitch"
          >
            <span
              style={{
                background: "linear-gradient(90deg, #E8734A, #fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("hero.title1")}
            </span>
            <br />
            <span className="text-white">{t("hero.title2")}</span>
          </h1>

          <p dir={dir} className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-md mx-auto mb-8">
            <span className="typewriter-cursor">{t("hero.subtitle")}</span>
          </p>

          <button
            onClick={scrollToForm}
            className="font-display rounded-xl px-8 py-3.5 text-lg font-bold text-white cursor-pointer transition-all duration-200 hover:scale-105 animate-pulse-glow btn-shimmer"
            style={{
              background: "linear-gradient(135deg, #E8734A, #ef4444)",
            }}
          >
            {t("hero.cta")}
          </button>

          {error && (
            <div
              role="alert"
              dir={dir}
              className="mt-6 mx-auto max-w-md rounded-xl px-4 py-3 text-sm text-red-300"
              style={{
                backgroundColor: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
              }}
            >
              <span className={`text-lg ${isRtl ? "ml-2" : "mr-2"}`}>{errorIcon}</span>
              {error}
            </div>
          )}
        </div>

        {/* ── Ticker ── */}
        <div
          className="absolute bottom-0 left-0 right-0 overflow-hidden py-3 glass-ticker"
          style={{ borderTop: "1px solid rgba(232,115,74,0.08)", borderBottom: "1px solid rgba(232,115,74,0.08)" }}
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
                  {" "}{r.days}{t("hero.ticker.days")}
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
            className="relative rounded-2xl p-6 sm:p-10 overflow-hidden glass-card"
            style={{
              border: "1px dashed rgba(232,115,74,0.2)",
            }}
          >
            {/* Watermark */}
            <div className="watermark-classified">CLASSIFIED</div>

            {/* Header stamp */}
            <div className="relative z-10 text-center mb-8">
              <div className="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] mb-3">
                {t("form.stamp")}
              </div>
              <h2 dir={dir} className="font-display text-2xl sm:text-3xl font-bold text-white">
                {t("form.heading")}
              </h2>
              <p dir={dir} className="text-[var(--color-text-muted)] mt-2 text-sm sm:text-base">
                {t("form.description")}
              </p>
            </div>

            <div className="relative z-10">
              <InputForm onSubmit={handleSubmit} isSubmitting={isLoading} />
            </div>

            {error && (
              <div
                role="alert"
                dir={dir}
                className="relative z-10 mt-6 rounded-xl px-4 py-3 text-sm text-red-300 text-center"
                style={{
                  backgroundColor: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <span className={`text-lg ${isRtl ? "ml-2" : "mr-2"}`}>{errorIcon}</span>
                {error}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

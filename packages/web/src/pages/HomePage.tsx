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

export function HomePage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLDivElement>(null);
  const { isLoading, error, analyze } = useAnalysis();
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

  return (
    <div className="min-h-screen bg-noise bg-scanline">
      <LoadingScreen visible={isLoading} />

      {/* Hero */}
      <section className="relative min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-shift bg-grid">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(232,115,74,0.05) 0%, transparent 70%)", filter: "blur(80px)" }}
        />

        <div className="relative z-10 text-center max-w-[720px] mx-auto">
          {/* Claude mascot orb */}
          <div className="flex justify-center mb-6 animate-float">
            <div className="relative">
              <div className="w-16 h-16 rounded-full" style={{ background: "linear-gradient(135deg, #E8734A, #ef4444)" }}>
                {/* Eyes */}
                <div className="absolute flex gap-3" style={{ top: 22, left: 16 }}>
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                </div>
              </div>
              {/* Reflection */}
              <div className="w-10 h-1.5 rounded-full mx-auto mt-2 opacity-20" style={{ background: "linear-gradient(90deg, transparent, #E8734A, transparent)" }} />
            </div>
          </div>

          <p className="font-display text-xs sm:text-sm tracking-[0.15em] uppercase text-[var(--color-text-muted)] mb-4 animate-fade-in-up">
            {t("hero.badge")}
          </p>

          <h1
            dir={dir}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up"
            style={{ animationDelay: "100ms" }}
          >
            <span style={{ background: "linear-gradient(90deg, #E8734A, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              {t("hero.title1")}
            </span>
            <br />
            <span className="text-white">{t("hero.title2")}</span>
          </h1>

          <p
            dir={dir}
            className="text-lg sm:text-xl text-[var(--color-text-muted)] max-w-md mx-auto mb-8 animate-fade-in-up"
            style={{ animationDelay: "200ms" }}
          >
            {t("hero.subtitle")}
          </p>

          <button
            onClick={scrollToForm}
            className="font-display rounded-xl px-8 py-3 text-base font-semibold text-white cursor-pointer transition-all duration-200 hover:scale-[1.03] btn-shimmer animate-fade-in-up"
            style={{ background: "linear-gradient(135deg, #E8734A, #ef4444)", animationDelay: "300ms" }}
          >
            {t("hero.cta")} <span className="ml-1">→</span>
          </button>

          <p className="text-xs text-[var(--color-text-muted)] mt-4 opacity-60 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            {t("hero.privacy")}
          </p>

          {error && (
            <div
              role="alert"
              dir={dir}
              className="mt-6 mx-auto max-w-md rounded-lg px-4 py-3 text-sm text-red-300"
              style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
            >
              {error}
            </div>
          )}
        </div>

        {/* Ticker */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden py-2.5 glass-ticker" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="ticker-track">
            {[...RECENT_RESULTS, ...RECENT_RESULTS, ...RECENT_RESULTS].map((r, i) => (
              <span key={i} className="text-xs text-[var(--color-text-muted)] whitespace-nowrap" style={{ padding: "0 20px" }}>
                {r.name} · {r.role} · <span className="text-white/60">{r.model}</span> · {r.days}{t("hero.ticker.days")}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section ref={formRef} className="flex justify-center px-4 py-16 sm:py-20">
        <div className="w-full max-w-[720px]">
          <div className="rounded-2xl p-6 sm:p-10 glass-card">
            <div className="text-center mb-8">
              <h2 dir={dir} className="font-display text-2xl sm:text-3xl font-bold text-white">
                {t("form.heading")}
              </h2>
              <p dir={dir} className="text-[var(--color-text-muted)] mt-2 text-sm">
                {t("form.description")}
              </p>
            </div>
            <InputForm onSubmit={handleSubmit} isSubmitting={isLoading} />
            {error && (
              <div role="alert" dir={dir} className="mt-6 rounded-lg px-4 py-3 text-sm text-red-300 text-center" style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

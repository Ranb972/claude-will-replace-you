import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { InputForm } from "../components/InputForm";
import { LoadingScreen } from "../components/LoadingScreen";
import { useAnalysis } from "../hooks/useAnalysis";
import type { ProfilePayload } from "../lib/api";

const RECENT_RESULTS = [
  { name: "Doron", role: "Full Stack Developer", model: "Haiku", days: 47 },
  { name: "Noa", role: "ML Engineer", model: "Colossus", days: 2541 },
  { name: "Yossi", role: "Junior Dev", model: "Haiku", days: 12 },
  { name: "Shira", role: "CTO", model: "Singularity", days: 4200 },
  { name: "Amit", role: "DevOps Engineer", model: "Sonnet", days: 180 },
  { name: "Tal", role: "Backend Developer", model: "Opus", days: 620 },
  { name: "Maya", role: "Data Scientist", model: "Titan", days: 1800 },
];

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
    <div className="min-h-screen" style={{ backgroundColor: "#0a0a0f" }}>
      <LoadingScreen visible={isLoading} />

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{
            width: 700,
            height: 700,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="relative z-10 text-center max-w-[800px] mx-auto">
          <div className="text-7xl sm:text-8xl mb-6">🤖</div>

          <h1
            dir="rtl"
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4"
          >
            <span
              style={{
                background: "linear-gradient(90deg, #f97316, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              איזה מודל של Claude
            </span>
            <br />
            <span className="text-white">?יחליף אותך</span>
          </h1>

          <p dir="rtl" className="text-lg sm:text-xl text-gray-400 max-w-md mx-auto mb-8">
            הכנס את הפרופיל שלך וגלה כמה ימים נשארו לך.
          </p>

          <button
            onClick={scrollToForm}
            className="rounded-xl px-8 py-3.5 text-lg font-bold text-white cursor-pointer transition-all hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #f97316, #ef4444)",
              boxShadow: "0 4px 24px rgba(249,115,22,0.3)",
            }}
          >
            גלה את האמת 😰
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
        <div className="absolute bottom-6 left-0 right-0 overflow-hidden">
          <div className="ticker-track">
            {[...RECENT_RESULTS, ...RECENT_RESULTS, ...RECENT_RESULTS].map((r, i) => (
              <span
                key={i}
                className="text-sm text-gray-600 whitespace-nowrap"
                style={{ padding: "0 24px" }}
              >
                {r.name}, {r.role}
                <span className="text-gray-700 mx-2">—</span>
                replaced by{" "}
                <span className="text-orange-500/70">{r.model}</span>
                {" "}in {r.days} days
              </span>
            ))}
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
            className="rounded-2xl p-6 sm:p-10"
            style={{
              backgroundColor: "#12121a",
              border: "1px solid #1e1e2e",
            }}
          >
            <div className="text-center mb-8">
              <h2 dir="rtl" className="text-2xl sm:text-3xl font-bold text-white">
                הפרופיל שלך
              </h2>
              <p dir="rtl" className="text-gray-400 mt-2 text-sm sm:text-base">
                ספר לנו על עצמך ונחשב את סיכוי ההחלפה שלך.
              </p>
            </div>

            <InputForm onSubmit={handleSubmit} isSubmitting={isLoading} />

            {error && (
              <div
                role="alert"
                dir="rtl"
                className="mt-6 rounded-xl px-4 py-3 text-sm text-red-300 text-center"
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

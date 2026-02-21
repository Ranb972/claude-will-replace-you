import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
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
];

export function HomePage() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLElement>(null);
  const [showForm, setShowForm] = useState(false);
  const { isLoading, error, analyze } = useAnalysis();

  useEffect(() => {
    if (showForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [showForm]);

  async function handleSubmit(data: ProfilePayload) {
    const result = await analyze(data);
    if (result) {
      navigate(`/result/${result.id}`);
    }
  }

  function scrollToForm() {
    setShowForm(true);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="auto">
      {isLoading && <LoadingScreen />}

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[128px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto space-y-6">
          <div className="text-7xl mb-4">🤖</div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              Which Claude Model
            </span>
            <br />
            Will Replace You?
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-md mx-auto">
            Enter your profile and find out how many days you have left.
          </p>

          <button
            onClick={scrollToForm}
            className="inline-block mt-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 px-8 py-3.5 text-lg font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all cursor-pointer"
          >
            Discover the Truth 😰
          </button>

          {error && (
            <p role="alert" className="text-red-400 text-sm mt-2">{error}</p>
          )}
        </div>

        {/* Recent results ticker */}
        <div className="absolute bottom-8 left-0 right-0 overflow-hidden">
          <div className="ticker-track flex gap-8 whitespace-nowrap">
            {[...RECENT_RESULTS, ...RECENT_RESULTS].map((r, i) => (
              <span key={i} className="text-sm text-gray-500">
                {r.name}, {r.role} — replaced by{" "}
                <span className="text-orange-400">{r.model}</span> in {r.days} days
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      {showForm && (
        <section
          ref={formRef}
          className="min-h-screen flex items-start justify-center px-4 py-16"
        >
          <div className="w-full max-w-lg space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold">Your Profile</h2>
              <p className="text-gray-400 mt-2">
                Tell us about yourself and we'll calculate your replacement risk.
              </p>
            </div>
            <InputForm onSubmit={handleSubmit} isSubmitting={isLoading} />
          </div>
        </section>
      )}
    </div>
  );
}

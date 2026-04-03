import { useState, useEffect, useRef } from "react";
import { useLang } from "../lib/i18n";

interface ReplacementMeterProps {
  score: number;
  duration?: number;
}

function getGradient(score: number): string {
  if (score < 30) return "linear-gradient(90deg, #2dd4bf, #14b8a6)";
  if (score < 55) return "linear-gradient(90deg, #f59e0b, #E8734A)";
  if (score < 80) return "linear-gradient(90deg, #E8734A, #ef4444)";
  return "linear-gradient(90deg, #ef4444, #a855f7)";
}

function getGlow(score: number): string {
  if (score < 30) return "0 0 16px rgba(45,212,191,0.3)";
  if (score < 55) return "0 0 16px rgba(245,158,11,0.3)";
  if (score < 80) return "0 0 16px rgba(232,115,74,0.3)";
  return "0 0 16px rgba(239,68,68,0.3)";
}

type ThreatKey = "meter.low" | "meter.moderate" | "meter.elevated" | "meter.high" | "meter.critical";

function getThreatInfo(score: number): { key: ThreatKey; color: string; pulse: boolean } {
  if (score < 20) return { key: "meter.low", color: "#2dd4bf", pulse: false };
  if (score < 40) return { key: "meter.moderate", color: "#f59e0b", pulse: false };
  if (score < 60) return { key: "meter.elevated", color: "#E8734A", pulse: false };
  if (score < 80) return { key: "meter.high", color: "#ef4444", pulse: false };
  return { key: "meter.critical", color: "#ef4444", pulse: true };
}

export function ReplacementMeter({ score, duration = 1500 }: ReplacementMeterProps) {
  const [current, setCurrent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasAnimated) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(eased * score));
      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    }

    requestAnimationFrame(tick);
  }, [hasAnimated, score, duration]);

  const { t } = useLang();
  const threat = getThreatInfo(score);

  return (
    <div ref={ref} className="w-full space-y-3">
      <div className="flex items-end justify-between">
        <span className="font-mono text-5xl sm:text-6xl font-bold tabular-nums text-white">
          {current}
          <span className="text-2xl sm:text-3xl text-[var(--color-text-muted)]">%</span>
        </span>
        <span
          className={`font-mono text-xs sm:text-sm tracking-wider uppercase pb-2 font-bold ${threat.pulse ? "animate-pulse" : ""}`}
          style={{ color: threat.color }}
        >
          {t(threat.key)}
        </span>
      </div>

      <div
        className="relative h-4 rounded-full overflow-hidden"
        style={{ backgroundColor: "#1a1a2e" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${current}%`,
            background: getGradient(score),
            boxShadow: getGlow(score),
            transition: "none",
          }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-600 px-0.5 font-mono">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

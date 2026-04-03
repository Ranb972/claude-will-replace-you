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

type ThreatKey = "meter.low" | "meter.moderate" | "meter.elevated" | "meter.high" | "meter.critical";

function getThreatInfo(score: number): { key: ThreatKey; color: string } {
  if (score < 20) return { key: "meter.low", color: "#2dd4bf" };
  if (score < 40) return { key: "meter.moderate", color: "#f59e0b" };
  if (score < 60) return { key: "meter.elevated", color: "#E8734A" };
  if (score < 80) return { key: "meter.high", color: "#ef4444" };
  return { key: "meter.critical", color: "#ef4444" };
}

export function ReplacementMeter({ score, duration = 1500 }: ReplacementMeterProps) {
  const [current, setCurrent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLang();

  useEffect(() => {
    if (hasAnimated) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHasAnimated(true); observer.disconnect(); } },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;
    const start = performance.now();
    function tick(now: number) {
      const p = Math.min((now - start) / duration, 1);
      setCurrent(Math.round((1 - Math.pow(1 - p, 3)) * score));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [hasAnimated, score, duration]);

  const threat = getThreatInfo(score);

  return (
    <div ref={ref} className="w-full space-y-3">
      <div className="flex items-end justify-between">
        <span className="font-mono text-4xl sm:text-5xl font-bold tabular-nums text-white">
          {current}<span className="text-xl text-[var(--color-text-muted)]">%</span>
        </span>
        <span className="font-display text-xs tracking-wider uppercase font-semibold" style={{ color: threat.color }}>
          {t(threat.key)}
        </span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full" style={{ width: `${current}%`, background: getGradient(score), transition: "none" }} />
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

interface ReplacementMeterProps {
  score: number;
  duration?: number;
}

function getGradient(score: number): string {
  if (score < 30) return "linear-gradient(90deg, #4ade80, #22c55e)";
  if (score < 55) return "linear-gradient(90deg, #facc15, #f97316)";
  if (score < 80) return "linear-gradient(90deg, #f97316, #ef4444)";
  return "linear-gradient(90deg, #ef4444, #a855f7)";
}

function getGlow(score: number): string {
  if (score < 30) return "0 0 16px rgba(74,222,128,0.3)";
  if (score < 55) return "0 0 16px rgba(250,204,21,0.3)";
  if (score < 80) return "0 0 16px rgba(249,115,22,0.3)";
  return "0 0 16px rgba(239,68,68,0.3)";
}

function getLabel(score: number): string {
  if (score < 20) return "Safe... for now";
  if (score < 40) return "Getting warm";
  if (score < 60) return "Sweat zone";
  if (score < 80) return "Update your LinkedIn";
  return "Pack your desk";
}

export function ReplacementMeter({ score, duration = 2000 }: ReplacementMeterProps) {
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

  return (
    <div ref={ref} className="w-full space-y-3">
      <div className="flex items-end justify-between">
        <span className="text-5xl sm:text-6xl font-black tabular-nums text-white">
          {current}
          <span className="text-2xl sm:text-3xl text-gray-500">%</span>
        </span>
        <span className="text-sm text-gray-400 pb-2">{getLabel(score)}</span>
      </div>

      <div
        className="relative h-4 rounded-full overflow-hidden"
        style={{ backgroundColor: "#1e1e2e" }}
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

      <div className="flex justify-between text-xs text-gray-600 px-0.5">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
}

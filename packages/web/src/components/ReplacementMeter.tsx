import { useState, useEffect, useRef } from "react";

interface ReplacementMeterProps {
  score: number; // 0-100
  duration?: number; // animation duration in ms, default 2000
}

function getColor(score: number): string {
  if (score < 30) return "from-green-400 to-green-500";
  if (score < 55) return "from-yellow-400 to-orange-500";
  if (score < 80) return "from-orange-500 to-red-500";
  return "from-red-500 to-purple-600";
}

function getGlow(score: number): string {
  if (score < 30) return "shadow-green-500/30";
  if (score < 55) return "shadow-yellow-500/30";
  if (score < 80) return "shadow-orange-500/30";
  return "shadow-red-500/30";
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

  // Animate when component enters viewport
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

  // Animate value from 0 to score
  useEffect(() => {
    if (!hasAnimated) return;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
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
      {/* Score number */}
      <div className="flex items-end justify-between">
        <span className="text-5xl sm:text-6xl font-black tabular-nums">
          {current}
          <span className="text-2xl sm:text-3xl text-gray-400">%</span>
        </span>
        <span className="text-sm text-gray-400 pb-2">{getLabel(score)}</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 rounded-full bg-gray-800 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getColor(score)} transition-none shadow-lg ${getGlow(score)}`}
          style={{ width: `${current}%` }}
        />
      </div>

      {/* Scale markers */}
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

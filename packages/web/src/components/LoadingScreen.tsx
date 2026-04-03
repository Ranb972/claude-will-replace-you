import { useState, useEffect } from "react";
import { useLang } from "../lib/i18n";

const MESSAGE_COUNT = 10;
const MESSAGE_INTERVAL_MS = 2000;
const MIN_DISPLAY_MS = 1500;

interface LoadingScreenProps {
  visible: boolean;
  onMinimumElapsed?: () => void;
}

export function LoadingScreen({ visible, onMinimumElapsed }: LoadingScreenProps) {
  const { t } = useLang();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGE_COUNT);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    setProgress(0);
    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      let pct: number;
      if (elapsed < 500) pct = (elapsed / 500) * 35;
      else if (elapsed < 1200) pct = 35 + ((elapsed - 500) / 700) * 25;
      else if (elapsed < 1800) pct = 60 + ((elapsed - 1200) / 600) * 28;
      else pct = 88 + 7 * (1 - Math.exp(-(elapsed - 1800) / 3000));
      setProgress(Math.min(pct, 95));
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  useEffect(() => {
    if (!visible || !onMinimumElapsed) return;
    const timer = setTimeout(onMinimumElapsed, MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [visible, onMinimumElapsed]);

  useEffect(() => {
    if (!visible && progress > 0) {
      setProgress(100);
      setExiting(true);
    }
  }, [visible, progress]);

  if (!visible && !exiting) return null;

  const pct = Math.round(progress);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-300 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "#0f0f1a" }}
      onTransitionEnd={() => {
        if (exiting) { setExiting(false); setProgress(0); setMessageIndex(0); }
      }}
    >
      {/* Pulsing orb */}
      <div className="w-8 h-8 rounded-full mb-8 animate-pulse"
        style={{ background: "linear-gradient(135deg, #E8734A, #ef4444)" }} />

      <p className="font-display text-lg sm:text-xl text-white font-medium mb-2">
        {t("loading.title")}
      </p>

      {/* Progress */}
      <div className="w-64 sm:w-80 mt-4">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          <div className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, #E8734A, #ef4444)" }} />
        </div>
        <p className="font-mono text-xs text-[var(--color-text-muted)] text-center mt-2">{pct}%</p>
      </div>

      {/* Rotating message */}
      <p key={messageIndex} className="text-sm text-[var(--color-text-muted)] mt-6 animate-fade-in-up text-center px-6">
        {t(`loading.msg.${messageIndex}`)}
      </p>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useLang } from "../lib/i18n";

const MESSAGE_COUNT = 10;
const MESSAGE_INTERVAL_MS = 800;
const COUNTDOWN_INTERVAL_MS = 700;
const MIN_DISPLAY_MS = 2000;

interface LoadingScreenProps {
  visible: boolean;
  onMinimumElapsed?: () => void;
}

export function LoadingScreen({ visible, onMinimumElapsed }: LoadingScreenProps) {
  const { t, dir } = useLang();

  const [countdown, setCountdown] = useState(3);
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Countdown 3 → 2 → 1 → 0
  useEffect(() => {
    if (!visible) return;
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, COUNTDOWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [visible]);

  // Rotate messages (only after countdown finishes)
  useEffect(() => {
    if (!visible || countdown > 0) return;
    setMessageIndex(0);
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGE_COUNT);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [visible, countdown]);

  // Progress bar (only after countdown)
  useEffect(() => {
    if (!visible || countdown > 0) return;
    setProgress(0);
    let frame: number;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      let pct: number;
      if (elapsed < 600) {
        pct = (elapsed / 600) * 40;
      } else if (elapsed < 1400) {
        pct = 40 + ((elapsed - 600) / 800) * 20;
      } else if (elapsed < 2000) {
        pct = 60 + ((elapsed - 1400) / 600) * 30;
      } else {
        const extra = elapsed - 2000;
        pct = 90 + 5 * (1 - Math.exp(-extra / 3000));
      }
      setProgress(Math.min(pct, 95));
      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [visible, countdown]);

  useEffect(() => {
    if (!visible || !onMinimumElapsed) return;
    const timer = setTimeout(onMinimumElapsed, MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [visible, onMinimumElapsed]);

  useEffect(() => {
    if (!visible && (progress > 0 || countdown > 0)) {
      setProgress(100);
      setExiting(true);
    }
  }, [visible, progress, countdown]);

  if (!visible && !exiting) return null;

  const pctRound = Math.round(progress);
  const filled = Math.round((pctRound / 100) * 20);
  const barText = "\u2588".repeat(filled) + "\u2591".repeat(20 - filled);

  // Countdown phase
  if (countdown > 0 && !exiting) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-grid"
        style={{ backgroundColor: "#08080c" }}
      >
        <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-6">
          {t("loading.init")}
        </div>
        <div
          key={countdown}
          className="font-mono text-8xl sm:text-9xl font-bold animate-reveal-scale"
          style={{ color: "#E8734A", textShadow: "0 0 40px rgba(232,115,74,0.4)" }}
        >
          {countdown}
        </div>
        <p dir={dir} className="font-mono text-sm text-[var(--color-text-muted)] mt-6">
          {t("loading.starting")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 bg-matrix bg-grid ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundColor: "#08080c" }}
      onTransitionEnd={() => {
        if (exiting) {
          setExiting(false);
          setProgress(0);
          setMessageIndex(0);
          setCountdown(3);
        }
      }}
    >
      {/* Title */}
      <div className="font-mono text-xs sm:text-sm tracking-[0.2em] uppercase text-[var(--color-accent)] mb-8">
        {t("loading.title")}
      </div>

      {/* Robot */}
      <div className="text-6xl sm:text-7xl mb-8 animate-bounce">🤖</div>

      {/* Message */}
      <p
        key={messageIndex}
        dir={dir}
        className="font-mono text-lg sm:text-xl text-white font-medium text-center px-6 min-h-[2em] animate-fade-in-up"
      >
        <span className="text-[var(--color-accent)] opacity-50 mx-1">&gt;</span>
        {t(`loading.msg.${messageIndex}`)}
        <span className="animate-terminal-blink text-[var(--color-accent)] mx-1">_</span>
      </p>

      {/* Progress bar */}
      <div className="w-72 sm:w-96 mt-10">
        <div className="font-mono text-xs text-[var(--color-text-muted)] mb-2 text-center tracking-wider uppercase">
          {t("loading.level")}
        </div>
        <div
          className="h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: "#1a1a2e" }}
        >
          <div
            className="h-full rounded-full transition-[width] duration-300 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #E8734A, #ef4444, #a855f7)",
            }}
          />
        </div>
        <p className="font-mono text-[var(--color-accent)] text-xs text-center mt-3 tracking-wider">
          [{barText}] {pctRound}%
        </p>
      </div>

      {/* Blinking cursor */}
      <div className="mt-8 font-mono text-[var(--color-accent)] animate-terminal-blink text-lg">
        _
      </div>
    </div>
  );
}

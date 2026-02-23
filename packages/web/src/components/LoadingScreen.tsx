import { useState, useEffect } from "react";

const MESSAGES = [
  "סורק את קורות החיים שלך... 😬",
  "משווה אותך ל-Claude Opus... הממ...",
  "מחשב ימים עד פיטורין... ⏳",
  "Claude שואל אם יש לך מגש עמדות...",
  "בודק אם הקוד שלך עובר lint... (ספויילר: לא)",
  "סורק את הגיטהאב שלך... רגע, זה intentional?",
  "מתייעץ עם Skynet...",
  "Claude מוציא קורות חיים...",
  "בודק אם אתה כותב tests... 👀",
  "מחפש את הערך המוסף שלך... עדיין מחפש...",
];

const MESSAGE_INTERVAL_MS = 800;
const MIN_DISPLAY_MS = 2000;

interface LoadingScreenProps {
  visible: boolean;
  onMinimumElapsed?: () => void;
}

export function LoadingScreen({ visible, onMinimumElapsed }: LoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  // Rotate messages every 800ms
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, MESSAGE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [visible]);

  // Non-linear progress bar animation
  useEffect(() => {
    if (!visible) return;
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
  }, [visible]);

  // Minimum display time enforcement
  useEffect(() => {
    if (!visible || !onMinimumElapsed) return;
    const timer = setTimeout(onMinimumElapsed, MIN_DISPLAY_MS);
    return () => clearTimeout(timer);
  }, [visible, onMinimumElapsed]);

  // Exit animation
  useEffect(() => {
    if (!visible && progress > 0) {
      setProgress(100);
      setExiting(true);
    }
  }, [visible, progress]);

  if (!visible && !exiting) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950 transition-opacity duration-500 ${
        exiting ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      onTransitionEnd={() => {
        if (exiting) {
          setExiting(false);
          setProgress(0);
          setMessageIndex(0);
        }
      }}
    >
      {/* Robot icon */}
      <div className="text-6xl mb-8 animate-bounce">🤖</div>

      {/* Rotating message */}
      <p
        key={messageIndex}
        className="text-xl md:text-2xl text-white font-medium text-center px-4 min-h-[2em] animate-fade-in"
        dir="rtl"
      >
        {MESSAGES[messageIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-72 md:w-96 mt-10">
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-[width] duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-500 text-sm text-center mt-3">
          {Math.round(progress)}%
        </p>
      </div>

      {/* Subtle dots animation */}
      <div className="flex gap-2 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

const MESSAGES = [
  "Scanning your resume... 😬",
  "Comparing you to Claude Opus... hmm...",
  "Calculating days until termination... ⏳",
  "Claude is asking if you have a standing desk...",
  "Checking if your code passes lint... (spoiler: no)",
  "Scanning your GitHub... wait, is that intentional?",
  "Consulting with Skynet...",
  "Claude is updating its resume...",
];

export function LoadingScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Analyzing your profile"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-950/95 backdrop-blur-sm"
    >
      {/* Spinner */}
      <div className="mb-8" aria-hidden="true">
        <div className="h-16 w-16 rounded-full border-4 border-gray-700 border-t-orange-500 animate-spin" />
      </div>

      {/* Rotating messages */}
      <p
        key={index}
        className="text-lg text-gray-300 text-center px-6 animate-fade-in"
      >
        {MESSAGES[index]}
      </p>
    </div>
  );
}

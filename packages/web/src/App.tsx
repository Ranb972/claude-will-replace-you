import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider, useLang } from "./lib/i18n";
import { HomePage } from "./pages/HomePage";
import { ResultPage } from "./pages/ResultPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

function LangToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "he" : "en")}
      className="fixed top-4 right-4 z-50 font-mono text-xs px-3 py-1.5 rounded-full cursor-pointer transition-all hover:brightness-125"
      style={{
        backgroundColor: "rgba(15,15,23,0.85)",
        border: "1px solid #1a1a2e",
        color: "#EDEDED",
        backdropFilter: "blur(8px)",
      }}
      aria-label="Toggle language"
    >
      🌐 {lang === "en" ? "EN" : "HE"}
    </button>
  );
}

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <LangToggle />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result/:id" element={<ResultPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center text-white" style={{ backgroundColor: "#08080c" }}>
                <p>404 — Page not found</p>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  );
}

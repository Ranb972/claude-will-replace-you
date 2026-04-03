import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LangProvider } from "./lib/i18n";
import { Navbar } from "./components/Navbar";
import { HomePage } from "./pages/HomePage";
import { ResultPage } from "./pages/ResultPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Navbar />
        <div className="pt-14">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route
              path="*"
              element={
                <div className="min-h-screen flex items-center justify-center text-white">
                  <p className="text-[var(--color-text-muted)]">404 — Page not found</p>
                </div>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </LangProvider>
  );
}

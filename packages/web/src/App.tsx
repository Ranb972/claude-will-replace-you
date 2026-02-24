import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { ResultPage } from "./pages/ResultPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result/:id" element={<ResultPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
              <p>404 — Page not found</p>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

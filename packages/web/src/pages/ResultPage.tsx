import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { AnalysisResult } from "../lib/api";
import { fetchResult } from "../lib/api";
import { ShareButtons } from "../components/ShareButtons";

export function ResultPage() {
  const { id } = useParams<{ id: string }>();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Missing result ID");
      setLoading(false);
      return;
    }

    fetchResult(id)
      .then(setResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-xl animate-pulse">טוען תוצאה...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white gap-4">
        <p className="text-xl text-red-400">{error || "Result not found"}</p>
        <Link to="/" className="text-purple-400 hover:text-purple-300 underline">
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-8 px-4" dir="rtl">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Model card */}
        <div className="text-center space-y-4">
          <div className="text-6xl">{result.model.emoji || "🤖"}</div>
          <h1 className="text-3xl font-bold">{result.model.name}</h1>
          {result.model.exists === false && result.model.year && (
            <p className="text-gray-400">🔮 צפוי לצאת ב-{result.model.year}</p>
          )}
          <p className="text-xl text-purple-300">{result.headline}</p>
        </div>

        {/* Score */}
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">אחוז החלפה</p>
          <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${result.score}%`,
                backgroundColor: scoreColor(result.score),
              }}
            />
          </div>
          <p className="text-4xl font-bold">{result.score}%</p>
        </div>

        {/* Days left */}
        <div className="text-center">
          <p className="text-gray-400 text-sm">ימים עד החלפה</p>
          <p className="text-5xl font-bold mt-2">
            {result.daysLeft >= 99999 ? "♾️" : result.daysLeft.toLocaleString("he-IL")}
          </p>
          {result.daysLeft < 99999 && <p className="text-gray-400 mt-1">ימים</p>}
        </div>

        {/* Quote */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <p className="text-lg italic text-gray-200">"{result.quote}"</p>
          <p className="text-gray-500 mt-2">— {result.model.name}</p>
        </div>

        {/* Skills analysis */}
        {result.skillsAnalysis.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-center">ניתוח כישורים</h2>
            <div className="space-y-2">
              {result.skillsAnalysis.map((skill) => (
                <div
                  key={skill.skill}
                  className="flex items-start gap-3 bg-gray-900 rounded-lg p-3"
                >
                  <span className="text-lg mt-0.5">
                    {skill.replaced ? "✅" : "🛡️"}
                  </span>
                  <div>
                    <p className="font-medium">{skill.skill}</p>
                    <p className="text-gray-400 text-sm">{skill.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Share buttons */}
        <ShareButtons result={result} />

        {/* Navigation */}
        <div className="flex justify-center gap-4 text-sm">
          <Link to="/" className="text-purple-400 hover:text-purple-300">
            🔄 נסה שוב
          </Link>
          <Link to="/leaderboard" className="text-purple-400 hover:text-purple-300">
            🏆 לידרבורד
          </Link>
        </div>
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 85) return "#a855f7"; // purple
  if (score >= 60) return "#ef4444"; // red
  if (score >= 30) return "#f97316"; // orange
  return "#22c55e"; // green
}

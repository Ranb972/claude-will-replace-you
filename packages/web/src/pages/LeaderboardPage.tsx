import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  fetchLeaderboard,
  type LeaderboardEntry,
  type LeaderboardSort,
} from "../lib/api";

// --- Model badge colors ---

const MODEL_BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  // Real models — warm/hot colors
  haiku: { bg: "bg-red-500/20", text: "text-red-400" },
  sonnet: { bg: "bg-orange-500/20", text: "text-orange-400" },
  opus: { bg: "bg-yellow-500/20", text: "text-yellow-400" },
  // Fictional models — cool/purple colors
  titan: { bg: "bg-purple-500/20", text: "text-purple-400" },
  colossus: { bg: "bg-violet-500/20", text: "text-violet-400" },
  singularity: { bg: "bg-indigo-500/20", text: "text-indigo-400" },
  skynet: { bg: "bg-blue-500/20", text: "text-blue-400" },
  infinity: { bg: "bg-cyan-500/20", text: "text-cyan-400" },
};

function ModelBadge({ modelKey, modelName }: { modelKey: string; modelName: string }) {
  const style = MODEL_BADGE_STYLES[modelKey] ?? {
    bg: "bg-gray-500/20",
    text: "text-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.bg} ${style.text}`}
    >
      {modelKey === "haiku" || modelKey === "sonnet" || modelKey === "opus"
        ? "🤖"
        : "🔮"}{" "}
      {modelName}
    </span>
  );
}

// --- Mini score meter ---

function ScoreMeter({ score }: { score: number }) {
  const color =
    score >= 85
      ? "bg-red-500"
      : score >= 60
        ? "bg-orange-500"
        : score >= 30
          ? "bg-yellow-500"
          : "bg-green-500";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full bg-gray-700 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 tabular-nums w-8">{score}%</span>
    </div>
  );
}

// --- Tab config ---

interface TabConfig {
  key: LeaderboardSort;
  label: string;
}

const TABS: TabConfig[] = [
  { key: "highest", label: "הכי מוחלפים 🔥" },
  { key: "lowest", label: "הכי בטוחים 🛡️" },
  { key: "recent", label: "אחרונים 🕐" },
];

const PAGE_SIZE = 20;

// --- Main component ---

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardSort>("highest");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(
    async (sort: LeaderboardSort, offset: number, append: boolean) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }
        setError(null);

        const data = await fetchLeaderboard(sort, PAGE_SIZE, offset);

        if (append) {
          setEntries((prev) => [...prev, ...data.entries]);
        } else {
          setEntries(data.entries);
        }
        setTotal(data.total);
        setHasMore(data.hasMore);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboard");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  // Load on tab change
  useEffect(() => {
    loadData(activeTab, 0, false);
  }, [activeTab, loadData]);

  function handleTabChange(sort: LeaderboardSort) {
    if (sort === activeTab) return;
    setActiveTab(sort);
  }

  function handleLoadMore() {
    if (loadingMore || !hasMore) return;
    loadData(activeTab, entries.length, true);
  }

  function formatDaysLeft(days: number): string {
    if (days <= 0) return "כבר 💀";
    if (days < 30) return `${days} ימים`;
    if (days < 365) return `${Math.round(days / 30)} חודשים`;
    return `${(days / 365).toFixed(1)} שנים`;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 text-sm mb-4 inline-block transition-colors"
          >
            ← חזרה לדף הבית
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              לוח המוחלפים
            </span>{" "}
            🏆
          </h1>
          <p className="text-gray-400 mt-2">
            {total > 0
              ? `${total} מפתחים כבר גילו את האמת`
              : "עדיין אין תוצאות — תהיה הראשון!"}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-8 bg-gray-900 rounded-lg p-1 max-w-md mx-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                activeTab === tab.key
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
            <button
              onClick={() => loadData(activeTab, 0, false)}
              className="mt-2 text-sm text-gray-400 hover:text-white underline cursor-pointer"
            >
              נסה שוב
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 rounded-lg bg-gray-900 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🦗</div>
            <p className="text-gray-400 text-lg">אין תוצאות עדיין</p>
            <Link
              to="/"
              className="inline-block mt-4 text-orange-400 hover:text-orange-300 underline"
            >
              תבדוק את עצמך ותהיה הראשון
            </Link>
          </div>
        )}

        {/* Table */}
        {!loading && !error && entries.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-hidden rounded-lg border border-gray-800">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-right w-12">#</th>
                    <th className="px-4 py-3 text-right">שם</th>
                    <th className="px-4 py-3 text-right">תפקיד</th>
                    <th className="px-4 py-3 text-right">ציון</th>
                    <th className="px-4 py-3 text-right">מחליף</th>
                    <th className="px-4 py-3 text-right">ימים</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {entries.map((entry, i) => {
                    const rank =
                      activeTab === "recent" ? null : i + 1;
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-gray-900/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-gray-500 tabular-nums">
                          {rank !== null ? (
                            rank <= 3 ? (
                              <span className="text-lg">
                                {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                              </span>
                            ) : (
                              rank
                            )
                          ) : (
                            <span className="text-gray-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/result/${entry.id}`}
                            className="font-medium hover:text-orange-400 transition-colors"
                          >
                            {entry.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm truncate max-w-[200px]">
                          {entry.role}
                        </td>
                        <td className="px-4 py-3">
                          <ScoreMeter score={entry.score} />
                        </td>
                        <td className="px-4 py-3">
                          <ModelBadge
                            modelKey={entry.modelKey}
                            modelName={entry.modelName}
                          />
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm tabular-nums">
                          {formatDaysLeft(entry.daysLeft)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="sm:hidden space-y-3">
              {entries.map((entry, i) => {
                const rank = activeTab === "recent" ? null : i + 1;
                return (
                  <Link
                    key={entry.id}
                    to={`/result/${entry.id}`}
                    className="block rounded-lg border border-gray-800 bg-gray-900/30 p-4 hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {rank !== null && rank <= 3 && (
                          <span className="text-lg">
                            {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                          </span>
                        )}
                        {rank !== null && rank > 3 && (
                          <span className="text-gray-500 text-sm">#{rank}</span>
                        )}
                        <span className="font-medium">{entry.name}</span>
                      </div>
                      <span className="text-gray-400 text-sm">
                        {formatDaysLeft(entry.daysLeft)}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{entry.role}</p>
                    <div className="flex items-center justify-between">
                      <ScoreMeter score={entry.score} />
                      <ModelBadge
                        modelKey={entry.modelKey}
                        modelName={entry.modelName}
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Load more */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="rounded-lg border border-gray-700 px-6 py-2.5 text-sm font-medium text-gray-300 hover:border-gray-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {loadingMore ? "טוען..." : "טען עוד"}
                </button>
                <p className="text-gray-600 text-xs mt-2">
                  מציג {entries.length} מתוך {total}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

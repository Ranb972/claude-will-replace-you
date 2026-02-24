import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  fetchLeaderboard,
  getErrorMessage,
  type LeaderboardEntry,
  type LeaderboardSort,
} from "../lib/api";

// --- Model badge colors ---

const MODEL_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  haiku: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
  sonnet: { bg: "rgba(249,115,22,0.15)", text: "#fb923c" },
  opus: { bg: "rgba(250,204,21,0.15)", text: "#facc15" },
  titan: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
  colossus: { bg: "rgba(139,92,246,0.15)", text: "#a78bfa" },
  singularity: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
  skynet: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  infinity: { bg: "rgba(6,182,212,0.15)", text: "#22d3ee" },
};

function ModelBadge({ modelKey, modelName }: { modelKey: string; modelName: string }) {
  const colors = MODEL_BADGE_COLORS[modelKey] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium"
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {modelKey === "haiku" || modelKey === "sonnet" || modelKey === "opus" ? "🤖" : "🔮"}{" "}
      {modelName}
    </span>
  );
}

// --- Mini score meter ---

function ScoreMeter({ score }: { score: number }) {
  const color =
    score >= 85 ? "#ef4444" : score >= 60 ? "#f97316" : score >= 30 ? "#facc15" : "#4ade80";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1e1e2e" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
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
        setError(getErrorMessage(err));
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
    <div className="min-h-screen text-white" dir="rtl" style={{ backgroundColor: "#0a0a0f" }}>
      <div className="max-w-[800px] mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-gray-500 hover:text-gray-300 text-sm mb-4 inline-block transition-colors"
          >
            ← חזרה לדף הבית
          </Link>
          <h1 className="text-3xl sm:text-4xl font-extrabold">
            <span
              style={{
                background: "linear-gradient(90deg, #f97316, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
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
        <div
          className="flex justify-center gap-1 mb-8 rounded-xl p-1 max-w-md mx-auto"
          style={{ backgroundColor: "#12121a" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
              style={
                activeTab === tab.key
                  ? { backgroundColor: "#1e1e2e", color: "#fff" }
                  : { color: "#9ca3af" }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">😵</div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 max-w-sm mx-auto">
              {error}
            </div>
            <button
              onClick={() => loadData(activeTab, 0, false)}
              className="mt-3 text-sm text-gray-400 hover:text-white underline cursor-pointer"
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
                className="h-16 rounded-lg animate-pulse"
                style={{ backgroundColor: "#12121a" }}
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
            <div className="hidden sm:block overflow-hidden rounded-xl" style={{ border: "1px solid #1e1e2e" }}>
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-xs uppercase tracking-wider" style={{ backgroundColor: "#12121a" }}>
                    <th className="px-4 py-3 text-right w-12">#</th>
                    <th className="px-4 py-3 text-right">שם</th>
                    <th className="px-4 py-3 text-right">תפקיד</th>
                    <th className="px-4 py-3 text-right">ציון</th>
                    <th className="px-4 py-3 text-right">מחליף</th>
                    <th className="px-4 py-3 text-right">ימים</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#1e1e2e" }}>
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
                    className="block rounded-xl p-4 transition-colors hover:brightness-110"
                    style={{ backgroundColor: "#12121a", border: "1px solid #1e1e2e" }}
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

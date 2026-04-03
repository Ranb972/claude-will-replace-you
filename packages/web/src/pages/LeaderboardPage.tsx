import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  fetchLeaderboard,
  getErrorMessage,
  type LeaderboardEntry,
  type LeaderboardSort,
} from "../lib/api";
import { useLang } from "../lib/i18n";

// --- Model badge colors ---

const MODEL_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  haiku: { bg: "rgba(239,68,68,0.15)", text: "#f87171" },
  sonnet: { bg: "rgba(232,115,74,0.15)", text: "#E8734A" },
  opus: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b" },
  titan: { bg: "rgba(168,85,247,0.15)", text: "#c084fc" },
  colossus: { bg: "rgba(139,92,246,0.15)", text: "#a78bfa" },
  singularity: { bg: "rgba(99,102,241,0.15)", text: "#818cf8" },
  skynet: { bg: "rgba(59,130,246,0.15)", text: "#60a5fa" },
  infinity: { bg: "rgba(45,212,191,0.15)", text: "#2dd4bf" },
};

function ModelBadge({ modelKey, modelName }: { modelKey: string; modelName: string }) {
  const colors = MODEL_BADGE_COLORS[modelKey] ?? { bg: "rgba(107,114,128,0.15)", text: "#9ca3af" };
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium font-mono"
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
    score >= 85 ? "#ef4444" : score >= 60 ? "#E8734A" : score >= 30 ? "#f59e0b" : "#2dd4bf";

  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#1a1a2e" }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${score}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs text-[var(--color-text-muted)] tabular-nums w-8 font-mono">{score}%</span>
    </div>
  );
}

const TAB_KEYS: LeaderboardSort[] = ["highest", "lowest", "recent"];
const PAGE_SIZE = 20;

// --- Main component ---

export function LeaderboardPage() {
  const { t, dir } = useLang();
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
        if (append) setLoadingMore(true);
        else setLoading(true);
        setError(null);

        const data = await fetchLeaderboard(sort, PAGE_SIZE, offset);

        if (append) setEntries((prev) => [...prev, ...data.entries]);
        else setEntries(data.entries);
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
    if (days >= 99999) return t("lb.days.inf");
    if (days <= 0) return t("lb.days.dead");
    if (days < 30) return t("lb.days.days", { n: days });
    if (days < 365) return t("lb.days.months", { n: Math.round(days / 30) });
    return t("lb.days.years", { n: +(days / 365).toFixed(1) });
  }

  function getRowBorderColor(score: number): string {
    if (score >= 80) return "#ef4444";
    if (score >= 60) return "#E8734A";
    if (score >= 30) return "#f59e0b";
    return "#2dd4bf";
  }

  const thAlign = dir === "rtl" ? "text-right" : "text-left";

  return (
    <div className="min-h-screen text-white bg-noise bg-scanline bg-grid" dir={dir} style={{ backgroundColor: "#08080c" }}>
      <div className="max-w-[800px] mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-[var(--color-text-muted)] hover:text-gray-300 text-sm mb-4 inline-block transition-colors font-display"
          >
            {t("lb.back")}
          </Link>

          <div className="font-mono text-xs tracking-[0.15em] uppercase text-[var(--color-accent)] mb-2">
            {t("lb.badge")}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold">
            <span
              style={{
                background: "linear-gradient(90deg, #E8734A, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {t("lb.title")}
            </span>
          </h1>
          <p className="text-[var(--color-text-muted)] mt-2 font-display">
            {total > 0
              ? t("lb.count", { n: total })
              : t("lb.empty.title")}
          </p>
        </div>

        {/* Tabs */}
        <div
          className="flex justify-center gap-1 mb-8 rounded-xl p-1 max-w-md mx-auto"
          style={{ backgroundColor: "#0f0f17", border: "1px solid #1a1a2e" }}
        >
          {TAB_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleTabChange(key)}
              className="flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer font-display"
              style={
                activeTab === key
                  ? { backgroundColor: "#1a1a2e", color: "#fff", borderBottom: "2px solid #E8734A" }
                  : { color: "#8B8B8B" }
              }
            >
              {t(`lb.tab.${key}`)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">😵</div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 max-w-sm mx-auto font-display">
              {error}
            </div>
            <button
              onClick={() => loadData(activeTab, 0, false)}
              className="mt-3 text-sm text-[var(--color-text-muted)] hover:text-white underline cursor-pointer font-display"
            >
              {t("lb.retry")}
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !error && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 rounded-lg animate-pulse" style={{ backgroundColor: "#0f0f17" }} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🦗</div>
            <p className="text-[var(--color-text-muted)] text-lg font-display">{t("lb.empty.title")}</p>
            <Link
              to="/"
              className="inline-block mt-4 text-[var(--color-accent)] hover:brightness-125 underline font-display"
            >
              {t("lb.empty.cta")}
            </Link>
          </div>
        )}

        {/* Table */}
        {!loading && !error && entries.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-hidden rounded-xl" style={{ border: "1px solid #1a1a2e" }}>
              <table className="w-full">
                <thead>
                  <tr className="font-mono text-[var(--color-text-muted)] text-xs uppercase tracking-wider" style={{ backgroundColor: "#0f0f17" }}>
                    <th className={`px-4 py-3 ${thAlign} w-12`}>{t("lb.th.rank")}</th>
                    <th className={`px-4 py-3 ${thAlign}`}>{t("lb.th.name")}</th>
                    <th className={`px-4 py-3 ${thAlign}`}>{t("lb.th.role")}</th>
                    <th className={`px-4 py-3 ${thAlign}`}>{t("lb.th.score")}</th>
                    <th className={`px-4 py-3 ${thAlign}`}>{t("lb.th.model")}</th>
                    <th className={`px-4 py-3 ${thAlign}`}>{t("lb.th.days")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "#1a1a2e" }}>
                  {entries.map((entry, i) => {
                    const rank = activeTab === "recent" ? null : i + 1;
                    const isTop3 = rank !== null && rank <= 3;
                    const borderSide = dir === "rtl" ? "borderRight" : "borderLeft";
                    return (
                      <tr
                        key={entry.id}
                        className="hover:bg-white/[0.02] transition-colors"
                        style={isTop3 ? { [borderSide]: `3px solid ${getRowBorderColor(entry.score)}` } : undefined}
                      >
                        <td className="px-4 py-3 text-[var(--color-text-muted)] tabular-nums font-mono">
                          {rank !== null ? (
                            rank <= 3 ? (
                              <span className="text-lg">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>
                            ) : rank
                          ) : <span className="text-gray-700">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            to={`/result/${entry.id}`}
                            className="font-medium hover:text-[var(--color-accent)] transition-colors font-display"
                          >
                            {rank === 1 && "⚠️ "}{entry.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)] text-sm truncate max-w-[200px] font-display">
                          {entry.role}
                        </td>
                        <td className="px-4 py-3"><ScoreMeter score={entry.score} /></td>
                        <td className="px-4 py-3"><ModelBadge modelKey={entry.modelKey} modelName={entry.modelName} /></td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)] text-sm tabular-nums font-mono">
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
                const borderSide = dir === "rtl" ? "borderRight" : "borderLeft";
                return (
                  <Link
                    key={entry.id}
                    to={`/result/${entry.id}`}
                    className="block rounded-xl p-4 transition-all hover:brightness-110"
                    style={{
                      backgroundColor: "#0f0f17",
                      border: "1px solid #1a1a2e",
                      [borderSide]: `3px solid ${getRowBorderColor(entry.score)}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {rank !== null && rank <= 3 && (
                          <span className="text-lg">{rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}</span>
                        )}
                        {rank !== null && rank > 3 && (
                          <span className="text-[var(--color-text-muted)] text-sm font-mono">#{rank}</span>
                        )}
                        <span className="font-medium font-display">
                          {rank !== null && rank <= 3 && "⚠️ "}{entry.name}
                        </span>
                      </div>
                      <span className="text-[var(--color-text-muted)] text-sm font-mono">
                        {formatDaysLeft(entry.daysLeft)}
                      </span>
                    </div>
                    <p className="text-[var(--color-text-muted)] text-sm mb-2 font-display">{entry.role}</p>
                    <div className="flex items-center justify-between">
                      <ScoreMeter score={entry.score} />
                      <ModelBadge modelKey={entry.modelKey} modelName={entry.modelName} />
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
                  className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer font-mono"
                  style={{ border: "1px dashed #2a2a3a" }}
                >
                  {loadingMore ? t("lb.loading") : t("lb.more")}
                </button>
                <p className="text-gray-600 text-xs mt-2 font-mono">
                  {t("lb.showing", { a: entries.length, b: total })}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

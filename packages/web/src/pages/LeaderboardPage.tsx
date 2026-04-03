import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { fetchLeaderboard, getErrorMessage, type LeaderboardEntry, type LeaderboardSort } from "../lib/api";
import { useLang } from "../lib/i18n";

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? "#ef4444" : score >= 55 ? "#E8734A" : score >= 30 ? "#f59e0b" : "#2dd4bf";
  return (
    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: `${color}15`, color }}>{score}%</span>
  );
}

function ModelBadge({ modelName }: { modelName: string }) {
  return (
    <span className="text-xs px-2 py-0.5 rounded text-[var(--color-text-muted)]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
      {modelName}
    </span>
  );
}

const TAB_KEYS: LeaderboardSort[] = ["highest", "lowest", "recent"];
const PAGE_SIZE = 20;

export function LeaderboardPage() {
  const { t, dir } = useLang();

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [activeTab, setActiveTab] = useState<LeaderboardSort>("highest");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async (sort: LeaderboardSort, offset: number, append: boolean) => {
    try {
      if (append) setLoadingMore(true); else setLoading(true);
      setError(null);
      const data = await fetchLeaderboard(sort, PAGE_SIZE, offset);
      if (append) setEntries((p) => [...p, ...data.entries]); else setEntries(data.entries);
      setTotal(data.total);
      setHasMore(data.hasMore);
    } catch (err) { setError(getErrorMessage(err)); }
    finally { setLoading(false); setLoadingMore(false); }
  }, []);

  useEffect(() => { loadData(activeTab, 0, false); }, [activeTab, loadData]);

  function formatDays(days: number): string {
    if (days >= 99999) return t("lb.days.inf");
    if (days <= 0) return t("lb.days.dead");
    if (days < 30) return t("lb.days.days", { n: days });
    if (days < 365) return t("lb.days.months", { n: Math.round(days / 30) });
    return t("lb.days.years", { n: +(days / 365).toFixed(1) });
  }

  // Stats
  const avgScore = entries.length > 0 ? Math.round(entries.reduce((a, e) => a + e.score, 0) / entries.length) : 0;
  const modelCounts: Record<string, number> = {};
  entries.forEach((e) => { modelCounts[e.modelName] = (modelCounts[e.modelName] || 0) + 1; });
  const topModel = Object.entries(modelCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

  const thCls = "px-4 py-3 text-left text-xs font-display tracking-wider uppercase text-[var(--color-text-muted)]";

  return (
    <div className="min-h-screen bg-noise bg-scanline bg-grid" dir={dir}>
      <div className="max-w-[900px] mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-[var(--color-text-muted)] hover:text-white text-sm mb-4 inline-block transition-colors">
            {t("lb.back")}
          </Link>
          <p className="font-display text-xs tracking-[0.12em] uppercase text-[var(--color-text-muted)] mb-2">{t("lb.badge")}</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">{t("lb.title")}</h1>
          <p className="text-[var(--color-text-muted)] mt-2 text-sm">
            {total > 0 ? t("lb.count", { n: total }) : t("lb.empty.title")}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-1 mb-8 rounded-lg p-1 max-w-sm mx-auto" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
          {TAB_KEYS.map((key) => (
            <button key={key} onClick={() => { if (key !== activeTab) setActiveTab(key); }}
              className="flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 cursor-pointer"
              style={activeTab === key ? { backgroundColor: "rgba(255,255,255,0.06)", color: "#fff" } : { color: "#8B8B8B" }}>
              {t(`lb.tab.${key}`)}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-center py-8">
            <p className="text-sm text-red-300 mb-3">{error}</p>
            <button onClick={() => loadData(activeTab, 0, false)} className="text-sm text-[var(--color-text-muted)] hover:text-white underline cursor-pointer">{t("lb.retry")}</button>
          </div>
        )}

        {loading && !error && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded-lg animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
            ))}
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-text-muted)]">{t("lb.empty.title")}</p>
            <Link to="/" className="inline-block mt-3 text-[var(--color-accent)] hover:brightness-125 underline text-sm">{t("lb.empty.cta")}</Link>
          </div>
        )}

        {!loading && !error && entries.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-hidden rounded-xl" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                    <th className={thCls + " w-12"}>{t("lb.th.rank")}</th>
                    <th className={thCls}>{t("lb.th.name")}</th>
                    <th className={thCls}>{t("lb.th.role")}</th>
                    <th className={thCls}>{t("lb.th.score")}</th>
                    <th className={thCls}>{t("lb.th.model")}</th>
                    <th className={thCls}>{t("lb.th.days")}</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, i) => {
                    const rank = activeTab === "recent" ? null : i + 1;
                    return (
                      <tr key={entry.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-3 text-[var(--color-text-muted)] font-mono text-sm">
                          {rank !== null ? (rank <= 3 ? ["🥇", "🥈", "🥉"][rank - 1] : rank) : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/result/${entry.id}`} className="font-medium text-sm hover:text-[var(--color-accent)] transition-colors">{entry.name}</Link>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)] text-sm truncate max-w-[180px]">{entry.role}</td>
                        <td className="px-4 py-3"><ScoreBadge score={entry.score} /></td>
                        <td className="px-4 py-3"><ModelBadge modelName={entry.modelName} /></td>
                        <td className="px-4 py-3 text-[var(--color-text-muted)] text-sm font-mono">{formatDays(entry.daysLeft)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="sm:hidden space-y-2">
              {entries.map((entry, i) => {
                const rank = activeTab === "recent" ? null : i + 1;
                return (
                  <Link key={entry.id} to={`/result/${entry.id}`} className="block rounded-lg p-3 transition-colors hover:bg-white/[0.02]"
                    style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {rank !== null && rank <= 3 && <span className="text-sm">{["🥇", "🥈", "🥉"][rank - 1]}</span>}
                        {rank !== null && rank > 3 && <span className="text-xs text-[var(--color-text-muted)] font-mono">#{rank}</span>}
                        <span className="font-medium text-sm">{entry.name}</span>
                      </div>
                      <ScoreBadge score={entry.score} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--color-text-muted)]">{entry.role}</span>
                      <span className="text-xs text-[var(--color-text-muted)] font-mono">{formatDays(entry.daysLeft)}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            {hasMore && (
              <div className="text-center mt-6">
                <button onClick={() => { if (!loadingMore && hasMore) loadData(activeTab, entries.length, true); }} disabled={loadingMore}
                  className="rounded-lg px-5 py-2 text-sm text-[var(--color-text-muted)] hover:text-white disabled:opacity-50 transition-colors cursor-pointer"
                  style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                  {loadingMore ? t("lb.loading") : t("lb.more")}
                </button>
                <p className="text-xs text-gray-600 mt-2 font-mono">{t("lb.showing", { a: entries.length, b: total })}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              {[
                { label: t("lb.stats.total"), value: String(total) },
                { label: t("lb.stats.avg"), value: `${avgScore}%` },
                { label: t("lb.stats.model"), value: topModel },
              ].map((s) => (
                <div key={s.label} className="rounded-lg p-4 text-center" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <p className="font-mono text-lg font-bold text-white">{s.value}</p>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

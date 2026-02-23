import { Hono } from "hono";
import { getLeaderboard, type LeaderboardSort } from "../lib/db.js";

interface LeaderboardRow {
  id: string;
  name: string;
  role: string;
  score: number;
  modelKey: string;
  modelName: string;
  daysLeft: number;
  createdAt: string | null;
}

const leaderboard = new Hono();

const VALID_SORTS: LeaderboardSort[] = ["highest", "lowest", "recent"];
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 20;

leaderboard.get("/api/leaderboard", async (c) => {
  const sortParam = c.req.query("sort") ?? "highest";
  const limitParam = c.req.query("limit");
  const offsetParam = c.req.query("offset");

  // Validate sort
  const sort = VALID_SORTS.includes(sortParam as LeaderboardSort)
    ? (sortParam as LeaderboardSort)
    : "highest";

  // Validate limit & offset
  const limit = Math.min(
    Math.max(1, parseInt(limitParam ?? "", 10) || DEFAULT_LIMIT),
    MAX_LIMIT,
  );
  const offset = Math.max(0, parseInt(offsetParam ?? "", 10) || 0);

  const { entries, total } = await getLeaderboard(sort, limit, offset);

  return c.json({
    entries: (entries as unknown as LeaderboardRow[]).map((e) => ({
      id: e.id,
      name: e.name,
      role: e.role,
      score: e.score,
      modelKey: e.modelKey,
      modelName: e.modelName,
      daysLeft: e.daysLeft,
      createdAt: e.createdAt,
    })),
    total,
    hasMore: offset + limit < total,
  });
});

export { leaderboard };

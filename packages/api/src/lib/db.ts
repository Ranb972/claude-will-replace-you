import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq, desc, asc, sql, count } from "drizzle-orm";
import { results } from "../../../../drizzle/schema.js";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:local.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);

export interface SaveResultData {
  id: string;
  name: string;
  role: string;
  experience: number;
  description: string;
  technologies?: string[];
  githubUrl?: string;
  modelKey: string;
  modelName: string;
  score: number;
  daysLeft: number;
  headline: string;
  quote: string;
  skillsAnalysis: { skill: string; replaced: boolean; comment: string }[];
  generatedBy: string;
}

export async function saveResult(data: SaveResultData): Promise<string> {
  await db.insert(results).values({
    id: data.id,
    name: data.name,
    role: data.role,
    experience: data.experience,
    description: data.description,
    technologies: data.technologies ? JSON.stringify(data.technologies) : null,
    githubUrl: data.githubUrl || null,
    modelKey: data.modelKey,
    modelName: data.modelName,
    score: data.score,
    daysLeft: data.daysLeft,
    headline: data.headline,
    quote: data.quote,
    skillsAnalysis: JSON.stringify(data.skillsAnalysis),
    generatedBy: data.generatedBy,
  });
  return data.id;
}

export async function getResult(id: string) {
  const rows = await db.select().from(results).where(eq(results.id, id)).limit(1);
  const row = rows[0];
  if (!row) return null;
  return {
    ...row,
    technologies: row.technologies ? JSON.parse(row.technologies) : [],
    skillsAnalysis: JSON.parse(row.skillsAnalysis),
  };
}

export type LeaderboardSort = "highest" | "lowest" | "recent";

export async function getLeaderboard(
  sort: LeaderboardSort = "highest",
  limit = 20,
  offset = 0
): Promise<{ entries: Awaited<ReturnType<typeof getResult>>[]; total: number }> {
  const orderBy =
    sort === "highest"
      ? desc(results.score)
      : sort === "lowest"
        ? asc(results.score)
        : desc(results.createdAt);

  const [rows, totalResult] = await Promise.all([
    db.select().from(results).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: count() }).from(results),
  ]);

  const entries = rows.map((row) => ({
    ...row,
    technologies: row.technologies ? JSON.parse(row.technologies) : [],
    skillsAnalysis: JSON.parse(row.skillsAnalysis),
  }));

  return { entries, total: totalResult[0]?.count ?? 0 };
}

export async function incrementShareCount(id: string): Promise<void> {
  await db
    .update(results)
    .set({ shareCount: sql`${results.shareCount} + 1` })
    .where(eq(results.id, id));
}

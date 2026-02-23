import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const results = sqliteTable("results", {
  id: text("id").primaryKey(), // nanoid, 12 chars
  name: text("name").notNull(),
  role: text("role").notNull(),
  experience: integer("experience").notNull(),
  description: text("description").notNull(),
  technologies: text("technologies"), // JSON array
  githubUrl: text("github_url"),

  // Result
  modelKey: text("model_key").notNull(), // 'haiku'|'sonnet'|'opus'|'titan'|'colossus'|'singularity'|'skynet'|'infinity'
  modelName: text("model_name").notNull(),
  score: integer("score").notNull(), // 0-100
  daysLeft: integer("days_left").notNull(),
  headline: text("headline").notNull(),
  quote: text("quote").notNull(),
  skillsAnalysis: text("skills_analysis").notNull(), // JSON array
  generatedBy: text("generated_by").notNull(), // 'groq-scout'|'groq-70b'|'groq-8b'|'local-fallback'

  createdAt: text("created_at").default(sql`(datetime('now'))`),
  shareCount: integer("share_count").default(0),
});

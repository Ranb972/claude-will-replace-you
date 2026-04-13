import { z } from "zod";

// --- Input ---

export const profileInputSchema = z.object({
  name: z.string().min(1).max(50),
  role: z.string().min(1).max(100),
  experience: z.number().int().min(0).max(40),
  description: z.string().max(500).optional().default(""),
  technologies: z.array(z.string()).optional().default([]),
  githubUrl: z.string().url().optional().or(z.literal("")),
  lang: z.enum(["en", "he"]).optional().default("en"),
  gender: z.enum(["male", "female", "other"]).optional().default("other"),
  showOnLeaderboard: z.boolean().optional().default(false),
});

export type ProfileInput = z.infer<typeof profileInputSchema>;

// --- Model Tiers ---

export interface ModelTier {
  key: string;
  name: string;
  emoji: string;
  year: number | null;
  exists: boolean;
  description: string;
  tier: number;
}

// --- Scoring ---

export interface ScoringResult {
  score: number; // 0-100 (100 = most replaceable)
  model: ModelTier;
  daysLeft: number;
  tier: number; // 1-8
}

// --- Humor Content (from LLM or fallback) ---

export interface SkillAnalysis {
  skill: string;
  replaced: boolean;
  comment: string;
}

export interface HumorContent {
  headline: string;
  quote: string;
  skillsAnalysis: SkillAnalysis[];
}

// --- Full Analysis Result ---

export interface AnalysisResult {
  id: string;
  model: ModelTier;
  score: number;
  daysLeft: number;
  headline: string;
  quote: string;
  skillsAnalysis: SkillAnalysis[];
  shareUrl: string;
  generatedBy: string;
}

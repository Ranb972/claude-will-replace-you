export interface ProfilePayload {
  name: string;
  role: string;
  experience: number;
  description: string;
  technologies: string[];
  githubUrl?: string;
}

export interface SkillAnalysis {
  skill: string;
  replaced: boolean;
  comment: string;
}

export interface ModelInfo {
  key: string;
  name: string;
  emoji: string;
  year: number | null;
  exists: boolean;
  description: string;
  tier: number;
  scoreMin: number;
  scoreMax: number;
}

export interface AnalysisResult {
  id: string;
  model: ModelInfo;
  score: number;
  daysLeft: number;
  headline: string;
  quote: string;
  skillsAnalysis: SkillAnalysis[];
  shareUrl: string;
  certificateUrl: string;
  generatedBy: string;
}

// --- Leaderboard ---

export interface LeaderboardEntry {
  id: string;
  name: string;
  role: string;
  score: number;
  modelKey: string;
  modelName: string;
  daysLeft: number;
  createdAt: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
  hasMore: boolean;
}

export type LeaderboardSort = "highest" | "lowest" | "recent";

export async function fetchLeaderboard(
  sort: LeaderboardSort = "highest",
  limit = 20,
  offset = 0,
): Promise<LeaderboardResponse> {
  const params = new URLSearchParams({
    sort,
    limit: String(limit),
    offset: String(offset),
  });
  const res = await fetch(`/api/leaderboard?${params}`);

  if (!res.ok) {
    throw new Error(`Leaderboard request failed (${res.status})`);
  }

  return res.json();
}

// --- Analysis ---

export async function submitAnalysis(
  payload: ProfilePayload,
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Request failed (${res.status})`);
  }

  return res.json();
}

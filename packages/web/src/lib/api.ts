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

export async function fetchResult(id: string): Promise<AnalysisResult> {
  const res = await fetch(`/api/result/${encodeURIComponent(id)}`);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message ?? `Result not found (${res.status})`);
  }

  return res.json();
}

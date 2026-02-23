const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface SkillAnalysis {
  skill: string;
  replaced: boolean;
  comment: string;
}

export interface ResultModel {
  key: string;
  name: string;
  emoji?: string;
  year?: number | null;
  exists?: boolean;
  description?: string;
}

export interface AnalysisResult {
  id: string;
  name: string;
  role: string;
  experience: number;
  model: ResultModel;
  score: number;
  daysLeft: number;
  headline: string;
  quote: string;
  skillsAnalysis: SkillAnalysis[];
  shareUrl: string;
  certificateUrl: string;
  generatedBy: string;
  createdAt: string;
  shareCount: number;
}

export async function fetchResult(id: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/result/${encodeURIComponent(id)}`);
  if (!res.ok) {
    throw new Error(res.status === 404 ? "Result not found" : "Failed to fetch result");
  }
  return res.json();
}

export async function trackShare(
  id: string,
  platform: "twitter" | "linkedin" | "whatsapp" | "download"
): Promise<void> {
  await fetch(`${API_BASE}/result/${encodeURIComponent(id)}/share`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ platform }),
  });
}

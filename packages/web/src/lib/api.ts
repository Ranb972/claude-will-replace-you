export interface ProfilePayload {
  name: string;
  role: string;
  experience: number;
  description: string;
  technologies: string[];
  githubUrl?: string;
  lang?: "en" | "he";
  gender?: "male" | "female" | "other";
  showOnLeaderboard?: boolean;
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
}

export interface AnalysisResult {
  id: string;
  name?: string;
  model: ModelInfo;
  score: number;
  daysLeft: number;
  headline: string;
  quote: string;
  skillsAnalysis: SkillAnalysis[];
  shareUrl: string;
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

// --- Error types ---

export type ApiErrorCode =
  | "RATE_LIMITED"
  | "NETWORK_ERROR"
  | "API_ERROR"
  | "NOT_FOUND";

export class ApiError extends Error {
  code: ApiErrorCode;
  status: number;

  constructor(message: string, code: ApiErrorCode, status: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

const ERROR_MESSAGES: Record<ApiErrorCode, string> = {
  RATE_LIMITED: "לאט לאט! יותר מדי בקשות 🐌 נסה שוב בעוד כמה דקות",
  NETWORK_ERROR: "אין חיבור לשרת 😵 בדוק את האינטרנט ונסה שוב",
  API_ERROR: "משהו השתבש בצד שלנו 🤖 נסה שוב מאוחר יותר",
  NOT_FOUND: "לא נמצא 🔍 אולי הקישור שגוי?",
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return ERROR_MESSAGES[error.code];
  }
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  return ERROR_MESSAGES.API_ERROR;
}

export function getErrorCode(error: unknown): ApiErrorCode {
  if (error instanceof ApiError) {
    return error.code;
  }
  if (error instanceof TypeError && error.message === "Failed to fetch") {
    return "NETWORK_ERROR";
  }
  return "API_ERROR";
}

// --- API calls ---

async function handleResponse<T>(
  res: Response,
  notFoundCode?: ApiErrorCode,
): Promise<T> {
  if (res.ok) {
    return res.json();
  }

  if (res.status === 429) {
    throw new ApiError("Rate limited", "RATE_LIMITED", 429);
  }

  if (res.status === 404) {
    throw new ApiError("Not found", notFoundCode ?? "NOT_FOUND", 404);
  }

  throw new ApiError("API error", "API_ERROR", res.status);
}

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
  return handleResponse(res);
}

export async function submitAnalysis(
  payload: ProfilePayload,
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse(res);
}

export async function fetchResult(id: string): Promise<AnalysisResult> {
  const res = await fetch(`/api/result/${encodeURIComponent(id)}`);
  return handleResponse(res, "NOT_FOUND");
}

export async function trackShare(id: string, _platform: string): Promise<void> {
  try {
    await fetch(`/api/result/${encodeURIComponent(id)}/share`, {
      method: "POST",
    });
  } catch {
    // Fire-and-forget — don't block the UI if tracking fails
  }
}

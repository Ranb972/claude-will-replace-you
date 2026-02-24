import type { ScoringResult } from "../types.js";
import { getModelByScore } from "./models.js";

export interface ScoringInput {
  experience: number;
  role: string;
  description: string;
  technologies?: string[];
  githubUrl?: string;
}

// ─── Role Protection (0-20) ───────────────────────────────────────────────────

const ROLE_PROTECTION: Record<string, number> = {
  // Hard to replace (leadership + deep specialization)
  cto: 20,
  "chief technology officer": 20,
  "vp engineering": 18,
  "vp of engineering": 18,
  "principal engineer": 18,
  "distinguished engineer": 19,
  architect: 17,
  "solution architect": 17,
  "software architect": 17,
  "engineering manager": 16,
  "staff engineer": 16,
  "tech lead": 15,
  "team lead": 15,
  "product manager": 15,
  "ml engineer": 14,
  "machine learning engineer": 14,
  "data scientist": 13,
  "security engineer": 14,
  "site reliability engineer": 13,
  sre: 13,
  // Mid-range
  "senior developer": 12,
  "senior engineer": 12,
  "senior software engineer": 12,
  designer: 12,
  "ux designer": 12,
  "ui designer": 11,
  "devops engineer": 11,
  "platform engineer": 11,
  "full stack developer": 10,
  "fullstack developer": 10,
  "full-stack developer": 10,
  "backend developer": 10,
  "backend engineer": 10,
  "frontend developer": 9,
  "frontend engineer": 9,
  "mobile developer": 9,
  "android developer": 9,
  "ios developer": 9,
  "data engineer": 10,
  "data analyst": 8,
  // Easier to replace
  developer: 8,
  "software developer": 8,
  "software engineer": 8,
  "web developer": 7,
  "qa engineer": 6,
  "test engineer": 6,
  "qa automation": 7,
  "support engineer": 5,
  "technical writer": 4,
  "junior developer": 3,
  "junior engineer": 3,
  junior: 3,
  intern: 1,
  student: 2,
};

const DEFAULT_ROLE_PROTECTION = 8;

// ─── Technology Lists ─────────────────────────────────────────────────────────

const HARD_TO_REPLACE_TECH = new Set([
  "rust",
  "systems programming",
  "kernel",
  "embedded",
  "fpga",
  "cuda",
  "blockchain",
  "compiler",
  "operating systems",
  "hardware",
  "robotics",
  "security",
  "cryptography",
  "verilog",
  "vhdl",
  "assembly",
  "low-level",
]);

const EASY_TO_REPLACE_TECH = new Set([
  "html",
  "css",
  "wordpress",
  "basic sql",
  "excel",
  "google sheets",
  "html/css",
  "no-code",
  "wix",
  "squarespace",
]);

// ─── Description Keywords ─────────────────────────────────────────────────────

const PROTECTION_KEYWORDS = [
  "manage",
  "lead",
  "team",
  "architect",
  "design system",
  "client",
  "stakeholder",
  "mentor",
  "strategy",
  "decision",
  "negotiate",
  "hire",
  "budget",
  "vision",
  "culture",
  "innovate",
  "patent",
  "research",
  "publish",
  "novel",
];

const VULNERABILITY_KEYWORDS = [
  "fix bugs",
  "maintain",
  "update",
  "copy",
  "paste",
  "basic",
  "simple",
  "routine",
  "standard",
  "template",
  "boilerplate",
  "crud",
  "wordpress",
  "landing page",
];

// ─── Scoring Functions ────────────────────────────────────────────────────────

function experienceProtection(years: number): number {
  return Math.min(Math.max(years, 0), 30);
}

function roleProtection(role: string): number {
  const normalized = role.trim().toLowerCase();

  // Exact match
  if (normalized in ROLE_PROTECTION) {
    return ROLE_PROTECTION[normalized];
  }

  // Fuzzy: find the best matching key contained in the role string
  let bestScore = -1;
  for (const [key, value] of Object.entries(ROLE_PROTECTION)) {
    if (normalized.includes(key) && value > bestScore) {
      bestScore = value;
    }
  }
  if (bestScore >= 0) return bestScore;

  // Reverse fuzzy: role string contained in a key
  for (const [key, value] of Object.entries(ROLE_PROTECTION)) {
    if (key.includes(normalized) && value > bestScore) {
      bestScore = value;
    }
  }
  if (bestScore >= 0) return bestScore;

  return DEFAULT_ROLE_PROTECTION;
}

function techProtection(technologies: string[]): number {
  let points = 0;
  for (const tech of technologies) {
    const normalized = tech.trim().toLowerCase();
    if (HARD_TO_REPLACE_TECH.has(normalized)) {
      points += 2;
    } else if (EASY_TO_REPLACE_TECH.has(normalized)) {
      points -= 1;
    }
  }
  return Math.max(0, Math.min(points, 15));
}

function descriptionProtection(description: string): number {
  const lower = description.toLowerCase();
  let points = 0;
  for (const keyword of PROTECTION_KEYWORDS) {
    if (lower.includes(keyword)) {
      points += 1;
    }
  }
  for (const keyword of VULNERABILITY_KEYWORDS) {
    if (lower.includes(keyword)) {
      points -= 1;
    }
  }
  return Math.max(0, Math.min(points, 15));
}

function githubProtection(githubUrl: string | undefined): number {
  return githubUrl && githubUrl.trim().length > 0 ? 5 : 0;
}

// ─── Days Left Calculation ────────────────────────────────────────────────────

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calculateDaysLeft(score: number): number {
  if (score >= 85) return randomBetween(1, 30);
  if (score >= 65) return randomBetween(30, 365);
  if (score >= 45) return randomBetween(365, 1000);
  if (score >= 30) return randomBetween(1000, 2000);
  if (score >= 20) return randomBetween(2000, 3000);
  if (score >= 10) return randomBetween(3000, 5000);
  if (score >= 5) return randomBetween(5000, 8000);
  return 99999;
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function calculateScore(input: ScoringInput): ScoringResult {
  const expPts = experienceProtection(input.experience);
  const rolePts = roleProtection(input.role);
  const techPts = techProtection(input.technologies ?? []);
  const descPts = descriptionProtection(input.description);
  const ghPts = githubProtection(input.githubUrl);

  const protection = Math.min(expPts + rolePts + techPts + descPts + ghPts, 100);
  const score = Math.max(0, Math.min(100 - protection, 100));

  const model = getModelByScore(score);
  const daysLeft = calculateDaysLeft(score);

  return {
    score,
    model,
    daysLeft,
    tier: model.tier,
  };
}

// Exported for testing
export const _testing = {
  experienceProtection,
  roleProtection,
  techProtection,
  descriptionProtection,
  githubProtection,
  calculateDaysLeft,
  randomBetween,
};

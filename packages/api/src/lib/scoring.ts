import { getModelByScore, type ModelTier } from "./models.js";

export interface ScoringInput {
  experience: number;
  role: string;
  description: string;
  technologies: string[];
  hasGithub: boolean;
}

export interface ScoringResult {
  score: number;
  model: ModelTier;
  daysLeft: number;
  tier: number;
}

const ROLE_PROTECTION: Record<string, number> = {
  cto: 20,
  "vp engineering": 18,
  "vp of engineering": 18,
  architect: 17,
  "principal engineer": 18,
  "staff engineer": 16,
  "engineering manager": 16,
  "tech lead": 15,
  "product manager": 15,
  "ml engineer": 14,
  "data scientist": 13,
  "senior developer": 12,
  "senior engineer": 12,
  designer: 12,
  "devops engineer": 11,
  "full stack developer": 10,
  "fullstack developer": 10,
  "backend developer": 10,
  "frontend developer": 9,
  "qa engineer": 6,
  "support engineer": 5,
  "technical writer": 4,
  "junior developer": 3,
  intern: 1,
};
const DEFAULT_ROLE_PROTECTION = 8;

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
]);

const EASY_TO_REPLACE_TECH = new Set([
  "html",
  "css",
  "wordpress",
  "basic sql",
  "excel",
  "google sheets",
]);

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

function experienceProtection(years: number): number {
  return Math.min(years, 30);
}

function roleProtection(role: string): number {
  const normalized = role.toLowerCase().trim();
  return ROLE_PROTECTION[normalized] ?? DEFAULT_ROLE_PROTECTION;
}

function techProtection(technologies: string[]): number {
  let score = 0;
  for (const tech of technologies) {
    const lower = tech.toLowerCase().trim();
    if (HARD_TO_REPLACE_TECH.has(lower)) score += 2;
    if (EASY_TO_REPLACE_TECH.has(lower)) score -= 1;
  }
  return Math.max(0, Math.min(score, 15));
}

function descriptionProtection(description: string): number {
  const lower = description.toLowerCase();
  let score = 0;
  for (const kw of PROTECTION_KEYWORDS) {
    if (lower.includes(kw)) score += 1;
  }
  for (const kw of VULNERABILITY_KEYWORDS) {
    if (lower.includes(kw)) score -= 1;
  }
  return Math.max(0, Math.min(score, 15));
}

function githubProtection(hasGithub: boolean): number {
  return hasGithub ? 5 : 0;
}

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

export function calculateScore(input: ScoringInput): ScoringResult {
  const protection = Math.min(
    100,
    experienceProtection(input.experience) +
      roleProtection(input.role) +
      techProtection(input.technologies) +
      descriptionProtection(input.description) +
      githubProtection(input.hasGithub)
  );

  const score = Math.max(0, Math.min(100, 100 - protection));
  const model = getModelByScore(score);
  const daysLeft = calculateDaysLeft(score);

  return { score, model, daysLeft, tier: model.tier };
}

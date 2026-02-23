import type { ModelTier } from "../types.js";

export const MODEL_TIERS: ModelTier[] = [
  {
    key: "haiku",
    name: 'Claude Haiku 4.5',
    emoji: "🤖",
    year: 2025,
    exists: true,
    description: "The lightweight speed demon",
    tier: 1,
    scoreMin: 85,
    scoreMax: 100,
  },
  {
    key: "sonnet",
    name: 'Claude Sonnet 4.6',
    emoji: "🤖",
    year: 2025,
    exists: true,
    description: "The balanced all-rounder",
    tier: 2,
    scoreMin: 65,
    scoreMax: 84,
  },
  {
    key: "opus",
    name: 'Claude Opus 4.6',
    emoji: "🤖",
    year: 2025,
    exists: true,
    description: "The heavy-duty powerhouse",
    tier: 3,
    scoreMin: 45,
    scoreMax: 64,
  },
  {
    key: "titan",
    name: 'Claude 5.0 "Titan"',
    emoji: "🔮",
    year: 2027,
    exists: false,
    description: "The next frontier of reasoning",
    tier: 4,
    scoreMin: 30,
    scoreMax: 44,
  },
  {
    key: "colossus",
    name: 'Claude 6.0 "Colossus"',
    emoji: "🔮",
    year: 2029,
    exists: false,
    description: "The next-generation reasoning engine",
    tier: 5,
    scoreMin: 20,
    scoreMax: 29,
  },
  {
    key: "singularity",
    name: 'Claude 7.0 "Singularity"',
    emoji: "🔮",
    year: 2032,
    exists: false,
    description: "On the edge of artificial general intelligence",
    tier: 6,
    scoreMin: 10,
    scoreMax: 19,
  },
  {
    key: "skynet",
    name: 'Claude 9.0 "Skynet"',
    emoji: "🔮",
    year: 2035,
    exists: false,
    description: "Full artificial consciousness",
    tier: 7,
    scoreMin: 5,
    scoreMax: 9,
  },
  {
    key: "infinity",
    name: 'Claude \u221E "The One"',
    emoji: "🔮",
    year: null,
    exists: false,
    description: "The ultimate form — if it ever arrives",
    tier: 8,
    scoreMin: 0,
    scoreMax: 4,
  },
];

export function getModelForScore(score: number): ModelTier {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const model of MODEL_TIERS) {
    if (clamped >= model.scoreMin && clamped <= model.scoreMax) {
      return model;
    }
  }
  // Fallback (should never happen with valid 0-100 score)
  return MODEL_TIERS[MODEL_TIERS.length - 1];
}

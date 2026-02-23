export interface ModelTier {
  key: string;
  name: string;
  emoji: string;
  year: number | null;
  exists: boolean;
  description: string;
  tier: number;
}

export const MODEL_TIERS: ModelTier[] = [
  { key: "haiku", name: 'Claude Haiku 4.5', emoji: "⚡", year: null, exists: true, description: "The fastest, lightest Claude", tier: 1 },
  { key: "sonnet", name: 'Claude Sonnet 4.6', emoji: "🎯", year: null, exists: true, description: "The balanced all-rounder", tier: 2 },
  { key: "opus", name: 'Claude Opus 4.6', emoji: "🧠", year: null, exists: true, description: "The most capable Claude", tier: 3 },
  { key: "titan", name: 'Claude 5.0 "Titan"', emoji: "🔮", year: 2027, exists: false, description: "Next-gen reasoning engine", tier: 4 },
  { key: "colossus", name: 'Claude 6.0 "Colossus"', emoji: "🔮", year: 2029, exists: false, description: "Multi-modal powerhouse", tier: 5 },
  { key: "singularity", name: 'Claude 7.0 "Singularity"', emoji: "🔮", year: 2032, exists: false, description: "Near-AGI capabilities", tier: 6 },
  { key: "skynet", name: 'Claude 9.0 "Skynet"', emoji: "💀", year: 2035, exists: false, description: "Full artificial consciousness", tier: 7 },
  { key: "infinity", name: 'Claude ∞ "The One"', emoji: "♾️", year: null, exists: false, description: "The theoretical limit", tier: 8 },
];

export function getModelByKey(key: string): ModelTier | undefined {
  return MODEL_TIERS.find((m) => m.key === key);
}

export function getModelByScore(score: number): ModelTier {
  if (score >= 85) return MODEL_TIERS[0]; // haiku
  if (score >= 65) return MODEL_TIERS[1]; // sonnet
  if (score >= 45) return MODEL_TIERS[2]; // opus
  if (score >= 30) return MODEL_TIERS[3]; // titan
  if (score >= 20) return MODEL_TIERS[4]; // colossus
  if (score >= 10) return MODEL_TIERS[5]; // singularity
  if (score >= 5) return MODEL_TIERS[6];  // skynet
  return MODEL_TIERS[7];                   // infinity
}

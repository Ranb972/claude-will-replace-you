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

export const MODEL_COLORS: Record<string, { accent: string; bg: string; glow: string }> = {
  haiku:       { accent: "#f87171", bg: "#0a0a0f", glow: "rgba(248,113,113,0.15)" },
  sonnet:      { accent: "#fb923c", bg: "#0a0a0f", glow: "rgba(251,146,60,0.15)" },
  opus:        { accent: "#facc15", bg: "#0a0a0f", glow: "rgba(250,204,21,0.15)" },
  titan:       { accent: "#c084fc", bg: "#0a0a0f", glow: "rgba(192,132,252,0.15)" },
  colossus:    { accent: "#a78bfa", bg: "#0a0a0f", glow: "rgba(167,139,250,0.15)" },
  singularity: { accent: "#818cf8", bg: "#0a0a0f", glow: "rgba(129,140,248,0.15)" },
  skynet:      { accent: "#60a5fa", bg: "#0a0a0f", glow: "rgba(96,165,250,0.15)" },
  infinity:    { accent: "#22d3ee", bg: "#0a0a0f", glow: "rgba(34,211,238,0.15)" },
};

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

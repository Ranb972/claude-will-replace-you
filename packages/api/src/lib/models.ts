import type { ModelTier } from "../types.js";

export const MODEL_TIERS: ModelTier[] = [
  {
    key: "haiku",
    name: 'Claude Haiku 4.5',
    emoji: "🤖",
    year: null,
    exists: true,
    description: "The fast, lightweight model",
    tier: 1,
    scoreMin: 85,
    scoreMax: 100,
  },
  {
    key: "sonnet",
    name: 'Claude Sonnet 4.6',
    emoji: "🤖",
    year: null,
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
    year: null,
    exists: true,
    description: "The most capable current model",
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
    description: "The next-generation reasoning engine",
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
    description: "Full autonomous coding agent",
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
    description: "Approaching artificial general intelligence",
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
    description: "The theoretical limit of AI",
    tier: 8,
    scoreMin: 0,
    scoreMax: 4,
  },
];

/** Color accent per model key for danger-level theming */
export const MODEL_COLORS: Record<string, { accent: string; bg: string; glow: string }> = {
  haiku:       { accent: "#ef4444", bg: "#1a0505", glow: "rgba(239,68,68,0.3)" },    // Red — critical
  sonnet:      { accent: "#f97316", bg: "#1a0a02", glow: "rgba(249,115,22,0.3)" },   // Orange — high
  opus:        { accent: "#eab308", bg: "#1a1502", glow: "rgba(234,179,8,0.3)" },     // Yellow — moderate
  titan:       { accent: "#22c55e", bg: "#021a08", glow: "rgba(34,197,94,0.3)" },     // Green — low
  colossus:    { accent: "#06b6d4", bg: "#021519", glow: "rgba(6,182,212,0.3)" },     // Cyan — very low
  singularity: { accent: "#8b5cf6", bg: "#0d0219", glow: "rgba(139,92,246,0.3)" },    // Purple — minimal
  skynet:      { accent: "#ec4899", bg: "#19020d", glow: "rgba(236,72,153,0.3)" },    // Pink — near-zero
  infinity:    { accent: "#f0f0f0", bg: "#0a0a0a", glow: "rgba(240,240,240,0.2)" },   // White — irreplaceable
};

export function getModelByKey(key: string): ModelTier | undefined {
  return MODEL_TIERS.find((m) => m.key === key);
}

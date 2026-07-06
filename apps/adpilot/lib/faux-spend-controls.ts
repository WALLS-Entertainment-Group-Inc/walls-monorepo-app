export type SpendPacing = "even" | "standard" | "accelerated";

export type SpendSettings = {
  autoScaling: boolean;
  aggressiveness: number;
  maxDailyIncreasePct: number;
  scaleUpCapPct: number;
  roasFloor: number;
  cpaCeiling: number;
  cooldownHours: number;
  pacing: SpendPacing;
  learningPhaseProtection: boolean;
  pauseOnFatigue: boolean;
};

export const FAUX_SPEND_DEFAULTS: SpendSettings = {
  autoScaling: true,
  aggressiveness: 62,
  maxDailyIncreasePct: 18,
  scaleUpCapPct: 35,
  roasFloor: 2.4,
  cpaCeiling: 42,
  cooldownHours: 24,
  pacing: "standard",
  learningPhaseProtection: true,
  pauseOnFatigue: true,
};

export const PACING_OPTIONS: { value: SpendPacing; label: string; hint: string }[] = [
  { value: "even", label: "Even", hint: "Spread budget evenly across the day" },
  { value: "standard", label: "Standard", hint: "Platform-default delivery curve" },
  { value: "accelerated", label: "Accelerated", hint: "Spend faster when performance is strong" },
];

export const COOLDOWN_OPTIONS = [
  { value: 6, label: "6 hours" },
  { value: 12, label: "12 hours" },
  { value: 24, label: "24 hours" },
  { value: 48, label: "48 hours" },
] as const;

export function getAggressivenessLabel(value: number) {
  if (value < 34) return "Conservative";
  if (value < 67) return "Balanced";
  return "Aggressive";
}

export function getRiskScore(aggressiveness: number, maxDailyIncreasePct: number) {
  const raw = aggressiveness * 0.55 + maxDailyIncreasePct * 1.8;
  return Math.min(99, Math.max(8, Math.round(raw)));
}

export function getProjectedWeeklyUplift(
  aggressiveness: number,
  maxDailyIncreasePct: number,
  autoScaling: boolean,
) {
  if (!autoScaling) return "0%";
  const pct = Math.round(aggressiveness * 0.12 + maxDailyIncreasePct * 0.85);
  return `+${Math.min(48, pct)}%`;
}

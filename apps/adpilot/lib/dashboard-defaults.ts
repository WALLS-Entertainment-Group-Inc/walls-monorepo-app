export const ZERO_DASHBOARD_STATS = [
  { label: "Ad spend", value: "$0", change: "—", positive: true },
  { label: "Impressions", value: "0", change: "—", positive: true },
  { label: "CTR", value: "0.00%", change: "—", positive: true },
  { label: "ROAS", value: "—", change: "—", positive: true },
] as const;

export const ZERO_WEEKLY_BARS = [
  { label: "W1", value: 0, spendMicros: 0 },
  { label: "W2", value: 0, spendMicros: 0 },
  { label: "W3", value: 0, spendMicros: 0 },
  { label: "W4", value: 0, spendMicros: 0 },
] as const;

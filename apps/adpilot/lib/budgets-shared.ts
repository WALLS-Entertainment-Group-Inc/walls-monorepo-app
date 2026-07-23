/** Shared budget period / allocation / objective types & constants (safe for client). */

export const BUDGET_PERIOD_TYPES = [
  "quarter",
  "month",
  "year",
  "custom",
  "ongoing",
] as const;

export type BudgetPeriodType = (typeof BUDGET_PERIOD_TYPES)[number];

export const BUDGET_PERIOD_STATUSES = [
  "planned",
  "active",
  "completed",
  "archived",
] as const;

export type BudgetPeriodStatus = (typeof BUDGET_PERIOD_STATUSES)[number];

export const BUDGET_ALLOCATION_CATEGORIES = [
  "media_spend",
  "creative",
  "agency",
  "tooling",
  "contingency",
  "other",
] as const;

export type BudgetAllocationCategory =
  (typeof BUDGET_ALLOCATION_CATEGORIES)[number];

export const BUDGET_CHANNELS = [
  "meta",
  "google",
  "tiktok",
  "linkedin",
  "other",
  "all",
] as const;

export type BudgetChannel = (typeof BUDGET_CHANNELS)[number];

export const BUDGET_OBJECTIVE_METRICS = [
  "roas",
  "ctr",
  "cpa",
  "cpc",
  "conversions",
  "conversion_rate",
  "reach",
  "impressions",
  "frequency",
  "cpm",
  "brand_recognition",
  "awareness",
  "engagement",
  "custom",
] as const;

export type BudgetObjectiveMetric = (typeof BUDGET_OBJECTIVE_METRICS)[number];

export const BUDGET_TARGET_OPERATORS = ["gte", "lte", "eq"] as const;

export type BudgetTargetOperator = (typeof BUDGET_TARGET_OPERATORS)[number];

export const BUDGET_OBJECTIVE_STATUSES = [
  "active",
  "achieved",
  "missed",
  "cancelled",
] as const;

export type BudgetObjectiveStatus = (typeof BUDGET_OBJECTIVE_STATUSES)[number];

export type BudgetAllocation = {
  id: string;
  periodId: string;
  name: string;
  category: BudgetAllocationCategory;
  channel: BudgetChannel | null;
  amountMicros: number;
  currency: string;
  notes: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string | null;
};

export type BudgetObjective = {
  id: string;
  periodId: string;
  name: string;
  metricKey: BudgetObjectiveMetric;
  customMetricLabel: string | null;
  targetValue: number;
  targetOperator: BudgetTargetOperator;
  targetUnit: string | null;
  isPrimary: boolean;
  priority: number;
  status: BudgetObjectiveStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type BudgetPeriod = {
  id: string;
  name: string;
  description: string | null;
  periodType: BudgetPeriodType;
  fiscalYear: number | null;
  fiscalQuarter: number | null;
  startDate: string;
  endDate: string | null;
  status: BudgetPeriodStatus;
  currency: string;
  primaryFocus: string | null;
  createdAt: string;
  updatedAt: string | null;
  /** True when status is active and today falls within the date window. */
  isCurrentlyEffective: boolean;
  totalBudgetMicros: number;
  allocations: BudgetAllocation[];
  objectives: BudgetObjective[];
};

export const PERIOD_TYPE_OPTIONS: Array<{
  value: BudgetPeriodType;
  label: string;
  hint: string;
}> = [
  { value: "quarter", label: "Quarter", hint: "Fiscal or calendar quarter" },
  { value: "month", label: "Month", hint: "Single calendar month" },
  { value: "year", label: "Year", hint: "Fiscal or calendar year" },
  { value: "custom", label: "Custom", hint: "Any fixed date range" },
  {
    value: "ongoing",
    label: "Ongoing",
    hint: "No end date — stays active until archived",
  },
];

export const PERIOD_STATUS_OPTIONS: Array<{
  value: BudgetPeriodStatus;
  label: string;
}> = [
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export const ALLOCATION_CATEGORY_OPTIONS: Array<{
  value: BudgetAllocationCategory;
  label: string;
}> = [
  { value: "media_spend", label: "Media spend" },
  { value: "creative", label: "Creative" },
  { value: "agency", label: "Agency / fees" },
  { value: "tooling", label: "Tooling" },
  { value: "contingency", label: "Contingency" },
  { value: "other", label: "Other" },
];

export const CHANNEL_OPTIONS: Array<{
  value: BudgetChannel;
  label: string;
}> = [
  { value: "all", label: "All channels" },
  { value: "meta", label: "Meta" },
  { value: "google", label: "Google" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "other", label: "Other" },
];

export const OBJECTIVE_METRIC_OPTIONS: Array<{
  value: BudgetObjectiveMetric;
  label: string;
  defaultUnit: string | null;
  defaultOperator: BudgetTargetOperator;
}> = [
  { value: "roas", label: "ROAS", defaultUnit: "x", defaultOperator: "gte" },
  { value: "ctr", label: "CTR", defaultUnit: "%", defaultOperator: "gte" },
  { value: "cpa", label: "CPA", defaultUnit: "$", defaultOperator: "lte" },
  { value: "cpc", label: "CPC", defaultUnit: "$", defaultOperator: "lte" },
  {
    value: "conversions",
    label: "Conversions",
    defaultUnit: null,
    defaultOperator: "gte",
  },
  {
    value: "conversion_rate",
    label: "Conversion rate",
    defaultUnit: "%",
    defaultOperator: "gte",
  },
  { value: "reach", label: "Reach", defaultUnit: null, defaultOperator: "gte" },
  {
    value: "impressions",
    label: "Impressions",
    defaultUnit: null,
    defaultOperator: "gte",
  },
  {
    value: "frequency",
    label: "Frequency",
    defaultUnit: null,
    defaultOperator: "lte",
  },
  { value: "cpm", label: "CPM", defaultUnit: "$", defaultOperator: "lte" },
  {
    value: "brand_recognition",
    label: "Brand recognition",
    defaultUnit: "%",
    defaultOperator: "gte",
  },
  {
    value: "awareness",
    label: "Awareness",
    defaultUnit: "%",
    defaultOperator: "gte",
  },
  {
    value: "engagement",
    label: "Engagement",
    defaultUnit: "%",
    defaultOperator: "gte",
  },
  {
    value: "custom",
    label: "Custom metric",
    defaultUnit: null,
    defaultOperator: "gte",
  },
];

export const TARGET_OPERATOR_OPTIONS: Array<{
  value: BudgetTargetOperator;
  label: string;
  symbol: string;
}> = [
  { value: "gte", label: "At least", symbol: "≥" },
  { value: "lte", label: "At most", symbol: "≤" },
  { value: "eq", label: "Exactly", symbol: "=" },
];

export const MICROS_PER_UNIT = 1_000_000;

export function dollarsToMicros(dollars: number): number {
  if (!Number.isFinite(dollars) || dollars < 0) return 0;
  return Math.round(dollars * MICROS_PER_UNIT);
}

export function microsToDollars(micros: number): number {
  if (!Number.isFinite(micros)) return 0;
  return micros / MICROS_PER_UNIT;
}

export function formatBudgetCurrency(
  micros: number,
  currency = "USD",
  options?: { compact?: boolean },
): string {
  const amount = microsToDollars(micros);
  if (options?.compact && Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatPeriodRange(
  startDate: string,
  endDate: string | null,
): string {
  const start = formatIsoDate(startDate);
  if (!endDate) return `${start} → ongoing`;
  return `${start} → ${formatIsoDate(endDate)}`;
}

function formatIsoDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function formatObjectiveTarget(objective: {
  targetOperator: BudgetTargetOperator;
  targetValue: number;
  targetUnit: string | null;
  metricKey: BudgetObjectiveMetric;
  customMetricLabel: string | null;
}): string {
  const op =
    TARGET_OPERATOR_OPTIONS.find((o) => o.value === objective.targetOperator)
      ?.symbol ?? "≥";
  const unit = objective.targetUnit ?? "";
  const value =
    unit === "%" || unit === "x"
      ? `${formatNumber(objective.targetValue)}${unit}`
      : unit === "$"
        ? `$${formatNumber(objective.targetValue)}`
        : `${formatNumber(objective.targetValue)}${unit ? ` ${unit}` : ""}`;
  return `${op} ${value}`;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function metricLabel(
  metricKey: BudgetObjectiveMetric,
  customMetricLabel: string | null,
): string {
  if (metricKey === "custom") {
    return customMetricLabel?.trim() || "Custom metric";
  }
  return (
    OBJECTIVE_METRIC_OPTIONS.find((m) => m.value === metricKey)?.label ??
    metricKey
  );
}

export function isPeriodCurrentlyEffective(input: {
  status: BudgetPeriodStatus;
  startDate: string;
  endDate: string | null;
  today?: string;
}): boolean {
  if (input.status !== "active") return false;
  const today = input.today ?? new Date().toISOString().slice(0, 10);
  if (input.startDate > today) return false;
  if (input.endDate && input.endDate < today) return false;
  return true;
}

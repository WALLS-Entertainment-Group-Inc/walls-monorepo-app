"use client";

import * as React from "react";
import Link from "next/link";
import {
  Bot,
  CircleDollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
} from "lucide-react";

import { HeroStat } from "@/components/dashboard/dashboard-metrics";
import type { EntityDetailMetrics } from "@/lib/entity-detail-server";
import {
  formatCompactNumber,
  formatCurrencyFromMicros,
  formatPercent,
  formatRoas,
} from "@/lib/format-analytics";

export function formatStatus(status: string | null) {
  if (!status) return "—";
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function isActiveStatus(status: string | null) {
  const normalized = (status ?? "").toLowerCase();
  return normalized === "active" || normalized === "learning";
}

const ENTITY_METRIC_ACCENTS = [
  "var(--walls-sky)",
  "var(--walls-blue)",
  "#00d1c1",
  "#7a04eb",
] as const;

const ENTITY_METRIC_ICONS = [
  CircleDollarSign,
  Eye,
  MousePointerClick,
  TrendingUp,
] as const;

export function EntityMetricsGrid({ metrics }: { metrics: EntityDetailMetrics }) {
  const items = [
    { label: "Spend", value: formatCurrencyFromMicros(metrics.spendMicros) },
    { label: "Impressions", value: formatCompactNumber(metrics.impressions) },
    { label: "CTR", value: formatPercent(metrics.ctr) },
    { label: "ROAS", value: formatRoas(metrics.roas) },
  ];

  return (
    <div className="flex flex-row flex-wrap items-stretch justify-center gap-6 pb-2 pt-2 md:gap-8">
      {items.map((metric, index) => (
        <HeroStat
          key={metric.label}
          label={metric.label}
          value={metric.value}
          change="—"
          positive
          icon={ENTITY_METRIC_ICONS[index] ?? CircleDollarSign}
          accentColor={ENTITY_METRIC_ACCENTS[index] ?? ENTITY_METRIC_ACCENTS[0]}
          delay={index * 0.06}
        />
      ))}
    </div>
  );
}

export function AdPilotBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-walls-yellow/40 bg-walls-yellow/15 px-3 py-1 text-xs font-medium text-neutral-800">
      <Bot className="h-3.5 w-3.5" />
      AdPilot active
    </span>
  );
}

export function AdPilotRowBadge() {
  return (
    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-walls-yellow/40 bg-walls-yellow/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-700">
      <Bot className="h-3 w-3" />
      AdPilot
    </span>
  );
}

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function DetailBreadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div className="mb-8 flex shrink-0 flex-wrap items-center gap-2 text-xs font-light text-neutral-400">
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {index > 0 ? <span className="text-neutral-300">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-neutral-700">
              {item.label}
            </Link>
          ) : (
            <span className="text-neutral-600">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

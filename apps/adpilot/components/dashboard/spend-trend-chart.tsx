"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { DashboardSpendDay } from "@/lib/analytics-server";
import { PREVIEW_SPEND_BY_DAY } from "@/lib/dashboard-defaults";

const TOOLTIP_STYLE = {
  backgroundColor: "rgb(38 38 38)",
  border: "1px solid rgb(64 64 64)",
  borderRadius: "8px",
};

type SpendTrendChartProps = {
  days: DashboardSpendDay[];
};

function formatSpend(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value >= 1000 ? 0 : 2,
  }).format(value);
}

export function SpendTrendChart({ days }: SpendTrendChartProps) {
  const hasLiveData = days.some((day) => day.spendMicros > 0);
  const chartData = hasLiveData ? days : PREVIEW_SPEND_BY_DAY;

  return (
    <div className="relative w-full">
      {!hasLiveData && (
        <div className="pointer-events-none absolute right-0 top-0 z-10">
          <span className="rounded-full border border-neutral-200/80 bg-walls-white/90 px-2.5 py-0.5 text-[10px] font-light uppercase tracking-wider text-neutral-500 shadow-sm">
            Preview
          </span>
        </div>
      )}

      <div className="h-[260px] w-full pt-5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 8, right: 24, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="adpilotSpendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--walls-sky)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--walls-sky)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(212 212 212)"
              vertical
              horizontal
            />

            <XAxis
              dataKey="label"
              axisLine={{ stroke: "rgb(212 212 212)" }}
              tick={{ fill: "rgb(115 115 115)", fontSize: 11 }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={28}
            />

            <YAxis
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "rgb(115 115 115)", fontSize: 11 }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `$${Math.round(value / 1000)}k` : `$${value}`
              }
              width={44}
            />

            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelStyle={{ color: "rgb(212 212 216)" }}
              itemStyle={{ color: "rgb(212 212 216)" }}
              formatter={(value: number) => [formatSpend(value), "Spend"]}
            />

            <Area
              type="monotone"
              dataKey="spend"
              stroke="var(--walls-sky)"
              strokeWidth={2.5}
              fill="url(#adpilotSpendGrad)"
              name="Spend"
              activeDot={{
                r: 5,
                fill: "var(--walls-white)",
                stroke: "var(--walls-sky)",
                strokeWidth: 2.5,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

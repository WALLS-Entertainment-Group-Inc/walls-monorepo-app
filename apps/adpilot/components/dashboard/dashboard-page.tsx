"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CircleDollarSign,
  Eye,
  Link2,
  Loader2,
  MousePointerClick,
  Plus,
  RefreshCw,
  TrendingUp,
} from "lucide-react";

import { Button } from "@walls/ui/button";
import { cn } from "@walls/utils";

import type { DashboardAnalytics } from "@/lib/analytics-server";
import { META_PROVIDER, META_SERVICE, type SafeUserConnection } from "@/lib/connections";
import { ZERO_DASHBOARD_STATS } from "@/lib/dashboard-defaults";

import { HeroStat, MetricBarItem, SectionLabel } from "./dashboard-metrics";
import { SpendTrendChart } from "./spend-trend-chart";

const HERO_ACCENTS = [
  "var(--walls-sky)",
  "var(--walls-blue)",
  "#00d1c1",
  "#7a04eb",
] as const;

const HERO_ICONS = [CircleDollarSign, Eye, MousePointerClick, TrendingUp] as const;

function formatConnectionLabel(connection: SafeUserConnection) {
  const accountName = connection.token_payload?.account_name;
  if (accountName) return accountName;
  if (connection.account_id) {
    return connection.account_id.replace(/^act_/, "Ad account ");
  }
  return "Meta Ads";
}

function parseMetricNumber(value: string): number {
  const normalized = value.replace(/,/g, "");
  const match = normalized.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

export function DashboardPage() {
  const [connections, setConnections] = React.useState<SafeUserConnection[]>([]);
  const [analytics, setAnalytics] = React.useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const autoSyncStarted = React.useRef(false);

  const loadDashboard = React.useCallback(async () => {
    const [connectionsResponse, analyticsResponse] = await Promise.all([
      fetch("/api/connections"),
      fetch("/api/analytics"),
    ]);

    if (connectionsResponse.ok) {
      const payload = (await connectionsResponse.json()) as {
        connections?: SafeUserConnection[];
      };
      setConnections(payload.connections ?? []);
    }

    if (analyticsResponse.ok) {
      const payload = (await analyticsResponse.json()) as DashboardAnalytics;
      setAnalytics(payload);
    }
  }, []);

  React.useEffect(() => {
    void (async () => {
      try {
        await loadDashboard();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadDashboard]);

  React.useEffect(() => {
    if (!analytics?.syncing) return;

    const interval = window.setInterval(() => {
      void loadDashboard();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [analytics?.syncing, loadDashboard]);

  const metaConnections = connections.filter(
    (c) => c.provider === META_PROVIDER && c.service === META_SERVICE,
  );
  const hasLiveConnections = metaConnections.length > 0;

  React.useEffect(() => {
    if (loading || autoSyncStarted.current || !hasLiveConnections || !analytics) return;
    if (analytics.syncing || analytics.hasData) return;

    autoSyncStarted.current = true;
    void fetch("/api/sync/meta", { method: "POST" }).then(() => loadDashboard());
  }, [loading, hasLiveConnections, analytics, loadDashboard]);

  const isSyncing = analytics?.syncing ?? false;
  const stats = analytics?.stats ?? [...ZERO_DASHBOARD_STATS];
  const spendByDay = analytics?.spendByDay ?? [];
  const periodLabel = analytics?.periodLabel ?? "Last 30 days";

  const accounts = React.useMemo(() => {
    if (analytics?.accounts && analytics.accounts.length > 0) {
      return analytics.accounts;
    }

    if (hasLiveConnections) {
      return metaConnections.map((connection) => ({
        id: connection.id,
        name: formatConnectionLabel(connection),
        platform: "Meta",
        spend: "$0",
        impressions: "0",
        ctr: "0.00%",
        status: isSyncing ? "Syncing" : "Connected",
      }));
    }

    return [];
  }, [analytics?.accounts, hasLiveConnections, metaConnections, isSyncing]);

  const maxAccountSpend = Math.max(
    ...accounts.map((account) => parseMetricNumber(account.spend)),
    1,
  );

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await fetch("/api/sync/meta", { method: "POST" });
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <div className="min-h-full bg-neutral-50">
      <div className="space-y-16 px-6 py-8 pb-12 md:px-10 md:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">
              Overview
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl">
              AdPilot
            </h1>
            <p className="mt-2 max-w-xl text-sm font-light text-neutral-500">
              {hasLiveConnections
                ? isSyncing
                  ? "Syncing live data from Meta. This can take a minute for larger accounts."
                  : analytics?.hasData
                    ? "Live analytics across your connected ad accounts."
                    : "Meta is connected. Metrics will appear after the first sync completes."
                : "Connect Meta in Settings to start pulling live ad insights."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-light text-neutral-500">
              {periodLabel}
              {isSyncing ? " · Syncing" : null}
            </span>
            {hasLiveConnections ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={refreshing || isSyncing}
                onClick={() => void handleRefresh()}
                className="h-8 rounded-full font-light text-neutral-600 hover:bg-neutral-200/60"
              >
                {refreshing || isSyncing ? (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                )}
                Refresh
              </Button>
            ) : null}
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 rounded-full font-light text-neutral-600 hover:bg-neutral-200/60"
            >
              <Link href="/settings">
                <Link2 className="mr-1.5 h-3.5 w-3.5" />
                Connections
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-row items-stretch justify-center gap-6 pb-2 pt-2 md:gap-10">
          {stats.map((stat, index) => (
            <HeroStat
              key={stat.label}
              label={stat.label}
              value={stat.value}
              change={stat.change}
              positive={stat.positive}
              icon={HERO_ICONS[index] ?? CircleDollarSign}
              accentColor={HERO_ACCENTS[index] ?? HERO_ACCENTS[0]}
              loading={loading}
              delay={index * 0.06}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
        >
          <SectionLabel>Spend — {periodLabel}</SectionLabel>
          <SpendTrendChart days={spendByDay} />
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <SectionLabel>Connected Accounts</SectionLabel>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-5 animate-pulse rounded-full bg-neutral-200/80"
                  />
                ))}
              </div>
            ) : metaConnections.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm font-light text-neutral-400">
                  No Meta accounts connected yet.
                </p>
                <Button
                  asChild
                  className="rounded-full bg-walls-yellow/90 font-medium text-black hover:bg-walls-yellow"
                >
                  <a href="/api/oauth/meta/login">Connect Meta</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {metaConnections.map((connection, index) => (
                  <div key={connection.id} className="flex items-center gap-3">
                    <div
                      className="h-2 w-2 flex-shrink-0 rounded-full"
                      style={{
                        background:
                          HERO_ACCENTS[index % HERO_ACCENTS.length] ??
                          "var(--walls-sky)",
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-light text-neutral-700">
                        {formatConnectionLabel(connection)}
                      </p>
                      <p className="mt-0.5 text-[11px] font-light text-neutral-400">
                        Meta Ads
                        {connection.token_expiry
                          ? ` · Expires ${new Date(connection.token_expiry).toLocaleDateString()}`
                          : " · Connected"}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex-shrink-0 text-[11px] font-medium uppercase tracking-wide",
                        isSyncing ? "text-amber-600" : "text-emerald-600",
                      )}
                    >
                      {isSyncing ? "Syncing" : "Live"}
                    </span>
                  </div>
                ))}
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-8 rounded-full px-0 font-light text-neutral-500 hover:bg-transparent hover:text-neutral-800"
                >
                  <Link href="/settings">
                    <Plus className="mr-1 h-3.5 w-3.5" />
                    Manage connections
                  </Link>
                </Button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32 }}
          >
            <SectionLabel>Account Performance</SectionLabel>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-5 animate-pulse rounded-full bg-neutral-200/80"
                  />
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <p className="text-sm font-light text-neutral-400">
                Connect a Meta ad account to see performance here.
              </p>
            ) : (
              <div className="space-y-4">
                {accounts.map((account, index) => (
                  <MetricBarItem
                    key={account.id}
                    label={account.name}
                    sublabel={`${account.platform} · CTR ${account.ctr} · ${account.status}`}
                    value={account.spend}
                    numericValue={parseMetricNumber(account.spend)}
                    max={maxAccountSpend}
                    color={
                      HERO_ACCENTS[index % HERO_ACCENTS.length] ??
                      "var(--walls-sky)"
                    }
                  />
                ))}
                {hasLiveConnections && !analytics?.hasData && !loading ? (
                  <p className="text-xs font-light text-neutral-400">
                    {isSyncing
                      ? "Waiting for Meta sync. Spend bars will populate when data arrives."
                      : "No spend recorded in the last 30 days for connected accounts."}
                  </p>
                ) : null}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

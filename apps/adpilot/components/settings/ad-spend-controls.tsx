"use client";

import * as React from "react";
import {
  Gauge,
  Shield,
  SlidersHorizontal,
  TrendingUp,
  Zap,
} from "lucide-react";

import { Button } from "@walls/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@walls/ui/card";
import { Input } from "@walls/ui/input";
import { cn } from "@walls/utils";

import {
  COOLDOWN_OPTIONS,
  FAUX_SPEND_DEFAULTS,
  getAggressivenessLabel,
  getProjectedWeeklyUplift,
  getRiskScore,
  PACING_OPTIONS,
  type SpendSettings,
} from "@/lib/faux-spend-controls";

function Toggle({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? (
          <p className="mt-1 text-xs font-light leading-5 text-neutral-500">
            {description}
          </p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          checked ? "bg-walls-yellow/90" : "bg-neutral-300",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform",
            checked && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}

function SliderField({
  label,
  hint,
  value,
  min,
  max,
  step,
  suffix,
  onChange,
}: {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          {hint ? (
            <p className="mt-1 text-xs font-light text-neutral-500">{hint}</p>
          ) : null}
        </div>
        <p className="text-sm font-medium tabular-nums text-foreground">
          {value}
          {suffix}
        </p>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-neutral-200 accent-black"
      />
    </div>
  );
}

export function AdSpendControls() {
  const [settings, setSettings] = React.useState<SpendSettings>(FAUX_SPEND_DEFAULTS);
  const [saved, setSaved] = React.useState(false);

  const update = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const riskScore = getRiskScore(
    settings.aggressiveness,
    settings.maxDailyIncreasePct,
  );
  const projectedUplift = getProjectedWeeklyUplift(
    settings.aggressiveness,
    settings.maxDailyIncreasePct,
    settings.autoScaling,
  );
  const autonomyLabel = getAggressivenessLabel(settings.aggressiveness);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  return (
    <Card className="rounded-[32px] border-neutral-200/60 bg-neutral-100 shadow-inner">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-medium">
          <SlidersHorizontal className="h-4 w-4 text-neutral-500" />
          Ad spend automation
        </CardTitle>
        <p className="text-sm font-light text-neutral-500">
          Tune how aggressively AdPilot scales budgets when performance holds.
          Preview only — changes are not sent to Meta yet.
        </p>
      </CardHeader>
      <CardContent className="space-y-6 pb-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-neutral-200/70 bg-walls-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
              <TrendingUp className="h-3.5 w-3.5" />
              Projected weekly uplift
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {projectedUplift}
            </p>
            <p className="mt-1 text-xs font-light text-neutral-400">
              vs. current baseline spend
            </p>
          </div>
          <div className="rounded-[24px] border border-neutral-200/70 bg-walls-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
              <Gauge className="h-3.5 w-3.5" />
              Risk score
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {riskScore}
              <span className="text-base font-light text-neutral-400">/100</span>
            </p>
            <p className="mt-1 text-xs font-light text-neutral-400">
              {riskScore < 40 ? "Low volatility" : riskScore < 70 ? "Moderate" : "High volatility"}
            </p>
          </div>
          <div className="rounded-[24px] border border-neutral-200/70 bg-walls-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
              <Zap className="h-3.5 w-3.5" />
              Autonomy level
            </div>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {autonomyLabel}
            </p>
            <p className="mt-1 text-xs font-light text-neutral-400">
              {settings.autoScaling ? "Auto-scaling on" : "Manual budgets"}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] border border-neutral-200/70 bg-walls-white p-5 shadow-sm">
          <div className="space-y-6">
            <Toggle
              checked={settings.autoScaling}
              onChange={(value) => update("autoScaling", value)}
              label="Auto-scale winning ad sets"
              description="Increase budgets when ROAS stays above your floor and CPA stays under ceiling."
            />

            <SliderField
              label="Spend aggressiveness"
              hint="How quickly AdPilot ramps budget on strong performers"
              value={settings.aggressiveness}
              min={0}
              max={100}
              step={1}
              onChange={(value) => update("aggressiveness", value)}
            />
            <div className="flex justify-between text-[11px] font-light text-neutral-400">
              <span>Conservative</span>
              <span>Balanced</span>
              <span>Aggressive</span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <SliderField
                label="Max daily budget increase"
                hint="Cap on % growth per 24h window"
                value={settings.maxDailyIncreasePct}
                min={5}
                max={50}
                step={1}
                suffix="%"
                onChange={(value) => update("maxDailyIncreasePct", value)}
              />
              <SliderField
                label="Scale-up cap per cycle"
                hint="Single optimization jump limit"
                value={settings.scaleUpCapPct}
                min={10}
                max={60}
                step={1}
                suffix="%"
                onChange={(value) => update("scaleUpCapPct", value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-neutral-200/70 bg-walls-white p-5 shadow-sm">
          <p className="text-sm font-medium text-foreground">Guardrails</p>
          <p className="mt-1 text-xs font-light text-neutral-500">
            Hard stops that pause or slow scaling before efficiency drops.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">ROAS floor</span>
              <span className="block text-xs font-light text-neutral-500">
                Minimum return before scaling continues
              </span>
              <Input
                type="number"
                min={0}
                step={0.1}
                value={settings.roasFloor}
                onChange={(e) => update("roasFloor", Number(e.target.value))}
                className="mt-2 rounded-full border-neutral-200 bg-neutral-50 font-light"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-foreground">CPA ceiling</span>
              <span className="block text-xs font-light text-neutral-500">
                Max cost per acquisition (USD)
              </span>
              <Input
                type="number"
                min={0}
                step={1}
                value={settings.cpaCeiling}
                onChange={(e) => update("cpaCeiling", Number(e.target.value))}
                className="mt-2 rounded-full border-neutral-200 bg-neutral-50 font-light"
              />
            </label>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-foreground">Cooldown between increases</p>
            <p className="mt-1 text-xs font-light text-neutral-500">
              Minimum wait before the next budget bump on the same ad set.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {COOLDOWN_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => update("cooldownHours", option.value)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-light transition-colors",
                    settings.cooldownHours === option.value
                      ? "border-walls-yellow bg-walls-yellow/20 text-foreground"
                      : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-neutral-200/70 bg-walls-white p-5 shadow-sm">
          <p className="text-sm font-medium text-foreground">Delivery & safety</p>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-medium text-foreground">Budget pacing</p>
              <p className="mt-1 text-xs font-light text-neutral-500">
                How spend is distributed across the day when scaling is active.
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {PACING_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => update("pacing", option.value)}
                    className={cn(
                      "rounded-[20px] border px-3 py-3 text-left transition-colors",
                      settings.pacing === option.value
                        ? "border-walls-yellow bg-walls-yellow/15"
                        : "border-neutral-200 bg-neutral-50 hover:bg-neutral-100",
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                    <p className="mt-1 text-xs font-light leading-5 text-neutral-500">
                      {option.hint}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5 border-t border-neutral-100 pt-5">
              <Toggle
                checked={settings.learningPhaseProtection}
                onChange={(value) => update("learningPhaseProtection", value)}
                label="Learning phase protection"
                description="Block scale-ups while Meta marks the ad set as learning limited."
              />
              <Toggle
                checked={settings.pauseOnFatigue}
                onChange={(value) => update("pauseOnFatigue", value)}
                label="Pause on frequency fatigue"
                description="Slow scaling when frequency rises and CTR drops week over week."
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-xs font-light text-neutral-500">
            <Shield className="h-3.5 w-3.5" />
            Guardrails apply workspace-wide across connected Meta accounts.
          </p>
          <Button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-walls-yellow/90 px-6 font-medium text-black hover:bg-walls-yellow"
          >
            {saved ? "Preferences saved" : "Save preferences"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

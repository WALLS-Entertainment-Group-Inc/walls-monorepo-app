"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { AnimatedMetricValue } from "./animated-metric-value";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-500">
      {children}
    </p>
  );
}

function HeroStatSkeleton() {
  return <div className="mb-1 h-8 w-20 animate-pulse rounded bg-neutral-200/80" />;
}

type HeroStatProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  accentColor: string;
  loading?: boolean;
  delay?: number;
};

function HeroStat({
  label,
  value,
  icon: Icon,
  accentColor,
  loading,
  delay = 0,
}: HeroStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex min-w-0 flex-1 flex-col items-center justify-center"
    >
      {loading ? (
        <HeroStatSkeleton />
      ) : (
        <p className="text-3xl font-black tabular-nums tracking-tight text-neutral-900 md:text-4xl">
          <AnimatedMetricValue value={value} />
        </p>
      )}

      <span className="mt-1 inline-flex w-full max-w-[120px] items-center gap-2 text-xs font-light uppercase tracking-wider text-neutral-500">
        <span
          className="min-w-0 flex-1 border-t-2 border-solid"
          style={{ borderColor: accentColor }}
        />
        <span className="inline-flex flex-shrink-0 items-center gap-1">
          <Icon className="h-3.5 w-3.5" style={{ color: accentColor }} />
          {label}
        </span>
        <span
          className="min-w-0 flex-1 border-t-2 border-solid"
          style={{ borderColor: accentColor }}
        />
      </span>
    </motion.div>
  );
}

export { HeroStat, SectionLabel };

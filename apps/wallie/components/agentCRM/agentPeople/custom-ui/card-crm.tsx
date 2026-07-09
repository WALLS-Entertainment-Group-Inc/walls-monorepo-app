import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function CardCRM({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-neutral-200/80 bg-gray-50", className)}
      {...props}
    />
  );
}

export function CardContentCRM({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-0", className)} {...props} />;
}

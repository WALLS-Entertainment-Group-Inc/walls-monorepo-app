"use client";

import { cn } from "@/lib/utils";

interface ShiningTextProps {
  text: string;
  className?: string;
}

export function ShiningText({ text, className }: ShiningTextProps) {
  return (
    <span
      className={cn(
        "wallie-shining-text inline-block bg-gradient-to-r from-neutral-500 via-neutral-800 to-neutral-500 bg-[length:200%_100%] bg-clip-text text-transparent",
        className,
      )}
    >
      {text}
    </span>
  );
}

"use client";

import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@walls/utils";

export type FloatingLabelInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "placeholder" | "id"
> & {
  label: string;
  id?: string;
  containerClassName?: string;
};

export const FloatingLabelInput = React.forwardRef<
  HTMLInputElement,
  FloatingLabelInputProps
>(function FloatingLabelInput(
  {
    label,
    className,
    containerClassName,
    value,
    defaultValue,
    onFocus,
    onBlur,
    id,
    disabled,
    ...props
  },
  ref,
) {
  const [focused, setFocused] = React.useState(false);
  const generatedId = React.useId();
  const inputId = id ?? generatedId;

  const resolvedValue =
    value !== undefined
      ? value
      : defaultValue !== undefined
        ? defaultValue
        : "";
  const hasValue = String(resolvedValue ?? "").length > 0;
  const floated = focused || hasValue;

  return (
    <div className={cn("relative", containerClassName)}>
      <input
        ref={ref}
        id={inputId}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-label={label}
        className={cn(
          "h-12 w-full rounded-2xl border border-neutral-200 bg-kenoo-white px-4 text-sm font-light text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-transparent focus:border-neutral-400 focus:outline-none focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          floated ? "pt-3.5 pb-1.5" : "py-3",
          className,
        )}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        {...props}
      />
      <motion.label
        htmlFor={inputId}
        aria-hidden
        className={cn(
          "pointer-events-none absolute left-3 origin-left px-1.5 font-light",
          floated
            ? "bg-kenoo-white text-neutral-500"
            : "bg-transparent text-neutral-400",
          disabled && "opacity-50",
        )}
        initial={false}
        animate={{
          top: floated ? 0 : "50%",
          y: "-50%",
          scale: floated ? 0.78 : 1,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 }}
      >
        <span className="text-sm leading-none">{label}</span>
      </motion.label>
    </div>
  );
});

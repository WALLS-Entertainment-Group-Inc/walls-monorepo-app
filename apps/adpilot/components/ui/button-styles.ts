export const primaryButtonClass =
  "rounded-full bg-gradient-to-b from-[#eafb87] to-[#d2ef3a] px-5 font-semibold tracking-tight text-walls-forest shadow-[0_1px_2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.55)] transition-all duration-300 ease-in-out hover:scale-[0.995] hover:shadow-[inset_0_4px_8px_rgba(0,0,0,0.18)] active:scale-[0.98]";

export const dangerButtonClass =
  "rounded-full border-0 bg-[linear-gradient(160deg,#ff6a6f_0%,#ef3b42_50%,#c01824_100%)] px-5 font-semibold tracking-tight text-white shadow-[0_1px_2px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.28)] transition-all duration-300 ease-in-out hover:scale-[0.995] hover:shadow-[inset_0_4px_8px_rgba(0,0,0,0.22)] active:scale-[0.98]";

export const secondaryButtonClass =
  "rounded-full border-0 bg-gradient-to-b from-white to-neutral-100 px-5 font-medium tracking-tight text-neutral-800 ring-1 ring-inset ring-neutral-200 shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] transition-all duration-300 ease-in-out hover:scale-[0.995] hover:border-neutral-200 hover:shadow-[inset_0_4px_8px_rgba(0,0,0,0.15)] active:scale-[0.98]";

export const segmentTrackClass =
  "inline-flex flex-wrap items-center gap-1 rounded-full bg-neutral-100 p-1 ring-1 ring-inset ring-black/[0.04] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)]";

/** Frosted track for glass segment controls (wallie Work/Chat vibe). */
export const glassSegmentTrackClass =
  "inline-flex flex-wrap items-center gap-0 rounded-full border border-black/[0.08] bg-neutral-200/55 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] backdrop-blur-xl";

export const toggleChipBaseClass =
  "relative rounded-full px-4 py-1.5 text-xs tracking-tight transition-colors duration-200";

export const glassToggleChipBaseClass =
  "relative rounded-full px-5 py-2 text-sm tracking-tight transition-colors duration-200";

export const toggleChipActiveClass = "font-semibold text-walls-forest";

export const glassToggleChipActiveClass = "font-medium text-neutral-700";

export const toggleChipInactiveClass =
  "font-medium text-neutral-500 hover:text-neutral-800";

export const glassToggleChipInactiveClass = "font-medium text-neutral-400";

export const toggleCardBaseClass =
  "relative rounded-2xl px-4 py-3.5 text-left ring-1 ring-inset transition-all duration-200 ease-out";

export const toggleCardActiveClass =
  "bg-gradient-to-br from-[#eafb87] to-[#d2ef3a] text-walls-forest ring-[#bcd63a]";

export const toggleCardInactiveClass =
  "bg-white ring-neutral-200/70 hover:bg-neutral-50 hover:ring-neutral-300";

/** Glass selectable cards (settings optimization goals, etc.). */
export const glassToggleCardBaseClass =
  "relative rounded-2xl border px-4 py-3.5 text-left transition-all duration-200 ease-out";

export const glassToggleCardActiveClass =
  "border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(0,0,0,0.04)] backdrop-blur-xl backdrop-saturate-150";

export const glassToggleCardInactiveClass =
  "border-black/[0.06] bg-neutral-100/50 hover:bg-neutral-100/80";

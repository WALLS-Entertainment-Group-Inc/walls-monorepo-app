"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useWallieVoiceSession } from "./wallie-voice-context";

type VoiceLoadingStatus = "searching" | "people_search" | "thinking" | null;

interface WallieVoiceShellProps {
  children: ReactNode;
  loadingStatus?: VoiceLoadingStatus;
}

/** Keeps chat mounted (invisible) during voice mode so messages still stream in the background. */
export function WallieVoiceShell({ children, loadingStatus = null }: WallieVoiceShellProps) {
  const { isSessionOpen } = useWallieVoiceSession();

  return (
    <>
      <div
        className={cn(
          "flex flex-1 flex-col min-h-0 w-full",
          isSessionOpen && "invisible pointer-events-none"
        )}
        aria-hidden={isSessionOpen}
      >
        {children}
      </div>
      <WallieVoiceOverlay loadingStatus={loadingStatus} />
    </>
  );
}

interface WallieVoiceOverlayProps {
  loadingStatus?: VoiceLoadingStatus;
}

function statusLabel(
  state: string,
  loadingStatus: VoiceLoadingStatus
): string {
  if (state === "listening") return "Listening…";
  if (state === "speaking") return "Speaking…";
  if (state === "preparing_speech") return "Almost ready…";
  if (state === "processing") {
    if (loadingStatus === "searching") return "Searching the web…";
    if (loadingStatus === "people_search") return "Finding contacts…";
    if (loadingStatus === "thinking") return "Thinking…";
    return "Thinking…";
  }
  return "Starting…";
}

function orbStateClass(state: string): string {
  if (state === "listening") return "bg-neutral-400/20";
  if (state === "preparing_speech") return "bg-violet-300/25";
  if (state === "processing") return "bg-amber-300/25";
  if (state === "speaking") return "bg-sky-400/25";
  return "bg-neutral-300/20";
}

function orbBlurClass(state: string): string {
  if (state === "listening") return "bg-neutral-500/30";
  if (state === "preparing_speech") return "bg-violet-400/35";
  if (state === "processing") return "bg-amber-400/35";
  if (state === "speaking") return "bg-sky-500/35";
  return "bg-neutral-400/30";
}

function orbMainClass(state: string): string {
  if (state === "listening") return "from-neutral-700 via-neutral-800 to-neutral-950";
  if (state === "preparing_speech") return "from-violet-500 via-purple-500 to-fuchsia-600";
  if (state === "processing") return "from-amber-500 via-orange-500 to-rose-500";
  if (state === "speaking") return "from-sky-500 via-blue-600 to-indigo-700";
  return "from-neutral-600 to-neutral-800";
}

export function WallieVoiceOverlay({ loadingStatus = null }: WallieVoiceOverlayProps) {
  const { state, isSessionOpen, audioLevel, exitSession } = useWallieVoiceSession();

  const orbScale = 1 + audioLevel * 0.22;
  const glowOpacity = 0.35 + audioLevel * 0.45;

  return (
    <AnimatePresence>
      {isSessionOpen && (
        <motion.div
          key="wallie-voice-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 via-white to-neutral-100"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(120,120,120,0.08)_0%,_transparent_70%)]"
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={exitSession}
            className="absolute top-4 right-4 z-10 h-10 w-10 rounded-full bg-white/70 text-neutral-600 shadow-sm backdrop-blur-md hover:bg-white hover:text-neutral-900"
            aria-label="Exit voice mode"
          >
            <X className="h-5 w-5" />
          </Button>

          <div className="relative flex flex-col items-center gap-10 px-6">
            <div className="relative flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
              {/* Outer glow rings */}
              <motion.div
                className={cn("absolute inset-0 rounded-full", orbStateClass(state))}
                animate={{
                  scale:
                    state === "listening"
                      ? [1, 1.08 + audioLevel * 0.12, 1]
                      : state === "speaking"
                        ? [1, 1.06, 1]
                        : [1, 1.04, 1],
                  opacity:
                    state === "listening"
                      ? [0.35, glowOpacity, 0.35]
                      : [0.3, 0.55, 0.3],
                }}
                transition={{
                  duration:
                    state === "processing" || state === "preparing_speech" ? 2.4 : 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className={cn("absolute inset-6 rounded-full blur-2xl", orbBlurClass(state))}
                animate={{
                  scale: state === "listening" ? orbScale : [1, 1.05, 1],
                  opacity: [0.45, 0.75, 0.45],
                }}
                transition={{
                  duration: state === "listening" ? 0.12 : 1.8,
                  repeat: state === "listening" ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main orb */}
              <motion.div
                className={cn(
                  "relative z-10 h-44 w-44 rounded-full shadow-2xl sm:h-52 sm:w-52",
                  "bg-gradient-to-br",
                  orbMainClass(state)
                )}
                animate={{
                  scale: state === "listening" ? orbScale : [1, 1.03, 1],
                  boxShadow:
                    state === "listening"
                      ? `0 0 ${40 + audioLevel * 60}px rgba(64, 64, 64, ${0.25 + audioLevel * 0.35})`
                      : state === "speaking"
                        ? "0 0 60px rgba(56, 189, 248, 0.45)"
                        : state === "preparing_speech"
                          ? "0 0 50px rgba(167, 139, 250, 0.45)"
                          : "0 0 50px rgba(251, 191, 36, 0.4)",
                }}
                transition={{
                  duration: state === "listening" ? 0.1 : 1.5,
                  repeat: state === "listening" ? 0 : Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-white/10 to-white/25" />
                <motion.div
                  className="absolute inset-[18%] rounded-full bg-white/10 blur-md"
                  animate={{ opacity: [0.2, 0.45, 0.2] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>

            <motion.p
              key={`${state}-${loadingStatus}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-medium tracking-wide text-neutral-500"
            >
              {statusLabel(state, loadingStatus)}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

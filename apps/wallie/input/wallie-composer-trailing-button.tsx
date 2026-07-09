"use client";

import { FALLBACK_ICON_URL } from "@/lib/asset-urls";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp, Mic } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useWallieVoiceSession } from "../voice/wallie-voice-context";

interface WallieComposerTrailingButtonProps {
  hasContent: boolean;
  isLoading: boolean;
  onSend: () => void;
  voiceEnabled?: boolean;
  voiceDisabled?: boolean;
}

export function WallieComposerTrailingButton({
  hasContent,
  isLoading,
  onSend,
  voiceEnabled = false,
  voiceDisabled = false,
}: WallieComposerTrailingButtonProps) {
  const { enterSession, isSessionOpen } = useWallieVoiceSession();
  const showMic = voiceEnabled && !hasContent && !isSessionOpen;
  const showSend = hasContent;

  if (showMic) {
    return (
      <Button
        type="button"
        size="icon"
        onClick={enterSession}
        disabled={voiceDisabled}
        className={cn(
          "h-10 w-10 rounded-full flex-shrink-0 transition-all backdrop-blur-md shadow-inner border flex items-center justify-center",
          "bg-neutral-100 hover:bg-neutral-200 text-gray-600 border-neutral-200/50"
        )}
        aria-label="Start voice mode"
      >
        <Mic className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      size="icon"
      className={cn(
        "h-10 w-10 rounded-full flex-shrink-0 transition-all backdrop-blur-md shadow-inner border flex items-center justify-center relative overflow-hidden",
        showSend
          ? "bg-neutral-700 hover:bg-neutral-700/90 text-neutral-200 border-neutral-200/50"
          : "bg-neutral-100 hover:bg-neutral-100 text-gray-600 border-neutral-200/50"
      )}
      onClick={onSend}
      disabled={isLoading || !hasContent}
    >
      <AnimatePresence mode="wait">
        {showSend ? (
          <motion.div
            key="arrow-up"
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="walls-logo"
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -5 }}
            transition={{ duration: 0.2 }}
          >
            <Image
              src={FALLBACK_ICON_URL}
              alt="WALLS Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
}

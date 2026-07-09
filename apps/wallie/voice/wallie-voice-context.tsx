"use client";

import { createContext, useContext, type ReactNode } from "react";
import {
  useWallieVoice,
  type WallieVoiceState,
} from "./use-wallie-voice";

interface WallieVoiceContextValue {
  state: WallieVoiceState;
  isSessionOpen: boolean;
  audioLevel: number;
  enterSession: () => void;
  exitSession: () => void;
}

const WallieVoiceContext = createContext<WallieVoiceContextValue | null>(null);

interface WallieVoiceProviderProps {
  children: ReactNode;
  onSend: (
    text: string,
    onDelta?: (deltaText: string) => void
  ) => Promise<string | null | undefined>;
  disabled?: boolean;
}

export function WallieVoiceProvider({
  children,
  onSend,
  disabled = false,
}: WallieVoiceProviderProps) {
  const voice = useWallieVoice({ onSend, disabled });

  return (
    <WallieVoiceContext.Provider value={voice}>{children}</WallieVoiceContext.Provider>
  );
}

export function useWallieVoiceSession() {
  const context = useContext(WallieVoiceContext);
  if (!context) {
    throw new Error("useWallieVoiceSession must be used within WallieVoiceProvider");
  }
  return context;
}

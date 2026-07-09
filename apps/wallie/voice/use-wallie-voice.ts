"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { wallsToast } from "@/components/ui/walls-toast";
import { textForSpeech } from "@/lib/wallie/voice-text";
import { startSilenceDetector } from "./silence-detector";
import { createSpeechQueue } from "./wallie-tts";

export type WallieVoiceState =
  | "idle"
  | "listening"
  | "processing"
  | "preparing_speech"
  | "speaking";

interface UseWallieVoiceOptions {
  onSend: (
    text: string,
    onDelta?: (deltaText: string) => void
  ) => Promise<string | null | undefined>;
  disabled?: boolean;
}

/** First chunk is kept short so speech starts as soon as possible; later chunks are bigger to cut down on TTS round trips. */
const FIRST_CHUNK_MIN_CHARS = 20;
const CHUNK_MIN_CHARS = 150;
const CHUNK_MAX_CHARS = 400;

/** Pulls the next speakable chunk off the front of a streaming text buffer once it reaches a sentence boundary past minChars. */
function takeReadyChunk(
  buffer: string,
  minChars: number,
  maxChars: number
): { chunk: string; rest: string } | null {
  const boundary = /[.!?]+(?:\s+|$)|\n+/g;
  let match: RegExpExecArray | null;
  let lastEnd = -1;
  while ((match = boundary.exec(buffer))) {
    const end = match.index + match[0].length;
    if (end >= minChars) {
      return { chunk: buffer.slice(0, end).trim(), rest: buffer.slice(end) };
    }
    lastEnd = end;
  }
  if (buffer.length >= maxChars) {
    if (lastEnd > 0) {
      return { chunk: buffer.slice(0, lastEnd).trim(), rest: buffer.slice(lastEnd) };
    }
    const spaceIdx = buffer.lastIndexOf(" ", maxChars);
    const cut = spaceIdx > 0 ? spaceIdx + 1 : maxChars;
    return { chunk: buffer.slice(0, cut).trim(), rest: buffer.slice(cut) };
  }
  return null;
}

async function transcribeAudio(blob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append("audio", blob, "recording.webm");

  const res = await fetch("/api/walli/transcribe", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Transcription failed"
    );
  }

  const data = (await res.json()) as { text?: string };
  return data.text?.trim() ?? "";
}

export function useWallieVoice({ onSend, disabled = false }: UseWallieVoiceOptions) {
  const [state, setState] = useState<WallieVoiceState>("idle");
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const sessionRef = useRef(false);
  const discardRecordingRef = useRef(false);
  const silenceStopRef = useRef<(() => void) | null>(null);
  const isStartingRef = useRef(false);
  const startListeningRef = useRef<() => Promise<void>>(async () => {});

  const stopMediaTracks = useCallback(() => {
    silenceStopRef.current?.();
    silenceStopRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setAudioLevel(0);
  }, []);

  const finishRecording = useCallback(() => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state !== "recording") {
      return;
    }
    mediaRecorderRef.current.stop();
  }, []);

  const resetToIdle = useCallback(() => {
    stopMediaTracks();
    setState("idle");
  }, [stopMediaTracks]);

  const cancel = useCallback(() => {
    sessionRef.current = false;
    setIsSessionOpen(false);
    discardRecordingRef.current = true;
    abortRef.current?.abort();
    abortRef.current = null;

    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    } else {
      resetToIdle();
    }
  }, [resetToIdle]);

  const processRecording = useCallback(
    async (blob: Blob) => {
      if (!sessionRef.current) {
        discardRecordingRef.current = false;
        resetToIdle();
        return;
      }

      if (discardRecordingRef.current) {
        discardRecordingRef.current = false;
        if (sessionRef.current) {
          void startListeningRef.current();
        } else {
          resetToIdle();
        }
        return;
      }

      setState("processing");

      try {
        const transcript = await transcribeAudio(blob);
        if (!sessionRef.current) return;

        if (!transcript) {
          wallsToast.error("No speech detected", "Try speaking a bit longer.");
          void startListeningRef.current();
          return;
        }

        abortRef.current = new AbortController();
        const controller = abortRef.current;

        let sentenceBuffer = "";
        let firstChunkQueued = false;
        let hasQueuedAny = false;

        const speechQueue = createSpeechQueue(controller.signal, () => {
          if (sessionRef.current && !controller.signal.aborted) setState("speaking");
        });

        const queueReadyChunks = (isFinal: boolean) => {
          while (true) {
            const minChars = firstChunkQueued ? CHUNK_MIN_CHARS : FIRST_CHUNK_MIN_CHARS;
            const ready = takeReadyChunk(sentenceBuffer, minChars, CHUNK_MAX_CHARS);
            if (!ready) break;
            sentenceBuffer = ready.rest;
            if (textForSpeech(ready.chunk).trim()) {
              speechQueue.push(ready.chunk);
              hasQueuedAny = true;
              if (!firstChunkQueued && sessionRef.current && !controller.signal.aborted) {
                setState("preparing_speech");
              }
              firstChunkQueued = true;
            }
          }
          if (isFinal) {
            const remainder = sentenceBuffer.trim();
            sentenceBuffer = "";
            if (remainder && textForSpeech(remainder).trim()) {
              speechQueue.push(remainder);
              hasQueuedAny = true;
            }
          }
        };

        await onSend(transcript, (deltaText) => {
          if (!sessionRef.current || discardRecordingRef.current) return;
          sentenceBuffer += deltaText;
          queueReadyChunks(false);
        });
        if (!sessionRef.current) return;

        queueReadyChunks(true);

        if (!hasQueuedAny) {
          void startListeningRef.current();
          return;
        }

        await speechQueue.finish();

        if (!sessionRef.current) return;
        void startListeningRef.current();
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          if (!sessionRef.current) resetToIdle();
          return;
        }
        console.error("Wallie voice error:", error);
        wallsToast.error(
          "Voice error",
          error instanceof Error ? error.message : "Something went wrong."
        );
        if (sessionRef.current) {
          void startListeningRef.current();
        } else {
          resetToIdle();
        }
      }
    },
    [onSend, resetToIdle]
  );

  const startListening = useCallback(async () => {
    if (disabled || !sessionRef.current || isStartingRef.current) return;
    if (mediaRecorderRef.current?.state === "recording") return;

    isStartingRef.current = true;

    try {
      discardRecordingRef.current = false;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!sessionRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      mediaStreamRef.current = stream;
      chunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";

      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        stopMediaTracks();
        void processRecording(blob);
      };

      silenceStopRef.current = startSilenceDetector(stream, {
        onSilence: finishRecording,
        onLevel: setAudioLevel,
        onMaxDuration: () => {
          wallsToast.error("Recording limit reached", "Sending what we captured.");
        },
        onNoSpeech: () => {
          discardRecordingRef.current = true;
          finishRecording();
        },
      });

      recorder.start(250);
      setState("listening");
    } catch (error) {
      console.error("Microphone error:", error);
      wallsToast.error(
        "Microphone access denied",
        "Allow microphone access to use voice mode."
      );
      cancel();
    } finally {
      isStartingRef.current = false;
    }
  }, [cancel, disabled, finishRecording, processRecording, stopMediaTracks]);

  startListeningRef.current = startListening;

  const enterSession = useCallback(() => {
    if (disabled || isSessionOpen) return;
    sessionRef.current = true;
    setIsSessionOpen(true);
    void startListening();
  }, [disabled, isSessionOpen, startListening]);

  const exitSession = useCallback(() => {
    cancel();
  }, [cancel]);

  useEffect(() => {
    return () => {
      sessionRef.current = false;
      discardRecordingRef.current = true;
      abortRef.current?.abort();
      stopMediaTracks();
    };
  }, [stopMediaTracks]);

  return {
    state,
    isSessionOpen,
    audioLevel,
    enterSession,
    exitSession,
  };
}

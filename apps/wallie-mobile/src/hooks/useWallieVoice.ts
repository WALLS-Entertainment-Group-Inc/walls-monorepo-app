import { useCallback, useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";

import {
  setPlaybackAudioMode,
  setRecordingAudioMode,
} from "@/lib/audio-session";
import { createRecordingSilenceDetector } from "@/lib/recording-silence-detector";
import { fetchSpeechFileUri, transcribeAudio } from "@/lib/voice-api";

export type WallieVoiceState = "idle" | "listening" | "processing" | "speaking";

const MIN_RECORDING_MS = 450;

const RECORDING_OPTIONS: Audio.RecordingOptions = {
  ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
  isMeteringEnabled: true,
  progressUpdateIntervalMillis: 100,
};

export function useWallieVoice(
  onTranscript: (text: string) => Promise<string | null | undefined>,
) {
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);
  const sessionRef = useRef(false);
  const isStartingRef = useRef(false);
  const isFinishingRef = useRef(false);
  const recordingStartedAtRef = useRef(0);
  const discardRecordingRef = useRef(false);
  const silenceDetectorRef = useRef<ReturnType<
    typeof createRecordingSilenceDetector
  > | null>(null);
  const finishListeningRef = useRef<() => void>(() => undefined);
  const startListeningRef = useRef<() => Promise<void>>(async () => undefined);

  const [state, setState] = useState<WallieVoiceState>("idle");
  const [isSessionOpen, setIsSessionOpen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const stopSilenceDetector = useCallback(() => {
    silenceDetectorRef.current?.stop();
    silenceDetectorRef.current = null;
    setAudioLevel(0);
  }, []);

  const stopSound = useCallback(async () => {
    const sound = soundRef.current;
    soundRef.current = null;
    if (!sound) return;
    try {
      await sound.stopAsync();
      await sound.unloadAsync();
    } catch {
      // ignore unload errors during cancel
    }
  }, []);

  const stopRecordingTracks = useCallback(async () => {
    const recording = recordingRef.current;
    recordingRef.current = null;
    if (!recording) return null;

    try {
      recording.setOnRecordingStatusUpdate(null);
      const status = await recording.getStatusAsync();
      if (status.isRecording) {
        await recording.stopAndUnloadAsync();
      } else {
        await recording.stopAndUnloadAsync().catch(() => undefined);
      }
    } catch {
      // recording may already be stopped
    }

    return recording.getURI();
  }, []);

  const resetToIdle = useCallback(() => {
    setState("idle");
  }, []);

  const cancelSession = useCallback(async () => {
    sessionRef.current = false;
    setIsSessionOpen(false);
    isFinishingRef.current = false;
    isStartingRef.current = false;
    discardRecordingRef.current = false;
    stopSilenceDetector();
    await stopSound();
    await stopRecordingTracks();
    resetToIdle();
  }, [resetToIdle, stopRecordingTracks, stopSilenceDetector, stopSound]);

  const processRecording = useCallback(
    async (uri: string | null) => {
      if (!sessionRef.current) {
        resetToIdle();
        return;
      }

      if (discardRecordingRef.current) {
        discardRecordingRef.current = false;
        await startListeningRef.current();
        return;
      }

      setState("processing");

      try {
        if (!uri) throw new Error("Recording failed");

        const text = await transcribeAudio(uri);
        if (!sessionRef.current) return;

        if (!text) {
          await startListeningRef.current();
          return;
        }

        const reply = await onTranscript(text);
        if (!sessionRef.current) return;

        if (reply?.trim()) {
          setState("speaking");
          const fileUri = await fetchSpeechFileUri(reply);
          if (!sessionRef.current) return;

          await stopSound();
          await setPlaybackAudioMode();

          const sound = new Audio.Sound();
          soundRef.current = sound;

          sound.setOnPlaybackStatusUpdate((status) => {
            if (!status.isLoaded) {
              if (__DEV__ && "error" in status && status.error) {
                console.error("[wallie-mobile] TTS playback error:", status.error);
              }
              return;
            }

            if (status.didJustFinish) {
              void sound.unloadAsync();
              if (soundRef.current === sound) {
                soundRef.current = null;
              }
              if (sessionRef.current) {
                void startListeningRef.current();
              } else {
                resetToIdle();
              }
            }
          });

          await sound.loadAsync(
            { uri: fileUri },
            { shouldPlay: true, volume: 1.0, isMuted: false },
          );

          const playbackStatus = await sound.getStatusAsync();
          if (__DEV__) {
            console.log("[wallie-mobile] TTS playback status:", playbackStatus);
          }

          if (
            playbackStatus.isLoaded &&
            !playbackStatus.isPlaying &&
            !playbackStatus.didJustFinish
          ) {
            await sound.playAsync();
          }

          return;
        }

        await startListeningRef.current();
      } catch (error) {
        console.error("[wallie-mobile] voice:", error);
        if (sessionRef.current) {
          await startListeningRef.current();
        } else {
          resetToIdle();
        }
      }
    },
    [onTranscript, resetToIdle, stopSound],
  );

  const finishListening = useCallback(async () => {
    if (!sessionRef.current || isFinishingRef.current) return;

    const recording = recordingRef.current;
    if (!recording) return;

    isFinishingRef.current = true;
    stopSilenceDetector();

    try {
      const elapsed = Date.now() - recordingStartedAtRef.current;
      if (elapsed < MIN_RECORDING_MS) {
        await new Promise((resolve) =>
          setTimeout(resolve, MIN_RECORDING_MS - elapsed),
        );
      }

      const uri = await stopRecordingTracks();
      await processRecording(uri);
    } finally {
      isFinishingRef.current = false;
    }
  }, [processRecording, stopRecordingTracks, stopSilenceDetector]);

  finishListeningRef.current = () => {
    void finishListening();
  };

  const startListening = useCallback(async () => {
    if (!sessionRef.current || isStartingRef.current || isFinishingRef.current) {
      return;
    }

    if (recordingRef.current) return;

    isStartingRef.current = true;
    discardRecordingRef.current = false;
    stopSilenceDetector();

    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        throw new Error("Microphone permission is required to talk to Wallie.");
      }

      await setRecordingAudioMode();

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(RECORDING_OPTIONS);

      recording.setOnRecordingStatusUpdate((status) => {
        if (!status.isRecording) return;
        silenceDetectorRef.current?.tick(status.metering);
      });

      await recording.startAsync();

      if (!sessionRef.current) {
        await recording.stopAndUnloadAsync().catch(() => undefined);
        return;
      }

      recordingRef.current = recording;
      recordingStartedAtRef.current = Date.now();
      setState("listening");

      silenceDetectorRef.current = createRecordingSilenceDetector({
        onSilence: () => finishListeningRef.current(),
        onMaxDuration: () => {
          if (__DEV__) {
            console.log("[wallie-mobile] voice: max recording duration reached");
          }
        },
        onNoSpeech: () => {
          discardRecordingRef.current = true;
          finishListeningRef.current();
        },
        onLevel: setAudioLevel,
      });
    } finally {
      isStartingRef.current = false;
    }
  }, [stopSilenceDetector]);

  startListeningRef.current = startListening;

  const enterSession = useCallback(async () => {
    if (sessionRef.current || isStartingRef.current) return;

    sessionRef.current = true;
    setIsSessionOpen(true);
    try {
      await startListening();
    } catch (error) {
      await cancelSession();
      throw error;
    }
  }, [cancelSession, startListening]);

  const exitSession = useCallback(() => {
    void cancelSession();
  }, [cancelSession]);

  useEffect(() => {
    void Audio.requestPermissionsAsync();
    void setRecordingAudioMode();

    return () => {
      sessionRef.current = false;
      stopSilenceDetector();
      void stopSound();
      void stopRecordingTracks();
    };
  }, [stopRecordingTracks, stopSilenceDetector, stopSound]);

  return {
    state,
    isSessionOpen,
    audioLevel,
    enterSession,
    exitSession,
    isBusy: state === "processing" || state === "speaking",
  };
}

export async function fetchTtsAudio(text: string, signal: AbortSignal): Promise<Blob> {
  const res = await fetch("/api/walli/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
    signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err.error === "string" ? err.error : "Speech generation failed"
    );
  }

  return res.blob();
}

export async function playTtsAudio(
  blob: Blob,
  signal: AbortSignal,
  onStart?: () => void
): Promise<void> {
  const url = URL.createObjectURL(blob);
  const audio = new Audio();
  audio.src = url;
  audio.preload = "auto";

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      URL.revokeObjectURL(url);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };

    const onEnded = () => {
      cleanup();
      resolve();
    };

    const onError = () => {
      cleanup();
      reject(new Error("Failed to play audio"));
    };

    if (signal.aborted) {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    signal.addEventListener(
      "abort",
      () => {
        audio.pause();
        cleanup();
        reject(new DOMException("Aborted", "AbortError"));
      },
      { once: true }
    );

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    onStart?.();
    audio.play().catch(reject);
  });
}

/**
 * Plays sentence-sized chunks of speech in order as they're pushed, while
 * fetching each chunk's audio in parallel with playback of the previous one —
 * so speech starts on the first sentence instead of waiting for the whole reply.
 */
export interface SpeechQueue {
  push: (text: string) => void;
  finish: () => Promise<void>;
}

export function createSpeechQueue(signal: AbortSignal, onStart?: () => void): SpeechQueue {
  let chain: Promise<void> = Promise.resolve();
  let started = false;

  const push = (text: string) => {
    if (signal.aborted || !text.trim()) return;
    started = true;
    const audioPromise = fetchTtsAudio(text, signal);
    chain = chain.then(async () => {
      if (signal.aborted) return;
      const blob = await audioPromise;
      if (signal.aborted) return;
      await playTtsAudio(blob, signal, onStart);
    });
  };

  const finish = async () => {
    if (!started) return;
    await chain;
  };

  return { push, finish };
}

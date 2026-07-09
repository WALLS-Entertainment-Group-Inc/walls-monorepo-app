/** RMS below this = silence. Lower = treats quiet "ah/um" as still speaking. */
const SILENCE_THRESHOLD = 0.008;
/** How long user must be fully quiet before we auto-send. */
const SILENCE_DURATION_MS = 1100;
const MIN_SPEECH_MS = 400;
const MAX_RECORDING_MS = 90_000;
const NO_SPEECH_TIMEOUT_MS = 20_000;

interface SilenceDetectorOptions {
  onSilence: () => void;
  onMaxDuration?: () => void;
  onNoSpeech?: () => void;
  onLevel?: (level: number) => void;
}

export function startSilenceDetector(
  stream: MediaStream,
  { onSilence, onMaxDuration, onNoSpeech, onLevel }: SilenceDetectorOptions
): () => void {
  const audioContext = new AudioContext();
  const source = audioContext.createMediaStreamSource(stream);
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  source.connect(analyser);

  const samples = new Uint8Array(analyser.fftSize);
  let silenceStart: number | null = null;
  let speechDetected = false;
  let speechStartTime: number | null = null;
  let rafId = 0;
  let stopped = false;
  const startedAt = Date.now();

  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(rafId);
    clearTimeout(maxTimer);
    clearTimeout(noSpeechTimer);
    onLevel?.(0);
    source.disconnect();
    void audioContext.close();
  };

  const maxTimer = setTimeout(() => {
    stop();
    onMaxDuration?.();
    onSilence();
  }, MAX_RECORDING_MS);

  const noSpeechTimer = setTimeout(() => {
    if (!speechDetected) {
      stop();
      onNoSpeech?.();
    }
  }, NO_SPEECH_TIMEOUT_MS);

  const tick = () => {
    if (stopped) return;

    analyser.getByteTimeDomainData(samples);
    let sumSquares = 0;
    for (let i = 0; i < samples.length; i++) {
      const sample = (samples[i] - 128) / 128;
      sumSquares += sample * sample;
    }
    const rms = Math.sqrt(sumSquares / samples.length);
    onLevel?.(Math.min(1, rms / 0.1));
    const now = Date.now();

    if (rms > SILENCE_THRESHOLD) {
      if (!speechDetected) {
        speechDetected = true;
        speechStartTime = now;
      }
      silenceStart = null;
    } else if (speechDetected) {
      // Brief dips (stutters, trailing off) — only start counting after a short grace window
      if (!silenceStart) {
        silenceStart = now + 150;
      } else if (
        now >= silenceStart &&
        now - silenceStart >= SILENCE_DURATION_MS &&
        speechStartTime &&
        now - speechStartTime >= MIN_SPEECH_MS &&
        now - startedAt >= MIN_SPEECH_MS
      ) {
        stop();
        onSilence();
        return;
      }
    }

    rafId = requestAnimationFrame(tick);
  };

  rafId = requestAnimationFrame(tick);

  return stop;
}

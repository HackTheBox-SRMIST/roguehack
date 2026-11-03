export type PlaybackStatus = "idle" | "loading" | "playing" | "ended" | "unavailable";

const VOLUME = 1;
const MAX_SECONDS = 12;
/** Fade-out length scales with the cue so short stings stay punchy. */
const FADE_OUT_MIN = 1;
const FADE_OUT_MAX = 2.5;

/** One cue at a time. Async completions from a previous draw cannot restart it. */
export function createThemePlayer(
  onStatus: (status: PlaybackStatus) => void,
  makeAudio: (src: string) => HTMLAudioElement = (src) => new Audio(src),
) {
  let element: HTMLAudioElement | null = null;
  let source = "";
  let generation = 0;
  let started = false;
  let muted = false;
  let deadline: ReturnType<typeof setTimeout> | undefined;

  const clearDeadline = () => {
    clearTimeout(deadline);
    deadline = undefined;
  };

  const release = () => {
    generation += 1;
    started = false;
    clearDeadline();
    if (element) {
      element.onended = null;
      element.onerror = null;
      element.ontimeupdate = null;
      element.pause();
      element.removeAttribute("src");
      element.load();
      element = null;
    }
    source = "";
  };

  const prepare = (src: string) => {
    release();
    source = src;
    const audio = makeAudio(src);
    element = audio;
    audio.preload = "auto";
    audio.loop = false;
    audio.muted = muted;
    audio.volume = 0;
    const version = generation;
    // Called inside the roll gesture to unlock delayed playback on mobile.
    void audio.play().then(() => {
      if (version !== generation || started) return;
      audio.pause();
      audio.currentTime = 0;
    }).catch(() => undefined);
  };

  const play = (src: string, maxSeconds = MAX_SECONDS) => {
    if (!element || source !== src) prepare(src);
    const audio = element!;
    const version = generation;
    const limit = Number.isFinite(maxSeconds) && maxSeconds > 0 ? maxSeconds : MAX_SECONDS;
    started = true;
    clearDeadline();
    audio.currentTime = 0;
    audio.volume = VOLUME;
    audio.muted = muted;
    onStatus("loading");

    const finish = (status: "ended" | "unavailable") => {
      if (version !== generation || !started) return;
      release();
      onStatus(status);
    };
    audio.onended = () => finish("ended");
    audio.onerror = () => finish("unavailable");
    audio.ontimeupdate = () => {
      if (version !== generation || !started) return;
      const end = Number.isFinite(audio.duration) ? Math.min(limit, audio.duration) : limit;
      const remaining = end - audio.currentTime;
      if (remaining <= 0) finish("ended");
      else {
        const fadeOut = Math.min(FADE_OUT_MAX, Math.max(FADE_OUT_MIN, end * 0.18));
        audio.volume = VOLUME * Math.min(1, remaining / fadeOut, audio.currentTime / 0.2);
      }
    };
    deadline = setTimeout(() => finish("unavailable"), 8000);

    void audio.play().then(() => {
      if (version !== generation || !started) return;
      clearDeadline();
      onStatus("playing");
      deadline = setTimeout(() => finish("ended"), limit * 1000);
    }).catch(() => finish("unavailable"));
  };

  return {
    prepare,
    play,
    stop: () => { release(); onStatus("idle"); },
    setMuted: (value: boolean) => { muted = value; if (element) element.muted = value; },
    dispose: release,
  };
}

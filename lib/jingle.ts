/** Synthesized percussion for dice landing only. Theme cues use source recordings. */
export type Jingle = {
  ensure: () => void;
  setMuted: (muted: boolean) => void;
  tick: (pitch?: number) => void;
  startRoll: () => void;
  stopRoll: () => void;
  dispose: () => void;
};

export function createJingle(initialMuted: boolean): Jingle {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let muted = initialMuted;
  let rollTimer: ReturnType<typeof setInterval> | undefined;
  const ensure = () => {
    if (!ctx) {
      const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      ctx = new Ctor();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.2;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
  };
  const setMuted = (value: boolean) => {
    muted = value;
    if (ctx && master) master.gain.setTargetAtTime(muted ? 0 : 0.2, ctx.currentTime, 0.02);
  };
  const tick = (pitch = 210) => {
    if (!ctx || !master) return;
    const at = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(pitch, at);
    osc.frequency.exponentialRampToValueAtTime(Math.max(60, pitch / 2), at + 0.07);
    gain.gain.setValueAtTime(0.12, at);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);

    osc.connect(gain);
    gain.connect(master);
    osc.start(at);
    osc.stop(at + 0.11);
  };

  const dispose = () => {
    stopRoll();
    if (ctx) void ctx.close().catch(() => undefined);
    ctx = null;
    master = null;
  };
  const startRoll = () => {
    stopRoll();
    let count = 0;
    const playTick = () => {
      tick(count++ % 2 ? 185 : 245);
    };
    playTick();
    rollTimer = setInterval(playTick, 135);
  };
  const stopRoll = () => {
    if (rollTimer !== undefined) clearInterval(rollTimer);
    rollTimer = undefined;
  };
  return { ensure, setMuted, tick, startRoll, stopRoll, dispose };
}

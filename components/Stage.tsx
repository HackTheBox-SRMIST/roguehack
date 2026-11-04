"use client";

import { AnimatePresence, MotionConfig, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { PROBLEM_BY_FACE, THEME_BY_FACE } from "@/data/rogue";
import { rollBoth } from "@/lib/roll";
import { useThemeAudio } from "@/lib/useThemeAudio";
import Dice from "./Dice";
import MuteButton from "./MuteButton";
import ThemeWorld from "./ThemeWorld";

type Phase = "idle" | "rolling" | "reveal" | "result";

const TIMING = {
  firstStop: 1600,
  secondStop: 1900,
  shrink: 2200,
  result: 2860,
} as const;

const WIPE_IN = "polygon(-45% 0, -5% 0, -30% 100%, -70% 100%)";
const WIPE_OUT = "polygon(105% 0, 145% 0, 120% 100%, 80% 100%)";

export default function Stage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [rolls, setRolls] = useState<[number, number]>([0, 0]);
  const [stopped, setStopped] = useState<[boolean, boolean]>([false, false]);
  const [shakeTick, setShakeTick] = useState(0);

  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const rollInProgress = useRef(false);
  const shake = useAnimationControls();
  const prefersReduced = useReducedMotion();
  const audio = useThemeAudio();

  /** Last 3 theme faces rolled — excluded from the next roll. */
  const recentThemes = useRef<number[]>([]);
  /** Last 3 problem faces rolled — excluded from the next roll. */
  const recentProblems = useRef<number[]>([]);

  const theme = rolls[0] ? THEME_BY_FACE[rolls[0]] : null;
  const problem = rolls[1] ? PROBLEM_BY_FACE[rolls[1]] : null;
  const compact = phase === "reveal" || phase === "result";
  /** Clicking the dice (or just around them) rolls, matching the button and Space. */
  const canRoll = phase === "idle" || phase === "result";

  const clearTimers = useCallback(() => {
    timers.current.forEach((timer) => clearTimeout(timer));
    timers.current = [];
  }, []);

  const later = useCallback((callback: () => void, delay: number) => {
    timers.current.push(setTimeout(callback, delay));
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  useEffect(() => {
    if (!shakeTick || prefersReduced) return;
    void shake.start({
      x: [0, -10, 9, -6, 4, 0],
      y: [0, 5, -4, 3, -2, 0],
      transition: { duration: 0.3, ease: "easeOut" },
    });
  }, [prefersReduced, shake, shakeTick]);

  const reset = useCallback(() => {
    clearTimers();
    rollInProgress.current = false;
    audio.stop();
    setRolls([0, 0]);
    setStopped([false, false]);
    setPhase("idle");
  }, [audio, clearTimers]);

  const startRoll = useCallback(() => {
    if (rollInProgress.current || (phase !== "idle" && phase !== "result")) return;
    rollInProgress.current = true;
    clearTimers();
    audio.stop();

    const next = rollBoth(recentThemes.current, recentProblems.current);
    const nextTheme = THEME_BY_FACE[next.themeFace];

    // Record this roll in history; keep only the last 3
    recentThemes.current = [next.themeFace, ...recentThemes.current].slice(0, 3);
    recentProblems.current = [next.problemFace, ...recentProblems.current].slice(0, 3);

    audio.unlock(nextTheme);
    // Start loading the selected wallpaper during the dice animation.
    if (nextTheme.poster) {
      const image = new window.Image();
      image.referrerPolicy = "no-referrer";
      image.src = nextTheme.poster;
    }
    setRolls([next.themeFace, next.problemFace]);
    setStopped([false, false]);

    if (prefersReduced) {
      setStopped([true, true]);
      setPhase("result");
      rollInProgress.current = false;
      audio.play(nextTheme);
      return;
    }

    setPhase("rolling");

    later(() => {
      setStopped([true, false]);
      setShakeTick((tick) => tick + 1);
    }, TIMING.firstStop);

    later(() => {
      setStopped([true, true]);
      setShakeTick((tick) => tick + 1);
    }, TIMING.secondStop);

    later(() => setPhase("reveal"), TIMING.shrink);

    later(() => {
      setPhase("result");
      rollInProgress.current = false;
      audio.play(nextTheme);
    }, TIMING.result);
  }, [audio, clearTimers, later, phase, prefersReduced]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.defaultPrevented) return;
      const target = event.target;
      // Preserve typing and native keyboard behavior on focused controls.
      if (target instanceof HTMLElement && (target.isContentEditable || (target.closest("button, a, input, textarea, select, [role='button'], [role='textbox']") && !target.closest("[data-roll-shortcut]")))) return;
      event.preventDefault();
      if (phase === "idle" || phase === "result") startRoll();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, startRoll]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex w-full flex-1" aria-label="RogueHack dice stage">
        <motion.div
          animate={shake}
          className="dice-stage relative flex min-h-[420px] w-full flex-1 flex-col overflow-hidden border-4 border-ink bg-bone shadow-brutal-lg"
        >
          {phase === "idle" && (
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.11]"
                style={{
                  backgroundImage: "radial-gradient(#0A0A0A 1.4px, transparent 1.5px)",
                  backgroundSize: "15px 15px",
                }}
              />
              <div className="absolute -left-12 top-10 h-24 w-52 rotate-12 border-4 border-ink bg-lime/70" />
              <div className="absolute -right-10 bottom-12 h-20 w-44 -rotate-6 border-4 border-ink bg-lime/40" />
            </div>
          )}

          <AnimatePresence>
            {theme && problem && compact && (
              <ThemeWorld
                key={theme.slug}
                theme={theme}
                problem={problem}
                revealed={phase === "result"}
                onNext={reset}
              />
            )}
          </AnimatePresence>

          {phase === "reveal" && theme && (
            <>
              <motion.div
                aria-hidden="true"
                initial={{ clipPath: WIPE_IN }}
                animate={{ clipPath: WIPE_OUT }}
                transition={{ duration: 0.66, ease: [0.76, 0, 0.24, 1] }}
                className="pointer-events-none absolute inset-0 z-40 bg-ink"
              />
              <motion.div
                aria-hidden="true"
                initial={{ clipPath: "polygon(-38% 0, 2% 0, -23% 100%, -63% 100%)" }}
                animate={{ clipPath: "polygon(112% 0, 152% 0, 127% 100%, 87% 100%)" }}
                transition={{ duration: 0.66, ease: [0.76, 0, 0.24, 1] }}
                className="pointer-events-none absolute inset-0 z-40"
                style={{ backgroundColor: theme.accent }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(${theme.dots} 1.8px, transparent 1.9px)`,
                    backgroundSize: "11px 11px",
                  }}
                />
              </motion.div>
            </>
          )}

          {canRoll && (
            // Separate hit area so clicking around the dice rolls without
            // touching the dice wrapper's layout, transform or spacing.
            <motion.div
              aria-hidden="true"
              onClick={startRoll}
              initial={false}
              animate={{
                top: compact ? 14 : "42%",
                y: compact ? 0 : "-50%",
                x: "-50%",
                scale: compact ? 0.45 : 1,
              }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
              style={{ transformOrigin: "top center" }}
              className="absolute left-1/2 z-30 h-[clamp(170px,24dvh,220px)] w-[clamp(230px,30vw,360px)] cursor-pointer"
            />
          )}

          <motion.div
            className="pointer-events-none absolute left-1/2 z-30 flex items-start justify-center gap-8 sm:gap-12"
            style={{ transformOrigin: "top center" }}
            initial={false}
            animate={{
              top: compact ? 14 : "42%",
              y: compact ? 0 : "-50%",
              x: "-50%",
              scale: compact ? 0.45 : 1,
            }}
            transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          >
            <Dice
              label="THEME"
              value={rolls[0]}
              spinning={phase === "rolling" && !stopped[0]}
              compact={compact}
            />
            <Dice
              label="PROBLEM"
              value={rolls[1]}
              spinning={phase === "rolling" && !stopped[1]}
              compact={compact}
            />
          </motion.div>

          <AnimatePresence>
            {(phase === "idle" || phase === "rolling") && (
              <motion.div
                key="controls"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 14, scale: 0.96 }}
                transition={{ duration: 0.24, ease: "easeOut" }}
                className="absolute inset-x-0 top-[66%] z-30 flex flex-col items-center gap-3 px-4"
              >
                <button
                  type="button"
                  onClick={startRoll}
                  aria-keyshortcuts="Space"
                  data-roll-shortcut
                  disabled={phase !== "idle"}
                  className="display flex items-center gap-3 border-4 border-ink bg-ink px-6 py-3 text-[clamp(1.35rem,2.6vw,2rem)] italic tracking-wide text-lime shadow-brutal-lg transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#151515] active:translate-x-1 active:translate-y-1 active:shadow-brutal-sm disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:bg-ink sm:gap-4 sm:px-8 sm:py-4"
                >
                  <span>{phase === "rolling" ? "ROLLING…" : "ROLL THE DICE"}</span>
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className={`h-7 w-7 shrink-0 sm:h-9 sm:w-9 ${phase === "rolling" ? "animate-pulse" : ""}`}
                  >
                    <rect
                      x="2"
                      y="2"
                      width="20"
                      height="20"
                      rx="2"
                      fill="currentColor"
                      fillOpacity="0.12"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle cx="8" cy="8" r="1.7" fill="currentColor" />
                    <circle cx="16" cy="8" r="1.7" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.7" fill="currentColor" />
                    <circle cx="8" cy="16" r="1.7" fill="currentColor" />
                    <circle cx="16" cy="16" r="1.7" fill="currentColor" />
                  </svg>
                </button>

              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute right-3 top-3 z-50 flex flex-col items-end gap-2">
            <MuteButton muted={audio.muted} onToggle={audio.toggleMuted} />
            {phase === "result" && theme && (audio.status === "ended" || audio.status === "unavailable") && (
              <button
                type="button"
                onClick={() => audio.play(theme)}
                aria-label={audio.status === "unavailable" ? "Retry theme sound" : "Replay theme sound"}
                title={audio.status === "unavailable" ? "Retry sound" : "Replay sound"}
                className="grid h-11 w-11 place-items-center border-2 border-ink bg-white shadow-brutal-sm hover:bg-lime"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
                  <path d="M20 11a8 8 0 1 1-2.34-5.66L20 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 3v5h-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
            {phase === "result" && audio.status === "unavailable" && (
              <p role="status" className="bg-ink px-2 py-1 font-mono text-[9px] text-white">Sound couldn’t load</p>
            )}
          </div>

          <p className="sr-only" aria-live="polite">
            {phase === "rolling"
              ? "Rolling the dice."
              : phase === "result" && theme && problem
                ? `Rolled ${theme.name} with ${problem.code}: ${problem.title}.`
                : ""}
          </p>
        </motion.div>
      </section>
    </MotionConfig>
  );
}

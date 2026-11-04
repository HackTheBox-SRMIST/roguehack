"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import type { Problem, Theme } from "@/data/rogue";
import ProblemCard from "./ProblemCard";
import SceneBackdrop from "./SceneBackdrop";

type ThemeWorldProps = {
  theme: Theme;
  problem: Problem;
  revealed: boolean;
  onNext: () => void;
};

const BURST_PATH =
  "M100 2 L118 58 L170 22 L148 78 L198 88 L146 108 L178 162 L122 136 L100 198 L78 136 L22 162 L52 108 L2 88 L52 78 L30 22 L82 58 Z";

const characterVariants: Variants = {
  hidden: { opacity: 0, scale: 0.2, rotate: -14, y: 40 },
  show: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    y: 0,
    transition: { type: "spring", stiffness: 260, damping: 18, mass: 0.9, delay: 0.05 },
  },
};

export default function ThemeWorld({ theme, problem, revealed, onNext }: ThemeWorldProps) {
  const [artFailed, setArtFailed] = useState(false);
  const showArt = theme.hasArt && !artFailed;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative z-20 flex flex-1 flex-col overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      <SceneBackdrop theme={theme} />

      <div className="theme-content relative z-10 flex flex-1 flex-col items-center justify-center gap-4 px-5 pb-20 pt-24 sm:px-8 lg:flex-row lg:gap-8 lg:px-10 xl:gap-12">
        <motion.div
          variants={characterVariants}
          initial="hidden"
          animate={revealed ? "show" : "hidden"}
          className="relative flex shrink-0 flex-col items-center"
        >
          <div className="theme-character relative grid aspect-square w-[clamp(200px,28vw,360px)] place-items-center">
            <svg
              viewBox="0 0 200 200"
              aria-hidden="true"
              className="absolute inset-0 h-full w-full -rotate-6"
            >
              <path d={BURST_PATH} fill="#0A0A0A" transform="translate(7 7)" />
              <path
                d={BURST_PATH}
                fill={theme.burst ?? theme.accent}
                stroke="#0A0A0A"
                strokeWidth="6"
                strokeLinejoin="miter"
              />
            </svg>

            {showArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={theme.character}
                alt={theme.characterName}
                referrerPolicy="no-referrer"
                onError={() => setArtFailed(true)}
                className="absolute inset-0 z-10 m-auto h-[78%] w-[78%] object-contain"
                style={{
                  transform: `scale(${theme.characterScale ?? 1})`,
                  filter: [
                    // Subtle 1px white outline — just enough to lift off the background
                    "drop-shadow(1px 0 0 #fff)",
                    "drop-shadow(-1px 0 0 #fff)",
                    "drop-shadow(0 1px 0 #fff)",
                    "drop-shadow(0 -1px 0 #fff)",
                    // Depth shadow
                    "drop-shadow(5px 5px 0 rgba(0,0,0,0.8))",
                  ].join(" "),
                }}
              />
            ) : (
              <span
                role="img"
                aria-label={theme.characterName}
                className="absolute inset-0 z-10 flex select-none items-center justify-center text-[clamp(4.5rem,11vw,10.5rem)] leading-none"
                style={{
                  transform: `scale(${theme.characterScale ?? 1})`,
                  filter: [
                    "drop-shadow(1px 0 0 #fff)",
                    "drop-shadow(-1px 0 0 #fff)",
                    "drop-shadow(0 1px 0 #fff)",
                    "drop-shadow(0 -1px 0 #fff)",
                    "drop-shadow(5px 5px 0 rgba(0,0,0,0.8))",
                  ].join(" "),
                }}
              >
                {theme.emoji}
              </span>
            )}
          </div>

          <div
            className="mt-2 -rotate-2 border-3 border-ink px-3 py-1 shadow-brutal-sm"
            style={{ backgroundColor: theme.accent, color: theme.accentInk }}
          >
            <p className="display text-xs tracking-wide sm:text-sm">
              {theme.name.toUpperCase()}
            </p>
          </div>

        </motion.div>

        <ProblemCard theme={theme} problem={problem} revealed={revealed} />
      </div>

      <motion.button
        type="button"
        onClick={onNext}
        data-roll-shortcut
        aria-keyshortcuts="Space"
        initial={{ opacity: 0, y: 18 }}
        animate={revealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ delay: revealed ? 0.55 : 0, duration: 0.3, ease: "easeOut" }}
        whileHover={{ x: -2, y: -2 }}
        whileTap={{ x: 2, y: 2 }}
        disabled={!revealed}
        className="absolute bottom-4 right-4 z-30 flex min-h-11 items-center gap-2 border-4 border-ink bg-lime px-4 py-2 font-mono text-[10px] font-bold tracking-[0.16em] shadow-brutal transition-colors hover:bg-white disabled:pointer-events-none sm:bottom-5 sm:right-5 sm:text-xs"
      >
        NEXT
        <span aria-hidden="true" className="display text-base leading-none">
          →
        </span>
      </motion.button>
    </motion.div>
  );
}

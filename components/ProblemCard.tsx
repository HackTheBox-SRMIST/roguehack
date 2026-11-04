"use client";

import { motion, type Variants } from "framer-motion";
import type { Problem, Theme } from "@/data/rogue";

type ProblemCardProps = {
  theme: Theme;
  problem: Problem;
  revealed: boolean;
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 70, rotate: 4, scale: 0.96 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 1.2,
    scale: 1,
    transition: { type: "spring", stiffness: 220, damping: 24, mass: 0.9, delay: 0.16 },
  },
};

export default function ProblemCard({ theme, problem, revealed }: ProblemCardProps) {
  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate={revealed ? "show" : "hidden"}
      className="relative w-full min-w-0 max-w-[580px] border-4 border-ink bg-bone shadow-brutal-lg"
    >
      <div
        className="flex items-center border-b-4 border-ink px-3 py-2 sm:px-4"
        style={{ backgroundColor: theme.accent, color: theme.accentInk }}
      >
        <span
          className="font-mono text-[10px] font-black uppercase leading-tight tracking-[0.18em] sm:text-[11px] sm:tracking-[0.24em]"
          style={{ color: theme.accentInk, WebkitTextStroke: "0.4px currentColor" }}
        >
          {problem.code}
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h2 className="display text-[clamp(1.4rem,2.8vw,2.15rem)] italic leading-[1.02]">
          {problem.title}
        </h2>
        <p className="mt-3 text-[13px] leading-relaxed text-ink/80 sm:text-sm">
          {problem.description}
        </p>

      </div>
    </motion.article>
  );
}

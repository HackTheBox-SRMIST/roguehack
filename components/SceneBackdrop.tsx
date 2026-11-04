"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Theme } from "@/data/rogue";

export default function SceneBackdrop({ theme }: { theme: Theme }) {
  const prefersReduced = useReducedMotion();
  const wallpaperSrc = theme.poster || theme.scene;

  return (
    <motion.div
      aria-hidden="true"
      initial={{ scale: prefersReduced ? 1 : 1.045 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.6, ease: "easeOut" }}
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ backgroundColor: theme.bg }}
    >
      <img
        src={wallpaperSrc}
        alt=""
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: theme.wallpaperPosition }}
      />
      <div className="absolute inset-0" style={{ backgroundColor: theme.bg, opacity: theme.sceneWash }} />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,transparent_35%,rgba(0,0,0,0.12)_65%,rgba(0,0,0,0.65)_100%)]" />
    </motion.div>
  );
}

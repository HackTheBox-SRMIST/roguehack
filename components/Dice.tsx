"use client";

import { motion } from "framer-motion";

const FACES = [1, 2, 3, 4, 5, 6] as const;

/** Cube rotation that brings each face to the front. */
const FACE_ROTATION: Record<number, { x: number; y: number }> = {
  1: { x: 0, y: 0 },
  2: { x: -90, y: 0 },
  3: { x: 0, y: -90 },
  4: { x: 0, y: 90 },
  5: { x: 90, y: 0 },
  6: { x: 0, y: 180 },
};

type DiceProps = {
  label: string;
  /** 0 while idle, 1-6 once the roll has been made. */
  value: number;
  spinning: boolean;
  compact?: boolean;
};

export default function Dice({ label, value, spinning, compact = false }: DiceProps) {
  const rotation = FACE_ROTATION[value] ?? FACE_ROTATION[1];
  const showNumbers = value > 0;

  return (
    <div
      className="flex flex-col items-center gap-2 sm:gap-3"
      role="img"
      aria-label={`${label} die ${showNumbers ? `showing ${value}` : "ready to roll"}`}
    >
      <motion.div
        animate={
          spinning
            ? { scale: 1, y: 0 }
            : { scale: [1, 1.08, 0.97, 1], y: [0, -12, 2, 0] }
        }
        transition={{ duration: 0.36, ease: "easeOut" }}
      >
        <div className="dice-scene">
          <div className="dice-tilt">
            <div
              className={`dice-cube ${spinning ? "dice-tumble" : ""}`}
              style={
                spinning
                  ? undefined
                  : { transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }
              }
            >
              {FACES.map((face) => (
                <div key={face} className={`dice-face dice-face-${face}`} aria-hidden="true">
                  <span className="dice-number">{showNumbers ? face : "?"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.span
        animate={{ opacity: compact ? 0 : 1 }}
        transition={{ duration: 0.2 }}
        className="border-2 border-ink bg-white px-2 py-0.5 font-mono text-[9px] font-bold tracking-[0.24em] sm:text-[10px]"
      >
        {label}
      </motion.span>
    </div>
  );
}

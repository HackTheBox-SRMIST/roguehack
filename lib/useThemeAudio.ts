"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Theme } from "@/data/rogue";
import { createJingle, type Jingle } from "./jingle";
import { createThemePlayer, type PlaybackStatus } from "./theme-player";

export function useThemeAudio() {
  const [muted, setMuted] = useState(false);
  const [status, setStatus] = useState<PlaybackStatus>("idle");
  const mutedRef = useRef(false);
  const jingleRef = useRef<Jingle | null>(null);
  const playerRef = useRef<ReturnType<typeof createThemePlayer> | null>(null);

  const getPlayer = useCallback(() => {
    if (!playerRef.current) {
      playerRef.current = createThemePlayer(setStatus);
      playerRef.current.setMuted(mutedRef.current);
    }
    return playerRef.current;
  }, []);

  useEffect(() => () => {
    jingleRef.current?.dispose();
    jingleRef.current = null;
    playerRef.current?.dispose();
    playerRef.current = null;
  }, []);

  const toggleMuted = useCallback(() => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    jingleRef.current?.setMuted(next);
    playerRef.current?.setMuted(next);
  }, []);

  const unlock = useCallback((theme: Theme) => {
    if (!jingleRef.current) jingleRef.current = createJingle(mutedRef.current);
    jingleRef.current.ensure();
    getPlayer().prepare(theme.hook);
  }, [getPlayer]);

  const play = useCallback((theme: Theme) => getPlayer().play(theme.hook, theme.hookSeconds), [getPlayer]);
  const stop = useCallback(() => playerRef.current?.stop(), []);
  const tick = useCallback((pitch?: number) => jingleRef.current?.tick(pitch), []);
  const startRoll = useCallback(() => jingleRef.current?.startRoll(), []);
  const stopRoll = useCallback(() => jingleRef.current?.stopRoll(), []);

  return useMemo(
    () => ({ muted, status, toggleMuted, unlock, play, stop, tick, startRoll, stopRoll }),
    [muted, status, toggleMuted, unlock, play, stop, tick, startRoll, stopRoll],
  );
}

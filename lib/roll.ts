/**
 * Uniform random pick from an allowed set using crypto.getRandomValues.
 * Rejection sampling keeps the distribution flat.
 */
function rollFrom(allowed: number[]): number {
  const n = allowed.length;
  const buffer = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / n) * n;
  let value = 0;

  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);

  return allowed[value % n];
}

/** Uniform random face in 1..6, excluding specified faces. */
export function rollFace(exclude: number[] = []): number {
  const allowed = [1, 2, 3, 4, 5, 6].filter((f) => !exclude.includes(f));
  // Safety: if all faces are excluded somehow, pick from all
  return rollFrom(allowed.length > 0 ? allowed : [1, 2, 3, 4, 5, 6]);
}

export type Roll = { themeFace: number; problemFace: number };

/**
 * Roll both dice, excluding recently-used faces.
 * @param excludeThemes - theme faces to skip (last N rolls)
 * @param excludeProblems - problem faces to skip (last N rolls)
 */
export function rollBoth(
  excludeThemes: number[] = [],
  excludeProblems: number[] = [],
): Roll {
  return {
    themeFace: rollFace(excludeThemes),
    problemFace: rollFace(excludeProblems),
  };
}

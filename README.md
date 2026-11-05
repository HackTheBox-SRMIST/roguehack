# RogueHack 1.0 — HTB SRMIST

Single-page, neo-brutalist hackathon draw site. One click rolls two 3D dice: one lands a theme, the other lands a problem statement. The stage then transforms into that theme's world with a character pop, a problem card, the theme hook and a Next Team reset.

Built with Next.js (app router), Tailwind CSS and Framer Motion. No 3D library, no database, no API keys.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000. Production build:

```bash
npm run build
npm start
```

## Before the event

Everything you need to change lives in [`data/rogue.ts`](data/rogue.ts).

1. **Write the final problem statements.** Replace the six `PROBLEMS` entries (title, description, tags). Face 2 of the problem die maps to `PROBLEMS` index 1, and so on.
2. **Theme media.** `data/theme-media.ts` holds official web artwork and community-hosted sound cues with source links. The six worlds are Shinchan, Spider-Man, Kick Buttowski, Dragon Ball, Harry Potter, and Super Mario.
3. **Audio.** Cues play once for up to 12 seconds with a fade. Replay and retry controls appear when needed. Mute survives Next Team resets. Original synthesized melodies have been removed; only the dice landing ticks are synthesized.
4. **Artwork.** Official web backgrounds replace the stock footage. Local SVG scenes and character emoji are fallbacks if images fail. `wallpaperPosition` and `sceneWash` control cropping and readability.
5. **Provenance.** See [`ASSET-SOURCES.md`](ASSET-SOURCES.md). The sound uploads are community-hosted, not verified publisher releases. Remote media requires internet access.

## Checks

```bash
npm run build
npm test
```

The audio tests cover reset races, immediate reduced-motion reveals, theme changes, fade/cutoff, mute persistence, and retry after a failed source.

## Interaction

1. **Idle** — two question-mark dice, labels, and the ROLL THE DICE button.
2. **Roll** — both dice tumble; die 1 lands at 1.6s, die 2 at 1.9s with a stage shake. Results use `crypto.getRandomValues` with rejection sampling, so the distribution is flat and both dice can match.
3. **Reveal** — dice shrink to a strip at the top, a diagonal halftone wipe sweeps the stage, and the theme world mounts underneath.
4. **Result** — character springs in on the left, problem card slides in on the right, the hook starts, and NEXT TEAM resets everything. Audio mute survives the reset.
5. **Reduced motion** — `prefers-reduced-motion` skips the tumble, wipe and spring and shows the result immediately.

## Structure

```
app/                 layout, page, global neo-brutalist styles
components/          Stage orchestrator, dice, scene backdrop, theme world, card, chrome
data/rogue.ts        themes, problem statements, dice mappings
lib/roll.ts          crypto dice roll
lib/jingle.ts        dice landing ticks
lib/useThemeAudio.ts React audio state
lib/theme-player.ts  recording playback, cutoff, mute and cleanup
data/theme-media.ts  remote media URLs and source pages
public/themes/<slug> local SVG fallback and character art
```

## Deploy

Push to GitHub and import the repo on Vercel. Framework preset: Next.js. No environment variables required. The page is a single client-interactive route; everything else is static.

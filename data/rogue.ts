import { THEME_MEDIA } from "./theme-media";

/**
 * RogueHack 1.0 — single source of truth.
 *
 * Everyone edits this file before the event:
 *  - Problems 1-6 are the final problem statements.
 *  - Theme accent / copy can be tweaked without touching components.
 *  - Character art, official web artwork and audio cues are wired in;
 *    update data/theme-media.ts to swap remote artwork or recordings.
 */

export type ThemeSlug =
  | "shinchan"
  | "spiderman"
  | "kick-buttowski"
  | "dragon-ball"
  | "harry-potter"
  | "mario";

export type Theme = {
  /** Die 1 face this theme maps to. */
  face: 1 | 2 | 3 | 4 | 5 | 6;
  slug: ThemeSlug;
  name: string;
  /** Theme colour used for accents, the wipe and the burst. */
  accent: string;
  /** Optional burst colour when the accent would blend into the character art. */
  burst?: string;
  /** Text colour that sits on top of `accent`. */
  accentInk: string;
  /** Base colour behind the scene (also the page wash for dark worlds). */
  bg: string;
  /** Primary text colour used on the scene. */
  ink: string;
  /** Halftone dot colour over the scene. */
  dots: string;
  /** Local scene used if the web wallpaper is unavailable. */
  scene: string;
  /** Official web wallpaper or promotional artwork. */
  poster: string | null;
  /** 0-1 colour wash over the scene. Higher keeps copy readable. */
  sceneWash: number;
  /** Fallback emoji if character artwork cannot load. */
  emoji: string;
  /** One-line flavour copy shown under the character. */
  tagline: string;
  characterName: string;
  /** Transparent PNG path. Used only when `hasArt` is true. */
  character: string;
  hasArt: boolean;
  /** Optional size multiplier for the character inside its burst (default 1). */
  characterScale?: number;
  /** Source recording played once on reveal. */
  hook: string;
  /** Optional playback length in seconds (default 12) before the closing fade. */
  hookSeconds?: number;
  /** Crop focal point for the wallpaper. */
  wallpaperPosition: string;
};

export type Problem = {
  /** Die 2 face this problem maps to. */
  face: 1 | 2 | 3 | 4 | 5 | 6;
  code: string;
  title: string;
  description: string;
};

export const THEMES: Theme[] = [
  {
    face: 1,
    slug: "shinchan",
    name: "Shinchan",
    accent: "#FFD400",
    accentInk: "#0A0A0A",
    bg: "#FFE9A8",
    ink: "#0A0A0A",
    dots: "#0A0A0A",
    scene: THEME_MEDIA["shinchan"].wallpaper,
    poster: THEME_MEDIA["shinchan"].wallpaper,
    sceneWash: 0.12,
    emoji: "😜",
    tagline: "Crayon chaos, five-year-old energy.",
    characterName: "Shinchan",
    character: "/themes/shinchan/character-single.png",
    hasArt: true,
    hook: THEME_MEDIA["shinchan"].sound,
    wallpaperPosition: "center",
  },
  {
    face: 2,
    slug: "spiderman",
    name: "Spider-Man",
    accent: "#E4231A",
    // Comic-book gold burst: highest contrast against the red suit and dark page.
    burst: "#FFC400",
    accentInk: "#0A0A0A",
    bg: "#1B0710",
    ink: "#FFF7F3",
    dots: "#FFFFFF",
    scene: THEME_MEDIA["spiderman"].wallpaper,
    poster: THEME_MEDIA["spiderman"].wallpaper,
    sceneWash: 0.12,
    emoji: "🕷️",
    tagline: "Rooftop swings and last-second saves.",
    characterName: "Spider-Man",
    character: "/themes/spiderman/character.png",
    hasArt: true,
    hook: THEME_MEDIA["spiderman"].sound,
    wallpaperPosition: "center",
  },
  {
    face: 3,
    slug: "kick-buttowski",
    name: "Kick Buttowski",
    accent: "#6EC6FF",
    accentInk: "#0A0A0A",
    bg: "#EAF7FF",
    ink: "#0A0A0A",
    dots: "#0A0A0A",
    scene: THEME_MEDIA["kick-buttowski"].wallpaper,
    poster: THEME_MEDIA["kick-buttowski"].wallpaper,
    sceneWash: 0.12,
    emoji: "🛹",
    tagline: "Half-pipe stunts on a school night.",
    characterName: "Kick",
    character: "/themes/kick-buttowski/character.png",
    hasArt: true,
    hook: THEME_MEDIA["kick-buttowski"].sound,
    wallpaperPosition: "center",
  },
  {
    face: 4,
    slug: "dragon-ball",
    name: "Dragon Ball",
    accent: "#FF7A00",
    // Sky-blue burst contrasts with Goku's orange gi and yellow aura while keeping orange as the UI accent.
    burst: "#38BDF8",
    accentInk: "#0A0A0A",
    bg: "#241046",
    ink: "#FFF7E8",
    dots: "#FFFFFF",
    scene: THEME_MEDIA["dragon-ball"].wallpaper,
    poster: THEME_MEDIA["dragon-ball"].wallpaper,
    sceneWash: 0.12,
    emoji: "🐉",
    tagline: "Power levels well over nine thousand.",
    characterName: "Dragon Ball",
    character: "/themes/dragon-ball/character.png",
    hasArt: true,
    characterScale: 1.18,
    hook: THEME_MEDIA["dragon-ball"].sound,
    wallpaperPosition: "center",
  },
  {
    face: 5,
    slug: "harry-potter",
    name: "Harry Potter",
    accent: "#D4AF37",
    accentInk: "#0A0A0A",
    bg: "#2A0A12",
    ink: "#FFF4DE",
    dots: "#FFFFFF",
    scene: THEME_MEDIA["harry-potter"].wallpaper,
    poster: THEME_MEDIA["harry-potter"].wallpaper,
    sceneWash: 0.12,
    emoji: "🧙",
    tagline: "Wands out, candles floating.",
    characterName: "Harry Potter",
    character: "/themes/harry-potter/character.png",
    hasArt: true,
    hook: THEME_MEDIA["harry-potter"].sound,
    hookSeconds: 14,
    wallpaperPosition: "center",
  },
  {
    face: 6,
    slug: "mario",
    name: "Super Mario",
    accent: "#E52521",
    accentInk: "#0A0A0A",
    bg: "#168BD2",
    ink: "#FFF3E6",
    dots: "#FFFFFF",
    scene: THEME_MEDIA["mario"].wallpaper,
    poster: THEME_MEDIA["mario"].wallpaper,
    sceneWash: 0.08,
    emoji: "🍄",
    tagline: "Power up. Take the leap. Save the day.",
    characterName: "Mario",
    character: "/themes/mario/character.png",
    hasArt: true,
    characterScale: 1.18,
    hook: THEME_MEDIA["mario"].sound,
    wallpaperPosition: "center",
  },
];

/**
 * Problem statements. Dice face 2 maps to this list.
 */
export const PROBLEMS: Problem[] = [
  {
    face: 1,
    code: "PROBLEM STATEMENT 01",
    title: "Recipe Roulette",
    description:
      "You open the fridge and find two eggs, half an onion, and stale bread. Build a tool where users select whatever ingredients they have left, and it instantly serves up a quick, cookable survival recipe—no grocery run required.",
  },
  {
    face: 2,
    code: "PROBLEM STATEMENT 02",
    title: "Persona Probe",
    description:
      "Conventional personality tests rely on superficial self-reporting that fails to reveal how individuals actually behave when stakes are high. Build an interactive assessment engine that places users in timed, high-pressure task dilemmas, analyzing their response patterns—or using AI evaluation—to measure critical traits like humility, emotional maturity, and composure, generating a multi-dimensional character index and profile.",
  },
  {
    face: 3,
    code: "PROBLEM STATEMENT 03",
    title: "Password Forge",
    description:
      "Build a smart password generator and real-time strength analyzer. Generate customizable, ultra-secure passwords while testing credentials against entropy and security vulnerabilities.",
  },
  {
    face: 4,
    code: "PROBLEM STATEMENT 04",
    title: "Policy Decoder",
    description:
      "Policyholders make uninformed decisions because insurance documents are written in legal and technical language, obscuring exclusions and conditions that directly affect claim outcomes.",
  },
  {
    face: 5,
    code: "PROBLEM STATEMENT 05",
    title: "Site Sentinel",
    description:
      "Small enterprises operating e-commerce sites or company websites lack cybersecurity budgets and technical expertise to monitor for vulnerabilities, malware injections, or data breaches, and they need simple one-click security audit tools that automatically scan for common threats and provide plain-language alerts.",
  },
  {
    face: 6,
    code: "PROBLEM STATEMENT 06",
    title: "Phish Protocol",
    description:
      "Traditional security firewalls leave schools and startups defenseless against zero-hour phishing because attackers spin up disposable login portals and malicious QR codes faster than centralized blacklists can index them. Solve this critical 5-minute vulnerability window by building a real-time scanner that integrates rapid-feed threat intelligence APIs (such as PhishStats or PhishTank) alongside AI verification to detect and block malicious URLs, fake sign-up pages, and quishing traps at the exact moment of click.",
  },
];

export const THEME_BY_FACE: Record<number, Theme> = Object.fromEntries(
  THEMES.map((theme) => [theme.face, theme]),
) as Record<number, Theme>;

export const PROBLEM_BY_FACE: Record<number, Problem> = Object.fromEntries(
  PROBLEMS.map((problem) => [problem.face, problem]),
) as Record<number, Problem>;


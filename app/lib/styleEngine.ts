/**
 * styleEngine.ts
 * Maps (VibeTag[], ImageAnalysis) → StyleRecipe
 * A StyleRecipe is a complete, deterministic visual instruction set for the canvas compositor.
 */

import type { ImageAnalysis } from "./imageAnalyzer";

export type VibeTag =
  | "futuristic"
  | "premium"
  | "playful"
  | "dark"
  | "neon"
  | "cosmic"
  | "luxury"
  | "minimal"
  | "holographic"
  | "collectible";

export interface GradientStop {
  color: string;
  stop: number; // 0–1
}

export type BackgroundType =
  | { kind: "radial"; stops: GradientStop[]; cx?: number; cy?: number }
  | { kind: "linear"; stops: GradientStop[]; angle?: number }
  | { kind: "mesh"; base: string; accent: string; secondary: string }
  | { kind: "solid"; color: string };

export interface GlowConfig {
  color: string;
  radius: number; // px at 1000px canvas
  opacity: number; // 0–1
  x?: number; // % from center
  y?: number;
}

export interface BorderConfig {
  color: string;
  width: number;
  style: "solid" | "double" | "glow" | "dashed";
  glowColor?: string;
  glowBlur?: number;
}

export interface FrameConfig {
  cornerAccent?: string; // SVG path data for corner decorations
  cornerColor: string;
  cornerSize: number; // fraction of canvas size (0–0.25)
}

export interface OverlayEffect {
  kind: "vignette" | "scanlines" | "grain" | "holographic" | "dust" | "none";
  opacity: number;
}

export interface StyleRecipe {
  id: string;
  label: string;
  background: BackgroundType;
  glows: GlowConfig[];
  border?: BorderConfig;
  frame?: FrameConfig;
  overlays: OverlayEffect[];
  subjectScale: number; // 0.6–1.0 (how much of canvas the subject fills)
  subjectY: number; // % offset from center (positive = lower)
  circularCrop: boolean;
  outerRingColor?: string;
  outerRingWidth?: number;
  badgeRingColor?: string;
}

// ----- Palette helpers -----
const P = {
  // Dark blues (Sui-native)
  suiDeep: "#020b18",
  suiMid: "#050f20",
  suiAccent: "#4da2ff",
  suiBlue: "#1a56db",

  // Luxury
  gold: "#f59e0b",
  goldLight: "#fcd34d",
  goldDark: "#92400e",
  obsidian: "#0a0a0f",
  charcoal: "#111118",

  // Neon
  neonCyan: "#00fff0",
  neonMagenta: "#ff00e5",
  neonGreen: "#00ff88",
  neonPurple: "#a855f7",

  // Cosmic
  nebulaPurple: "#6d28d9",
  nebulaPink: "#ec4899",
  nebulaBlue: "#1d4ed8",
  starfield: "#05041a",

  // Minimal
  ashWhite: "#f8f7f4",
  ashGray: "#e5e4e0",
  ashDark: "#1c1c1e",

  // Holographic
  holoA: "#67e8f9",
  holoB: "#a78bfa",
  holoC: "#34d399",
  holoD: "#f472b6",
};

// Inject image dominant color into a recipe
function withImageColor(
  base: string,
  analysis: ImageAnalysis,
  blend = 0.3,
): string {
  if (!analysis.dominantColors[0]) return base;
  const dc = analysis.dominantColors[0];
  // Simple hex blend
  const parse = (h: string) => [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
  const bp = parse(base),
    dp = parse(dc);
  const r = Math.round(bp[0] * (1 - blend) + dp[0] * blend);
  const g = Math.round(bp[1] * (1 - blend) + dp[1] * blend);
  const b = Math.round(bp[2] * (1 - blend) + dp[2] * blend);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// ===== RECIPE FACTORIES =====

function recipeFuturistic(a: ImageAnalysis, seed: number): StyleRecipe {
  const accent = a.dominantColors[0] ?? P.suiAccent;
  return {
    id: "futuristic",
    label: "Futuristic",
    background: {
      kind: "mesh",
      base: P.suiDeep,
      accent: P.suiAccent,
      secondary: withImageColor(P.suiBlue, a, 0.4),
    },
    glows: [
      {
        color: P.suiAccent,
        radius: 280 + seed * 20,
        opacity: 0.35,
        x: 0,
        y: -10,
      },
      { color: accent, radius: 160, opacity: 0.2, x: 20, y: 30 },
    ],
    border: {
      color: P.suiAccent,
      width: 4,
      style: "glow",
      glowColor: P.suiAccent,
      glowBlur: 24,
    },
    frame: { cornerColor: P.suiAccent, cornerSize: 0.12 },
    overlays: [
      { kind: "scanlines", opacity: 0.04 },
      { kind: "vignette", opacity: 0.3 },
    ],
    subjectScale: 0.82,
    subjectY: 2,
    circularCrop: true,
    outerRingColor: P.suiAccent,
    outerRingWidth: 3,
  };
}

function recipePremium(a: ImageAnalysis, seed: number): StyleRecipe {
  const dominant = a.dominantColors[0] ?? "#1a1a2e";
  return {
    id: "premium",
    label: "Premium",
    background: {
      kind: "radial",
      stops: [
        { color: withImageColor("#1a1a2e", a, 0.25), stop: 0 },
        { color: "#0a0a14", stop: 0.6 },
        { color: "#050508", stop: 1 },
      ],
      cx: 0.5,
      cy: 0.42,
    },
    glows: [
      { color: dominant, radius: 220, opacity: 0.25, x: 0, y: -5 },
      { color: "#ffffff", radius: 100, opacity: 0.04, x: 0, y: -20 },
    ],
    border: { color: "rgba(255,255,255,0.18)", width: 1.5, style: "solid" },
    overlays: [
      { kind: "vignette", opacity: 0.55 },
      { kind: "grain", opacity: 0.025 },
    ],
    subjectScale: 0.78,
    subjectY: 0,
    circularCrop: true,
    outerRingColor: "rgba(255,255,255,0.12)",
    outerRingWidth: 1,
  };
}

function recipePlayful(a: ImageAnalysis, seed: number): StyleRecipe {
  const colors = a.dominantColors.slice(0, 3);
  const bgA = colors[0] ?? "#ff6b6b";
  const bgB = colors[1] ?? "#ffd93d";
  const angle = 120 + seed * 40;
  return {
    id: "playful",
    label: "Playful",
    background: {
      kind: "linear",
      stops: [
        { color: withImageColor(bgA, a, 0.5), stop: 0 },
        { color: withImageColor(bgB, a, 0.5), stop: 1 },
      ],
      angle,
    },
    glows: [{ color: "#ffffff", radius: 180, opacity: 0.12 }],
    border: { color: "#ffffff", width: 6, style: "solid" },
    overlays: [{ kind: "grain", opacity: 0.02 }],
    subjectScale: 0.85,
    subjectY: 2,
    circularCrop: true,
    outerRingColor: "#ffffff",
    outerRingWidth: 4,
  };
}

function recipeDark(a: ImageAnalysis, seed: number): StyleRecipe {
  const accent = a.dominantColors[0] ?? "#334155";
  return {
    id: "dark",
    label: "Dark",
    background: {
      kind: "radial",
      stops: [
        { color: withImageColor("#141414", a, 0.15), stop: 0 },
        { color: "#0a0a0a", stop: 0.5 },
        { color: "#050505", stop: 1 },
      ],
    },
    glows: [{ color: accent, radius: 160, opacity: 0.18, x: 0, y: 10 }],
    border: { color: "rgba(255,255,255,0.06)", width: 1, style: "solid" },
    overlays: [
      { kind: "vignette", opacity: 0.7 },
      { kind: "grain", opacity: 0.04 },
    ],
    subjectScale: 0.8,
    subjectY: 0,
    circularCrop: true,
    outerRingColor: "rgba(255,255,255,0.05)",
    outerRingWidth: 1,
  };
}

function recipeNeon(a: ImageAnalysis, seed: number): StyleRecipe {
  const neons = [P.neonCyan, P.neonMagenta, P.neonGreen, P.neonPurple];
  const c1 = neons[seed % 4];
  const c2 = neons[(seed + 1) % 4];
  return {
    id: "neon",
    label: "Neon",
    background: {
      kind: "mesh",
      base: "#050510",
      accent: c1,
      secondary: c2,
    },
    glows: [
      { color: c1, radius: 300, opacity: 0.4, x: -15, y: -10 },
      { color: c2, radius: 220, opacity: 0.35, x: 15, y: 10 },
    ],
    border: { color: c1, width: 3, style: "glow", glowColor: c1, glowBlur: 30 },
    frame: { cornerColor: c2, cornerSize: 0.1 },
    overlays: [
      { kind: "scanlines", opacity: 0.06 },
      { kind: "vignette", opacity: 0.25 },
    ],
    subjectScale: 0.8,
    subjectY: 0,
    circularCrop: true,
    outerRingColor: c1,
    outerRingWidth: 2,
  };
}

function recipeCosmic(a: ImageAnalysis, seed: number): StyleRecipe {
  return {
    id: "cosmic",
    label: "Cosmic",
    background: {
      kind: "radial",
      stops: [
        { color: "#1e0533", stop: 0 },
        { color: "#0d0a2e", stop: 0.4 },
        { color: P.starfield, stop: 1 },
      ],
      cx: 0.5,
      cy: 0.35,
    },
    glows: [
      { color: P.nebulaPurple, radius: 280, opacity: 0.45, x: 0, y: -15 },
      { color: P.nebulaPink, radius: 180, opacity: 0.3, x: 20, y: 20 },
    ],
    border: {
      color: P.nebulaPurple,
      width: 2,
      style: "glow",
      glowColor: P.nebulaPink,
      glowBlur: 20,
    },
    overlays: [
      { kind: "dust", opacity: 0.5 },
      { kind: "vignette", opacity: 0.4 },
    ],
    subjectScale: 0.78,
    subjectY: 2,
    circularCrop: true,
    outerRingColor: P.nebulaPurple,
    outerRingWidth: 2,
  };
}

function recipeLuxury(a: ImageAnalysis, seed: number): StyleRecipe {
  return {
    id: "luxury",
    label: "Luxury",
    background: {
      kind: "radial",
      stops: [
        { color: "#1a1208", stop: 0 },
        { color: "#0e0c06", stop: 0.5 },
        { color: "#080704", stop: 1 },
      ],
    },
    glows: [
      { color: P.gold, radius: 200, opacity: 0.2, x: 0, y: -10 },
      { color: P.goldLight, radius: 100, opacity: 0.1, x: 0, y: -20 },
    ],
    border: {
      color: P.gold,
      width: 3,
      style: "double",
      glowColor: P.gold,
      glowBlur: 12,
    },
    frame: { cornerColor: P.goldLight, cornerSize: 0.11 },
    overlays: [
      { kind: "vignette", opacity: 0.6 },
      { kind: "grain", opacity: 0.03 },
    ],
    subjectScale: 0.76,
    subjectY: 0,
    circularCrop: true,
    outerRingColor: P.gold,
    outerRingWidth: 2,
    badgeRingColor: P.goldDark,
  };
}

function recipeMinimal(a: ImageAnalysis, seed: number): StyleRecipe {
  const useDark = a.brightness > 0.55;
  const bg = useDark ? P.ashDark : P.ashWhite;
  const ring = useDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";
  const accent = a.dominantColors[0] ?? (useDark ? "#ffffff" : "#000000");
  return {
    id: "minimal",
    label: "Minimal",
    background: { kind: "solid", color: bg },
    glows: [{ color: accent, radius: 120, opacity: 0.06 }],
    border: { color: ring, width: 1, style: "solid" },
    overlays: [{ kind: "vignette", opacity: 0.1 }],
    subjectScale: 0.82,
    subjectY: 0,
    circularCrop: true,
    outerRingColor: ring,
    outerRingWidth: 1,
  };
}

function recipeHolographic(a: ImageAnalysis, seed: number): StyleRecipe {
  const holoStops: GradientStop[] = [
    { color: P.holoA, stop: 0 },
    { color: P.holoB, stop: 0.33 },
    { color: P.holoC, stop: 0.66 },
    { color: P.holoD, stop: 1 },
  ];
  return {
    id: "holographic",
    label: "Holographic",
    background: { kind: "linear", stops: holoStops, angle: 135 + seed * 30 },
    glows: [
      { color: P.holoA, radius: 250, opacity: 0.3, x: -10 },
      { color: P.holoB, radius: 200, opacity: 0.25, x: 10 },
    ],
    border: { color: "rgba(255,255,255,0.6)", width: 2, style: "solid" },
    overlays: [
      { kind: "holographic", opacity: 0.18 },
      { kind: "grain", opacity: 0.015 },
    ],
    subjectScale: 0.8,
    subjectY: 0,
    circularCrop: true,
    outerRingColor: "rgba(255,255,255,0.5)",
    outerRingWidth: 2,
  };
}

function recipeCollectible(a: ImageAnalysis, seed: number): StyleRecipe {
  const accent = a.dominantColors[0] ?? P.suiAccent;
  const accent2 = a.dominantColors[1] ?? P.gold;
  return {
    id: "collectible",
    label: "Collectible",
    background: {
      kind: "radial",
      stops: [
        { color: withImageColor("#141a2e", a, 0.3), stop: 0 },
        { color: "#0a0f1e", stop: 0.55 },
        { color: "#05080f", stop: 1 },
      ],
    },
    glows: [
      { color: accent, radius: 240, opacity: 0.3, x: 0, y: -5 },
      { color: accent2, radius: 140, opacity: 0.15, x: 10, y: 15 },
    ],
    border: {
      color: accent,
      width: 3,
      style: "glow",
      glowColor: accent,
      glowBlur: 18,
    },
    frame: { cornerColor: accent2, cornerSize: 0.09 },
    overlays: [
      { kind: "vignette", opacity: 0.35 },
      { kind: "grain", opacity: 0.02 },
    ],
    subjectScale: 0.78,
    subjectY: -2,
    circularCrop: true,
    outerRingColor: accent,
    outerRingWidth: 3,
    badgeRingColor: accent2,
  };
}

const RECIPE_FACTORIES: Record<
  VibeTag,
  (a: ImageAnalysis, seed: number) => StyleRecipe
> = {
  futuristic: recipeFuturistic,
  premium: recipePremium,
  playful: recipePlayful,
  dark: recipeDark,
  neon: recipeNeon,
  cosmic: recipeCosmic,
  luxury: recipeLuxury,
  minimal: recipeMinimal,
  holographic: recipeHolographic,
  collectible: recipeCollectible,
};

// Merge two recipes (primary wins, secondary fills gaps)
function mergeRecipes(
  primary: StyleRecipe,
  secondary: StyleRecipe,
): StyleRecipe {
  return {
    ...primary,
    glows: [...primary.glows, ...secondary.glows.slice(0, 1)],
    overlays: [
      ...primary.overlays.slice(0, 2),
      ...secondary.overlays.slice(0, 1),
    ].slice(0, 3),
    outerRingColor: primary.outerRingColor ?? secondary.outerRingColor,
    frame: primary.frame ?? secondary.frame,
    border: primary.border ?? secondary.border,
  };
}

// Auto-suggest tags based on image analysis
export function suggestTags(analysis: ImageAnalysis): VibeTag[] {
  const tags: VibeTag[] = [];
  if (analysis.brightness < 0.3) tags.push("dark", "neon");
  if (analysis.brightness > 0.7) tags.push("minimal", "premium");
  if (analysis.saturation > 0.5) tags.push("playful", "collectible");
  if (analysis.saturation < 0.15) tags.push("minimal", "luxury");
  if (analysis.warmth > 0.6) tags.push("luxury", "collectible");
  if (analysis.warmth < 0.3) tags.push("futuristic", "cosmic");
  if (analysis.isMonochromatic) tags.push("premium", "luxury");
  if (analysis.hasHighContrast) tags.push("neon", "holographic");
  // Deduplicate and limit
  return [...new Set(tags)].slice(0, 4);
}

// Main resolver
export function resolveRecipe(
  tags: VibeTag[],
  analysis: ImageAnalysis,
  seed = 0,
): StyleRecipe {
  if (tags.length === 0) {
    const suggested = suggestTags(analysis);
    const fallback = suggested[0] ?? "premium";
    return RECIPE_FACTORIES[fallback](analysis, seed);
  }
  const primary = RECIPE_FACTORIES[tags[0]](analysis, seed);
  if (tags.length === 1) return primary;
  const secondary = RECIPE_FACTORIES[tags[1]](analysis, seed);
  return mergeRecipes(primary, secondary);
}

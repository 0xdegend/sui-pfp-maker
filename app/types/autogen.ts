import type { VibeTag } from "../lib/styleEngine";
import type { ImageAnalysis } from "../lib/imageAnalyzer";
import type { StyleRecipe } from "../lib/styleEngine";

export type { VibeTag };

export interface AutoGenState {
  step: 1 | 2 | 3;
  uploadedImage: string | null;
  analysis: ImageAnalysis | null;
  selectedTags: VibeTag[];
  suggestedTags: VibeTag[];
  recipe: StyleRecipe | null;
  resultDataUrl: string | null;
  isGenerating: boolean;
  generationSeed: number;
  showBeforeAfter: boolean;
}

export const ALL_VIBE_TAGS: VibeTag[] = [
  "futuristic",
  "premium",
  "playful",
  "dark",
  "neon",
  "cosmic",
  "luxury",
  "minimal",
  "holographic",
  "collectible",
];

export const TAG_ICONS: Record<VibeTag, string> = {
  futuristic: "◈",
  premium: "◆",
  playful: "✦",
  dark: "◉",
  neon: "⬡",
  cosmic: "✧",
  luxury: "◇",
  minimal: "○",
  holographic: "⟡",
  collectible: "⬟",
};

export const TAG_DESCRIPTIONS: Record<VibeTag, string> = {
  futuristic: "Sci-fi grid, blue glow",
  premium: "Dark, refined, editorial",
  playful: "Vivid, gradient pop",
  dark: "Moody, low-light drama",
  neon: "Electric, vivid light",
  cosmic: "Nebula, deep space",
  luxury: "Gold, obsidian, silk",
  minimal: "Clean, quiet, bold",
  holographic: "Iridescent shimmer",
  collectible: "NFT-card energy",
};

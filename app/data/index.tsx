import { MemeToken, OverlayOption, BorderOption } from "../types";
export const SAMPLE_PFPS = [
  { emoji: "/memes/pans-meme.png", label: "$PANDA" },
  { emoji: "/memes/mbp-logo.jpg", label: "$MBP" },
  { emoji: "/memes/poors-meme.jpg", label: "$POORS" },
  { emoji: "/memes/eagle-sui-meme.jpg", label: "$EAGLE" },
  { emoji: "/memes/kyln-meme.png", label: "$KLYN" },
];

export const MEME_TOKENS: MemeToken[] = [
  {
    id: "panda",
    label: "$PANDA",
    src: "/memes/pans-meme.png",
    accent: "#4da2ff",
    glow: "rgba(77,162,255,0.6)",
    description: "The gentle giant of Sui",
  },
  {
    id: "mbp",
    label: "$MBP",
    src: "/memes/mbp-logo.jpg",
    accent: "#6fbbff",
    glow: "rgba(111,187,255,0.6)",
    description: "Most Bearish Possible",
  },
  {
    id: "poors",
    label: "$POORS",
    src: "/memes/poors-meme.jpg",
    accent: "#a8d4ff",
    glow: "rgba(168,212,255,0.5)",
    description: "We are all poors together",
  },
  {
    id: "eagle",
    label: "$EAGLE",
    src: "/memes/eagle-sui-meme.jpg",
    accent: "#4da2ff",
    glow: "rgba(77,162,255,0.6)",
    description: "Freedom on the Sui chain",
  },
  {
    id: "klyn",
    label: "$KLYN",
    src: "/memes/kyln-meme.png",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.6)",
    description: "The dragon of Sui",
  },
];

export const OVERLAY_OPTIONS: OverlayOption[] = [
  { id: "none", label: "None", className: "" },
  {
    id: "vignette",
    label: "Vignette",
    className:
      "bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.8)_100%)]",
  },
  {
    id: "scanlines",
    label: "Scanlines",
    className:
      "bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.08)_0px,rgba(0,0,0,0.08)_1px,transparent_1px,transparent_3px)]",
  },
  {
    id: "holographic",
    label: "Holographic",
    className:
      "bg-[linear-gradient(135deg,rgba(77,162,255,0.15)_0%,rgba(111,187,255,0.08)_25%,rgba(168,212,255,0.15)_50%,rgba(77,162,255,0.08)_75%,rgba(20,71,230,0.15)_100%)]",
  },
  {
    id: "glow-center",
    label: "Glow",
    className:
      "bg-[radial-gradient(circle,rgba(77,162,255,0.3)_0%,transparent_70%)]",
  },
];

export const BORDER_OPTIONS: BorderOption[] = [
  { id: "none", label: "None", style: {} },
  {
    id: "sui-blue",
    label: "Sui Blue",
    style: {
      border: "3px solid #4da2ff",
      boxShadow:
        "0 0 20px rgba(77,162,255,0.6), inset 0 0 20px rgba(77,162,255,0.1)",
    },
  },
  {
    id: "gradient",
    label: "Gradient",
    style: { boxShadow: "0 0 0 3px #4da2ff, 0 0 30px rgba(77,162,255,0.4)" },
  },
  {
    id: "gold",
    label: "Gold",
    style: {
      border: "3px solid #f59e0b",
      boxShadow: "0 0 20px rgba(245,158,11,0.5)",
    },
  },
  {
    id: "neon",
    label: "Neon",
    style: {
      border: "2px solid #4da2ff",
      boxShadow:
        "0 0 8px #4da2ff, 0 0 30px rgba(77,162,255,0.5), 0 0 60px rgba(77,162,255,0.2)",
    },
  },
];

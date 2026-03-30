import {
  MemeToken,
  OverlayOption,
  BorderOption,
  MemeFrame,
  StudioBackground,
} from "../types";
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
    label: "$PANS",
    src: "/memes/pans-meme.png",
    accent: "#4da2ff",
    glow: "rgba(77,162,255,0.6)",
    description: "PandaSui Coin",
  },
  {
    id: "mbp",
    label: "$MBP",
    src: "/memes/mbp-logo.jpg",
    accent: "#6fbbff",
    glow: "rgba(111,187,255,0.6)",
    description: "ManBearPig",
  },
  {
    id: "poors",
    label: "$POORS",
    src: "/memes/poors-meme.jpg",
    accent: "#a8d4ff",
    glow: "rgba(168,212,255,0.5)",
    description: "POOR SUI",
  },
  {
    id: "eagle",
    label: "$EAGLE",
    src: "/memes/eagle-sui-meme.jpg",
    accent: "#4da2ff",
    glow: "rgba(77,162,255,0.6)",
    description: "Eagle Sui",
  },
  {
    id: "klyn",
    label: "$KLYN",
    src: "/memes/kyln-meme.png",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.6)",
    description: "Kylin",
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

export const MEME_FRAMES: MemeFrame[] = [
  {
    id: "none",
    label: "None",
    tokenId: null,
    description: "No frame",
    svgPattern: "",
  },
  {
    id: "sui-circuit",
    label: "Sui Circuit",
    tokenId: null,
    description: "Electric Sui network lines",
    svgPattern: `
      <rect x="20" y="20" width="960" height="960" rx="40" ry="40" fill="none" stroke="#4da2ff" stroke-width="12" opacity="0.9"/>
      <rect x="40" y="40" width="920" height="920" rx="30" ry="30" fill="none" stroke="#4da2ff" stroke-width="3" opacity="0.4"/>
      <line x1="20" y1="200" x2="80" y2="200" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="80" y1="200" x2="80" y2="140" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="80" y1="140" x2="200" y2="140" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <circle cx="200" cy="140" r="10" fill="#4da2ff" opacity="0.9"/>
      <line x1="20" y1="800" x2="80" y2="800" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="80" y1="800" x2="80" y2="860" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="80" y1="860" x2="200" y2="860" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <circle cx="200" cy="860" r="10" fill="#4da2ff" opacity="0.9"/>
      <line x1="980" y1="200" x2="920" y2="200" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="920" y1="200" x2="920" y2="140" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="920" y1="140" x2="800" y2="140" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <circle cx="800" cy="140" r="10" fill="#4da2ff" opacity="0.9"/>
      <line x1="980" y1="800" x2="920" y2="800" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="920" y1="800" x2="920" y2="860" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <line x1="920" y1="860" x2="800" y2="860" stroke="#4da2ff" stroke-width="6" opacity="0.8"/>
      <circle cx="800" cy="860" r="10" fill="#4da2ff" opacity="0.9"/>
      <text x="500" y="68" font-family="monospace" font-size="22" fill="#4da2ff" text-anchor="middle" opacity="0.7" letter-spacing="6">SUI NETWORK</text>
      <text x="500" y="960" font-family="monospace" font-size="18" fill="#4da2ff" text-anchor="middle" opacity="0.6" letter-spacing="4">ON-CHAIN</text>
    `,
  },
  {
    id: "panda-bamboo",
    label: "Bamboo",
    tokenId: "panda",
    description: "$PANDA bamboo border",
    svgPattern: `
      <rect x="15" y="15" width="970" height="970" rx="20" ry="20" fill="none" stroke="#22c55e" stroke-width="16" opacity="0.85"/>
      <rect x="35" y="35" width="930" height="930" rx="10" ry="10" fill="none" stroke="#16a34a" stroke-width="4" opacity="0.4"/>
      <rect x="15" y="80" width="40" height="120" rx="20" fill="#15803d" opacity="0.85"/>
      <line x1="35" y1="80" x2="35" y2="200" stroke="#22c55e" stroke-width="2" opacity="0.5"/>
      <ellipse cx="35" cy="80" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="35" cy="200" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <rect x="15" y="230" width="40" height="110" rx="20" fill="#15803d" opacity="0.8"/>
      <ellipse cx="35" cy="230" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="35" cy="340" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <rect x="15" y="600" width="40" height="120" rx="20" fill="#15803d" opacity="0.85"/>
      <ellipse cx="35" cy="600" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="35" cy="720" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <rect x="15" y="750" width="40" height="110" rx="20" fill="#15803d" opacity="0.8"/>
      <ellipse cx="35" cy="750" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="35" cy="860" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <rect x="945" y="80" width="40" height="120" rx="20" fill="#15803d" opacity="0.85"/>
      <ellipse cx="965" cy="80" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="965" cy="200" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <rect x="945" y="230" width="40" height="110" rx="20" fill="#15803d" opacity="0.8"/>
      <ellipse cx="965" cy="230" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="965" cy="340" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <rect x="945" y="600" width="40" height="120" rx="20" fill="#15803d" opacity="0.85"/>
      <ellipse cx="965" cy="600" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="965" cy="720" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <rect x="945" y="750" width="40" height="110" rx="20" fill="#15803d" opacity="0.8"/>
      <ellipse cx="965" cy="750" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <ellipse cx="965" cy="860" rx="20" ry="8" fill="#22c55e" opacity="0.9"/>
      <text x="500" y="62" font-family="serif" font-size="28" fill="#22c55e" text-anchor="middle" opacity="0.9" font-weight="bold">🐼 $PANDA</text>
      <text x="500" y="966" font-family="serif" font-size="22" fill="#22c55e" text-anchor="middle" opacity="0.8">SUI ECOSYSTEM</text>
    `,
  },
  {
    id: "eagle-patriot",
    label: "Patriot",
    tokenId: "eagle",
    description: "$EAGLE stars & stripes",
    svgPattern: `
      <rect x="15" y="15" width="970" height="970" rx="20" ry="20" fill="none" stroke="#ef4444" stroke-width="18" opacity="0.9"/>
      <rect x="33" y="33" width="934" height="934" rx="15" ry="15" fill="none" stroke="#3b82f6" stroke-width="8" opacity="0.7"/>
      <rect x="45" y="45" width="910" height="910" rx="10" ry="10" fill="none" stroke="#ef4444" stroke-width="4" opacity="0.4"/>
      <text x="60" y="68" font-size="28" opacity="0.9">⭐</text>
      <text x="920" y="68" font-size="28" opacity="0.9">⭐</text>
      <text x="60" y="966" font-size="28" opacity="0.9">⭐</text>
      <text x="920" y="966" font-size="28" opacity="0.9">⭐</text>
      <text x="490" y="68" font-size="20" opacity="0.8">⭐</text>
      <text x="490" y="966" font-size="20" opacity="0.8">⭐</text>
      <line x1="15" y1="100" x2="985" y2="100" stroke="#ef4444" stroke-width="6" opacity="0.35"/>
      <line x1="15" y1="900" x2="985" y2="900" stroke="#ef4444" stroke-width="6" opacity="0.35"/>
      <text x="500" y="80" font-family="Impact, sans-serif" font-size="26" fill="white" text-anchor="middle" opacity="0.95" letter-spacing="4">$EAGLE</text>
      <text x="500" y="972" font-family="Impact, sans-serif" font-size="22" fill="white" text-anchor="middle" opacity="0.9" letter-spacing="3">FREEDOM ON SUI</text>
    `,
  },
  {
    id: "klyn-dragon",
    label: "Dragon",
    tokenId: "klyn",
    description: "$KLYN dragon scales",
    svgPattern: `
      <rect x="15" y="15" width="970" height="970" rx="20" ry="20" fill="none" stroke="#38bdf8" stroke-width="14" opacity="0.9"/>
      <rect x="32" y="32" width="936" height="936" rx="15" ry="15" fill="none" stroke="#0ea5e9" stroke-width="5" opacity="0.5"/>
      <rect x="46" y="46" width="908" height="908" rx="10" ry="10" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.3"/>
      <polygon points="15,15 80,15 15,80" fill="#38bdf8" opacity="0.6"/>
      <polygon points="985,15 920,15 985,80" fill="#38bdf8" opacity="0.6"/>
      <polygon points="15,985 80,985 15,920" fill="#38bdf8" opacity="0.6"/>
      <polygon points="985,985 920,985 985,920" fill="#38bdf8" opacity="0.6"/>
      <circle cx="500" cy="28" r="12" fill="#38bdf8" opacity="0.8"/>
      <circle cx="500" cy="972" r="12" fill="#38bdf8" opacity="0.8"/>
      <circle cx="28" cy="500" r="12" fill="#38bdf8" opacity="0.8"/>
      <circle cx="972" cy="500" r="12" fill="#38bdf8" opacity="0.8"/>
      <path d="M 200 15 Q 280 50 360 15" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.5"/>
      <path d="M 400 15 Q 500 55 600 15" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.5"/>
      <path d="M 640 15 Q 720 50 800 15" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.5"/>
      <path d="M 200 985 Q 280 950 360 985" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.5"/>
      <path d="M 400 985 Q 500 945 600 985" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.5"/>
      <path d="M 640 985 Q 720 950 800 985" fill="none" stroke="#38bdf8" stroke-width="4" opacity="0.5"/>
      <text x="500" y="70" font-family="monospace" font-size="24" fill="#38bdf8" text-anchor="middle" opacity="0.9" font-weight="bold" letter-spacing="5">🐉 $KLYN</text>
      <text x="500" y="964" font-family="monospace" font-size="20" fill="#38bdf8" text-anchor="middle" opacity="0.85" letter-spacing="3">DRAGON OF SUI</text>
    `,
  },
  {
    id: "poors-gritty",
    label: "Gritty",
    tokenId: "poors",
    description: "$POORS rough & raw",
    svgPattern: `
      <rect x="15" y="15" width="970" height="970" fill="none" stroke="#94a3b8" stroke-width="20" opacity="0.7" stroke-dasharray="40 8"/>
      <rect x="40" y="40" width="920" height="920" fill="none" stroke="#64748b" stroke-width="4" opacity="0.35"/>
      <line x1="15" y1="15" x2="80" y2="15" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <line x1="15" y1="15" x2="15" y2="80" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <line x1="985" y1="15" x2="920" y2="15" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <line x1="985" y1="15" x2="985" y2="80" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <line x1="15" y1="985" x2="80" y2="985" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <line x1="15" y1="985" x2="15" y2="920" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <line x1="985" y1="985" x2="920" y2="985" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <line x1="985" y1="985" x2="985" y2="920" stroke="#94a3b8" stroke-width="20" opacity="0.9"/>
      <text x="500" y="66" font-family="Impact, monospace" font-size="30" fill="#94a3b8" text-anchor="middle" opacity="0.85" letter-spacing="6">$POORS</text>
      <text x="500" y="968" font-family="Impact, monospace" font-size="22" fill="#94a3b8" text-anchor="middle" opacity="0.8" letter-spacing="4">WE ARE ALL POORS</text>
    `,
  },
  {
    id: "mbp-bear",
    label: "Bear Market",
    tokenId: "mbp",
    description: "$MBP most bearish",
    svgPattern: `
      <rect x="15" y="15" width="970" height="970" rx="20" ry="20" fill="none" stroke="#6fbbff" stroke-width="14" opacity="0.85"/>
      <rect x="32" y="32" width="936" height="936" rx="14" ry="14" fill="none" stroke="#4da2ff" stroke-width="4" opacity="0.4"/>
      <path d="M 15 15 Q 500 -20 985 15" fill="none" stroke="#6fbbff" stroke-width="6" opacity="0.4"/>
      <path d="M 15 985 Q 500 1020 985 985" fill="none" stroke="#6fbbff" stroke-width="6" opacity="0.4"/>
      <line x1="15" y1="200" x2="985" y2="200" stroke="#4da2ff" stroke-width="2" opacity="0.15"/>
      <line x1="15" y1="400" x2="985" y2="400" stroke="#4da2ff" stroke-width="2" opacity="0.15"/>
      <line x1="15" y1="600" x2="985" y2="600" stroke="#4da2ff" stroke-width="2" opacity="0.15"/>
      <line x1="15" y1="800" x2="985" y2="800" stroke="#4da2ff" stroke-width="2" opacity="0.15"/>
      <text x="500" y="66" font-family="monospace" font-size="26" fill="#6fbbff" text-anchor="middle" opacity="0.9" font-weight="bold" letter-spacing="4">📉 $MBP</text>
      <text x="500" y="968" font-family="monospace" font-size="20" fill="#6fbbff" text-anchor="middle" opacity="0.85" letter-spacing="3">MOST BEARISH POSSIBLE</text>
    `,
  },
];

export const STUDIO_BACKGROUNDS: StudioBackground[] = [
  {
    id: "original",
    label: "Original",
    type: "original",
    value: "original",
    preview: "bg-[rgba(77,162,255,0.1)] border-dashed",
  },
  {
    id: "sui-dark",
    label: "Sui Dark",
    type: "gradient",
    value: "linear-gradient(135deg, #020b18 0%, #0a1628 50%, #020b18 100%)",
    preview: "bg-[#020b18]",
  },
  {
    id: "sui-blue",
    label: "Sui Blue",
    type: "gradient",
    value: "linear-gradient(135deg, #001233 0%, #0047ab 50%, #4da2ff 100%)",
    preview: "bg-[linear-gradient(135deg,#001233,#4da2ff)]",
  },
  {
    id: "sui-glow",
    label: "Sui Glow",
    type: "gradient",
    value: "radial-gradient(circle at 50% 40%, #1447e6 0%, #020b18 65%)",
    preview: "bg-[radial-gradient(circle,#1447e6,#020b18)]",
  },
  {
    id: "ocean",
    label: "Ocean",
    type: "gradient",
    value: "linear-gradient(180deg, #0c4a6e 0%, #0ea5e9 50%, #7dd3fc 100%)",
    preview: "bg-[linear-gradient(180deg,#0c4a6e,#7dd3fc)]",
  },
  {
    id: "midnight",
    label: "Midnight",
    type: "gradient",
    value: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    preview: "bg-[linear-gradient(135deg,#0f0c29,#302b63)]",
  },
  {
    id: "forest",
    label: "Forest",
    type: "gradient",
    value: "linear-gradient(135deg, #0d2818 0%, #1a5c2e 50%, #4ade80 100%)",
    preview: "bg-[linear-gradient(135deg,#0d2818,#4ade80)]",
  },
  {
    id: "fire",
    label: "Fire",
    type: "gradient",
    value:
      "linear-gradient(135deg, #1a0000 0%, #7c0000 40%, #ef4444 80%, #f97316 100%)",
    preview: "bg-[linear-gradient(135deg,#1a0000,#ef4444,#f97316)]",
  },
  {
    id: "gold",
    label: "Gold",
    type: "gradient",
    value:
      "linear-gradient(135deg, #1a1200 0%, #78350f 40%, #f59e0b 80%, #fde68a 100%)",
    preview: "bg-[linear-gradient(135deg,#1a1200,#f59e0b,#fde68a)]",
  },
  {
    id: "pure-black",
    label: "Black",
    type: "solid",
    value: "#000000",
    preview: "bg-black",
  },
  {
    id: "pure-white",
    label: "White",
    type: "solid",
    value: "#ffffff",
    preview: "bg-white",
  },
];

export const PRESET_STICKERS = [
  "WAGMI",
  "DEGEN",
  "NGMI",
  "SER",
  "HODL",
  "TO THE MOON",
  "GM",
  "GN",
  "BASED",
  "LFG",
  "$PANDA",
  "$MBP",
  "$POORS",
  "$EAGLE",
  "$KLYN",
  "SUI GANG",
  "ON-CHAIN",
  "NOT FINANCIAL ADVICE",
];

export const GALLERY_ITEMS = [
  {
    img: "/gallery-template/panda-001.png",
    coin: "$BLUB",
    username: "0xwave",
    layout: "tall", // spans 2 rows
  },
  {
    img: "/gallery-template/panda-002.png",
    coin: "$DEEP",
    username: "deepdiver",
    layout: "normal",
  },
  {
    img: "/gallery-template/panda-003.png",
    coin: "$SUIB",
    username: "whalewatcher",
    layout: "wide", // spans 2 cols
  },
  {
    img: "/gallery-template/panda-004.png",
    coin: "$LOFI",
    username: "lofivibes",
    layout: "normal",
  },
  {
    img: "/gallery-template/panda-005.png",
    coin: "$NAVX",
    username: "navigator",
    layout: "normal",
  },
  {
    img: "/gallery-template/panda-001.png",
    coin: "$TURBOS",
    username: "turbomode",
    layout: "tall",
  },
  {
    img: "/gallery-template/panda-002.png",
    coin: "$BUCK",
    username: "buckshot",
    layout: "normal",
  },
  {
    img: "/gallery-template/panda-003.png",
    coin: "$SDOG",
    username: "suidog",
    layout: "normal",
  },
];

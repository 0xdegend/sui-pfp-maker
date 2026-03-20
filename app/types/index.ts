export interface MemeToken {
  id: string;
  label: string;
  src: string;
  accent: string;
  glow: string;
  description: string;
}

export interface PlacedBadge {
  id: string;
  token: MemeToken;
  x: number;
  y: number;
  size: number;
}

export interface OverlayOption {
  id: string;
  label: string;
  className: string;
}

export interface BorderOption {
  id: string;
  label: string;
  style: React.CSSProperties;
}

export interface TextSticker {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: "normal" | "bold";
  rotation: number;
}

export interface MemeFrame {
  id: string;
  label: string;
  tokenId: string | null;
  description: string;
  svgPattern: string;
}

export interface StudioBackground {
  id: string;
  label: string;
  type: "original" | "gradient" | "solid" | "pattern";
  value: string;
  preview: string;
}

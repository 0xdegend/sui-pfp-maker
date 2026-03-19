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

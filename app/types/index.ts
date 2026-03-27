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

export interface LeftPanelProps {
  activeStep: 1 | 2 | 3;
  uploadedImage: string | null;
  isDraggingFile: boolean;
  placedBadges: PlacedBadge[];
  selectedBadgeId: string | null;
  selectedBadge: PlacedBadge | null;
  selectedOverlay: string;
  selectedBorder: string;
  defaultBadgeSize: number;
  selectedFrame: string;
  selectedBackground: string;
  stickers: TextSticker[];
  selectedStickerId: string | null;
  selectedSticker: TextSticker | null;
  onFile: (file: File) => void;
  onDragOver: () => void;
  onDragLeave: () => void;
  onAddBadge: (token: MemeToken) => void;
  onRemoveBadge: (id: string) => void;
  onSelectBadge: (id: string) => void;
  onResizeBadge: (id: string, size: number) => void;
  onSetOverlay: (id: string) => void;
  onSetBorder: (id: string) => void;
  onSetDefaultSize: (size: number) => void;
  onSetFrame: (id: string) => void;
  onSetBackground: (id: string) => void;
  onAddSticker: (text: string) => void;
  onRemoveSticker: (id: string) => void;
  onSelectSticker: (id: string) => void;
  onUpdateSticker: (id: string, updates: Partial<TextSticker>) => void;
}

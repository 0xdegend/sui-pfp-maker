"use client";

import Image from "next/image";
import { useRef } from "react";
import { MemeToken, PlacedBadge } from "../../types";
import { MEME_TOKENS, OVERLAY_OPTIONS, BORDER_OPTIONS } from "../../data";

interface LeftPanelProps {
  activeStep: 1 | 2 | 3;
  uploadedImage: string | null;
  isDraggingFile: boolean;
  placedBadges: PlacedBadge[];
  selectedBadgeId: string | null;
  selectedBadge: PlacedBadge | null;
  selectedOverlay: string;
  selectedBorder: string;
  defaultBadgeSize: number;
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
}

export default function LeftPanel({
  activeStep,
  uploadedImage,
  isDraggingFile,
  placedBadges,
  selectedBadgeId,
  selectedBadge,
  selectedOverlay,
  selectedBorder,
  defaultBadgeSize,
  onFile,
  onDragOver,
  onDragLeave,
  onAddBadge,
  onRemoveBadge,
  onSelectBadge,
  onResizeBadge,
  onSetOverlay,
  onSetBorder,
  onSetDefaultSize,
}: LeftPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isTokenPlaced = (tokenId: string) =>
    placedBadges.some((b) => b.token.id === tokenId);

  const stepDotClass = (n: number) =>
    `w-5 h-5 rounded-full flex items-center justify-center font-dm-mono text-[0.6rem] font-bold shrink-0 transition-all duration-300 ${activeStep >= n ? "bg-[#4da2ff] text-black" : "bg-[rgba(77,162,255,0.1)] text-[#4a6fa5] border border-[rgba(77,162,255,0.2)]"}`;

  const chipClass = (active: boolean) =>
    `font-dm-mono text-[0.68rem] tracking-wide px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${active ? "bg-[#4da2ff] text-black border-[#4da2ff]" : "bg-transparent text-[#4a6fa5] border-[rgba(77,162,255,0.2)] hover:border-[rgba(77,162,255,0.4)] hover:text-[#eef5ff]"}`;

  return (
    <aside className="s-left w-90 shrink-0 border-r border-[rgba(77,162,255,0.08)] flex flex-col overflow-y-auto">
      {/* ── Step 1: Upload ── */}
      <div className="p-6 border-b border-[rgba(77,162,255,0.08)]">
        <div className="flex items-center gap-2 mb-4">
          <div className={stepDotClass(1)}>1</div>
          <span className="font-syne font-bold text-sm tracking-wide">
            Upload Your PFP
          </span>
        </div>
        <div
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${isDraggingFile ? "border-[#4da2ff] bg-[rgba(77,162,255,0.08)]" : "border-[rgba(77,162,255,0.25)] hover:border-[#4da2ff] hover:bg-[rgba(77,162,255,0.04)]"}`}
          onDrop={(e) => {
            e.preventDefault();
            onDragLeave();
            const f = e.dataTransfer.files[0];
            if (f) onFile(f);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            onDragOver();
          }}
          onDragLeave={onDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
          {uploadedImage ? (
            <div className="relative h-44 rounded-xl overflow-hidden group">
              <img
                src={uploadedImage}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-[rgba(2,11,24,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <span className="font-dm-mono text-xs text-white tracking-wide">
                  Click to change
                </span>
              </div>
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[rgba(77,162,255,0.1)] border border-[rgba(77,162,255,0.2)] flex items-center justify-center text-2xl">
                📸
              </div>
              <div className="text-center">
                <p className="font-syne font-semibold text-sm">
                  Drop your image here
                </p>
                <p className="font-dm-mono text-[0.7rem] text-[#4a6fa5] mt-1">
                  PNG, JPG, WEBP · Max 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Step 2: Tokens ── */}
      <div className="p-6 border-b border-[rgba(77,162,255,0.08)]">
        <div className="flex items-center gap-2 mb-1">
          <div className={stepDotClass(2)}>2</div>
          <span className="font-syne font-bold text-sm tracking-wide">
            Add Token Badges
          </span>
        </div>
        <p className="font-dm-mono text-[0.65rem] text-[#4a6fa5] mb-4 ml-7">
          Click to toggle. Click a placed badge to select it for editing.
        </p>

        <div className="flex flex-col gap-2">
          {MEME_TOKENS.map((token) => {
            const placed = isTokenPlaced(token.id);
            const placedBadge = placedBadges.find(
              (b) => b.token.id === token.id,
            );
            const isSelected = placedBadge?.id === selectedBadgeId;

            return (
              <button
                key={token.id}
                className={`s-token flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left w-full ${
                  isSelected
                    ? "border-[#4da2ff] bg-[rgba(77,162,255,0.15)]"
                    : placed
                      ? "border-[#4da2ff] bg-[rgba(77,162,255,0.08)]"
                      : "border-[rgba(77,162,255,0.1)] hover:border-[rgba(77,162,255,0.3)] hover:bg-[rgba(77,162,255,0.04)]"
                }`}
                style={{
                  boxShadow: isSelected
                    ? `0 0 24px ${token.glow}`
                    : placed
                      ? `0 0 12px ${token.glow}`
                      : "none",
                }}
                onClick={() => {
                  if (placed && placedBadge) {
                    // If already placed — clicking selects it for editing (toggles selection)
                    if (isSelected) {
                      onSelectBadge(""); // deselect
                    } else {
                      onSelectBadge(placedBadge.id);
                    }
                  } else {
                    // Not placed — add it
                    onAddBadge(token);
                  }
                }}
              >
                <div
                  className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 transition-all duration-200"
                  style={{
                    outline: `2px solid ${isSelected ? token.accent : placed ? `${token.accent}80` : "rgba(77,162,255,0.2)"}`,
                    outlineOffset: 1,
                  }}
                >
                  <Image
                    src={token.src}
                    alt={token.label}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="font-syne font-bold text-sm"
                    style={{ color: placed ? token.accent : "#eef5ff" }}
                  >
                    {token.label}
                  </div>
                  <div className="font-dm-mono text-[0.65rem] text-[#4a6fa5] truncate">
                    {isSelected
                      ? "Click to deselect · drag on canvas"
                      : placed
                        ? "Click to select for editing"
                        : token.description}
                  </div>
                </div>

                {/* State indicator */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {placed && (
                    <button
                      className="w-5 h-5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center text-[0.55rem] font-bold transition-all duration-150 border border-red-500/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (placedBadge) onRemoveBadge(placedBadge.id);
                      }}
                      title="Remove badge"
                    >
                      ✕
                    </button>
                  )}
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                      isSelected
                        ? "bg-[#4da2ff] text-black scale-110"
                        : placed
                          ? "bg-[#4da2ff] text-black"
                          : "bg-[rgba(77,162,255,0.1)] text-[#4a6fa5]"
                    }`}
                  >
                    {isSelected ? "●" : placed ? "✓" : "+"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Step 3: Customize ── */}
      <div className="p-6 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className={stepDotClass(3)}>3</div>
          <span className="font-syne font-bold text-sm tracking-wide">
            Customize
          </span>
        </div>

        {/* Selected badge editor */}
        {selectedBadge ? (
          <div className="p-3 rounded-xl border border-[rgba(77,162,255,0.25)] bg-[rgba(77,162,255,0.07)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={selectedBadge.token.src}
                  alt=""
                  className="w-5 h-5 rounded-full object-contain shrink-0"
                />
                <span
                  className="font-dm-mono text-[0.68rem] tracking-wide"
                  style={{ color: selectedBadge.token.accent }}
                >
                  {selectedBadge.token.label}
                </span>
              </div>
              <span className="font-dm-mono text-[0.6rem] text-[#4a6fa5] tracking-wide">
                editing
              </span>
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <span className="font-dm-mono text-[0.65rem] tracking-widest uppercase text-[#4a6fa5]">
                Size
              </span>
              <span
                className="font-dm-mono text-[0.68rem] font-medium"
                style={{ color: selectedBadge.token.accent }}
              >
                {selectedBadge.size}%
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              value={selectedBadge.size}
              onChange={(e) =>
                onResizeBadge(selectedBadge.id, Number(e.target.value))
              }
              className="w-full h-1.5 rounded-full accent-[#4da2ff]"
            />
            <p className="font-dm-mono text-[0.6rem] text-[#4a6fa5] mt-2">
              Drag the badge on the canvas to reposition it
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-xl border border-[rgba(77,162,255,0.08)] bg-[rgba(77,162,255,0.03)]">
            <p className="font-dm-mono text-[0.65rem] text-[#4a6fa5] text-center">
              Click a placed token above to select it for editing
            </p>
          </div>
        )}

        {/* Default badge size */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-dm-mono text-[0.68rem] tracking-[0.12em] uppercase text-[#4a6fa5]">
              New Badge Size
            </span>
            <span className="font-dm-mono text-[0.68rem] text-[#4da2ff] font-medium">
              {defaultBadgeSize}%
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={45}
            value={defaultBadgeSize}
            onChange={(e) => onSetDefaultSize(Number(e.target.value))}
            className="w-full h-1.5 rounded-full accent-[#4da2ff]"
          />
          <p className="font-dm-mono text-[0.6rem] text-[#4a6fa5] mt-1.5">
            Applied to the next badge you add
          </p>
        </div>

        {/* Overlay */}
        <div>
          <span className="font-dm-mono text-[0.68rem] tracking-[0.12em] uppercase text-[#4a6fa5] block mb-2.5">
            Overlay Effect
          </span>
          <div className="flex flex-wrap gap-1.5">
            {OVERLAY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSetOverlay(opt.id)}
                className={chipClass(selectedOverlay === opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Border */}
        <div>
          <span className="font-dm-mono text-[0.68rem] tracking-[0.12em] uppercase text-[#4a6fa5] block mb-2.5">
            Border Style
          </span>
          <div className="flex flex-wrap gap-1.5">
            {BORDER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onSetBorder(opt.id)}
                className={chipClass(selectedBorder === opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

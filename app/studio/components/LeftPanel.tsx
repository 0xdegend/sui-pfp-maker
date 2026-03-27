"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import {
  MemeToken,
  PlacedBadge,
  TextSticker,
  MemeFrame,
  StudioBackground,
} from "../../types";
import {
  MEME_TOKENS,
  OVERLAY_OPTIONS,
  BORDER_OPTIONS,
  MEME_FRAMES,
  STUDIO_BACKGROUNDS,
  PRESET_STICKERS,
} from "../../data";

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

type ActiveTab = "badges" | "frames" | "stickers" | "background" | "effects";

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
  selectedFrame,
  selectedBackground,
  stickers,
  selectedStickerId,
  selectedSticker,
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
  onSetFrame,
  onSetBackground,
  onAddSticker,
  onRemoveSticker,
  onSelectSticker,
  onUpdateSticker,
}: LeftPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("badges");
  const [customText, setCustomText] = useState("");

  const isTokenPlaced = (tokenId: string) =>
    placedBadges.some((b) => b.token.id === tokenId);

  const stepDotClass = (n: number) =>
    `w-5 h-5 rounded-full flex items-center justify-center font-dm-mono text-[0.6rem] font-bold shrink-0 transition-all duration-300 ${activeStep >= n ? "bg-[#4da2ff] text-black" : "bg-[rgba(77,162,255,0.1)] text-[#4a6fa5] border border-[rgba(77,162,255,0.2)]"}`;

  const chipClass = (active: boolean) =>
    `font-dm-mono text-[0.68rem] tracking-wide px-3 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${active ? "bg-[#4da2ff] text-black border-[#4da2ff]" : "bg-transparent text-[#4a6fa5] border-[rgba(77,162,255,0.2)] hover:border-[rgba(77,162,255,0.4)] hover:text-[#eef5ff]"}`;

  const tabClass = (tab: ActiveTab) =>
    `font-dm-mono text-[0.62rem] tracking-wide px-2.5 py-1.5 rounded-lg transition-all duration-200 cursor-pointer flex-1 text-center ${activeTab === tab ? "bg-[#4da2ff] text-black font-bold" : "text-[#4a6fa5] hover:text-[#eef5ff] hover:bg-[rgba(77,162,255,0.08)]"}`;

  const TABS: { id: ActiveTab; label: string }[] = [
    { id: "badges", label: "Badges" },
    { id: "frames", label: "Frames" },
    { id: "stickers", label: "Text" },
    { id: "background", label: "BG" },
    { id: "effects", label: "Effects" },
  ];

  return (
    <aside className="s-left w-90 shrink-0 border-r border-[rgba(77,162,255,0.08)] flex flex-col overflow-y-auto">
      <div className="p-5 border-b border-[rgba(77,162,255,0.08)]">
        <div className="flex items-center gap-2 mb-3">
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
            <div className="relative h-36 rounded-xl overflow-hidden group">
              <Image
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
            <div className="py-8 flex flex-col items-center gap-2.5">
              <div className="w-11 h-11 rounded-full bg-[rgba(77,162,255,0.1)] border border-[rgba(77,162,255,0.2)] flex items-center justify-center text-xl">
                📸
              </div>
              <div className="text-center">
                <p className="font-syne font-semibold text-sm">
                  Drop your image here
                </p>
                <p className="font-dm-mono text-[0.7rem] text-[#4a6fa5] mt-0.5">
                  PNG, JPG, WEBP · Max 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <div className="px-5 pt-4 pb-0 border-b border-[rgba(77,162,255,0.08)]">
          <div className="flex items-center gap-2 mb-3">
            <div className={stepDotClass(2)}>2</div>
            <span className="font-syne font-bold text-sm tracking-wide">
              Customize
            </span>
          </div>

          <div className="flex gap-1 mb-0 pb-0">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={tabClass(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "badges" && (
            <div className="p-5 flex flex-col gap-3">
              <p className="font-dm-mono text-[0.65rem] text-[#4a6fa5]">
                Click to toggle. Select a placed badge to resize it.
              </p>
              {MEME_TOKENS.map((token) => {
                const placed = isTokenPlaced(token.id);
                const placedBadge = placedBadges.find(
                  (b) => b.token.id === token.id,
                );
                const isSelected = placedBadge?.id === selectedBadgeId;
                return (
                  <div
                    key={token.id}
                    role="button"
                    tabIndex={0}
                    className={`s-token flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left w-full cursor-pointer ${isSelected ? "border-[#4da2ff] bg-[rgba(77,162,255,0.15)]" : placed ? "border-[#4da2ff] bg-[rgba(77,162,255,0.08)]" : "border-[rgba(77,162,255,0.1)] hover:border-[rgba(77,162,255,0.3)] hover:bg-[rgba(77,162,255,0.04)]"}`}
                    style={{
                      boxShadow: isSelected
                        ? `0 0 20px ${token.glow}`
                        : placed
                          ? `0 0 10px ${token.glow}`
                          : "none",
                    }}
                    onClick={() => {
                      if (placed && placedBadge) {
                        onSelectBadge(isSelected ? "" : placedBadge.id);
                      } else {
                        onAddBadge(token);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ")
                        e.currentTarget.click();
                    }}
                  >
                    <div
                      className="relative w-9 h-9 rounded-full overflow-hidden shrink-0"
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
                      <div className="font-dm-mono text-[0.6rem] text-[#4a6fa5] truncate">
                        {isSelected
                          ? "Drag on canvas to move"
                          : placed
                            ? "Click to select for editing"
                            : token.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {placed && (
                        <button
                          className="w-5 h-5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center text-[0.5rem] font-bold transition-all border border-red-500/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (placedBadge) onRemoveBadge(placedBadge.id);
                          }}
                        >
                          ✕
                        </button>
                      )}
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${isSelected ? "bg-[#4da2ff] text-black scale-110" : placed ? "bg-[#4da2ff] text-black" : "bg-[rgba(77,162,255,0.1)] text-[#4a6fa5]"}`}
                      >
                        {isSelected ? "●" : placed ? "✓" : "+"}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Badge size controls */}
              {selectedBadge ? (
                <div className="p-3 rounded-xl border border-[rgba(77,162,255,0.25)] bg-[rgba(77,162,255,0.07)] mt-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Image
                        src={selectedBadge.token.src}
                        alt=""
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span
                        className="font-dm-mono text-[0.65rem]"
                        style={{ color: selectedBadge.token.accent }}
                      >
                        {selectedBadge.token.label} size
                      </span>
                    </div>
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
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-dm-mono text-[0.65rem] uppercase tracking-wider text-[#4a6fa5]">
                      New Badge Size
                    </span>
                    <span className="font-dm-mono text-[0.68rem] text-[#4da2ff]">
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
                </div>
              )}
            </div>
          )}

          {/* ── Frames tab ── */}
          {activeTab === "frames" && (
            <div className="p-5 flex flex-col gap-3">
              <p className="font-dm-mono text-[0.65rem] text-[#4a6fa5]">
                Decorative frames around your entire PFP. Token-specific frames
                are extra special.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {MEME_FRAMES.map((frame) => {
                  const isActive = selectedFrame === frame.id;
                  const linkedToken = frame.tokenId
                    ? MEME_TOKENS.find((t) => t.id === frame.tokenId)
                    : null;
                  return (
                    <button
                      key={frame.id}
                      onClick={() => onSetFrame(frame.id)}
                      className={`p-3 rounded-xl border transition-all duration-200 text-left ${isActive ? "border-[#4da2ff] bg-[rgba(77,162,255,0.12)]" : "border-[rgba(77,162,255,0.1)] hover:border-[rgba(77,162,255,0.3)] hover:bg-[rgba(77,162,255,0.04)]"}`}
                      style={
                        isActive
                          ? { boxShadow: "0 0 16px rgba(77,162,255,0.3)" }
                          : {}
                      }
                    >
                      {/* Mini frame preview */}
                      <div className="w-full aspect-square rounded-lg mb-2 overflow-hidden relative bg-[rgba(77,162,255,0.05)] border border-[rgba(77,162,255,0.1)]">
                        {frame.svgPattern && (
                          <svg
                            viewBox="0 0 1000 1000"
                            className="w-full h-full absolute inset-0"
                            dangerouslySetInnerHTML={{
                              __html: frame.svgPattern,
                            }}
                          />
                        )}
                        {frame.id === "none" && (
                          <div className="w-full h-full flex items-center justify-center text-[#4a6fa5] font-dm-mono text-[0.6rem]">
                            No frame
                          </div>
                        )}
                      </div>
                      <div
                        className="font-syne font-bold text-[0.75rem]"
                        style={{ color: isActive ? "#4da2ff" : "#eef5ff" }}
                      >
                        {frame.label}
                      </div>
                      {linkedToken && (
                        <div
                          className="font-dm-mono text-[0.6rem] mt-0.5"
                          style={{ color: linkedToken.accent }}
                        >
                          {linkedToken.label}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Stickers tab ── */}
          {activeTab === "stickers" && (
            <div className="p-5 flex flex-col gap-4">
              {/* Custom text input */}
              <div>
                <label className="font-dm-mono text-[0.65rem] uppercase tracking-wider text-[#4a6fa5] block mb-2">
                  Custom Text
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) =>
                      setCustomText(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && customText.trim()) {
                        onAddSticker(customText.trim());
                        setCustomText("");
                      }
                    }}
                    placeholder="TYPE SOMETHING..."
                    maxLength={24}
                    className="flex-1 bg-[rgba(77,162,255,0.05)] border border-[rgba(77,162,255,0.2)] rounded-lg px-3 py-2 font-dm-mono text-[0.75rem] text-[#eef5ff] placeholder-[#4a6fa5] focus:outline-none focus:border-[#4da2ff] transition-colors"
                  />
                  <button
                    onClick={() => {
                      if (customText.trim()) {
                        onAddSticker(customText.trim());
                        setCustomText("");
                      }
                    }}
                    className="px-3 py-2 rounded-lg bg-[#4da2ff] text-black font-dm-mono text-[0.75rem] font-bold hover:bg-[#6fbbff] transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Preset stickers */}
              <div>
                <label className="font-dm-mono text-[0.65rem] uppercase tracking-wider text-[#4a6fa5] block mb-2">
                  Quick Add
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_STICKERS.map((text) => (
                    <button
                      key={text}
                      onClick={() => onAddSticker(text)}
                      className="font-dm-mono text-[0.65rem] px-2.5 py-1 rounded-lg border border-[rgba(77,162,255,0.2)] text-[#4a6fa5] hover:border-[#4da2ff] hover:text-[#eef5ff] hover:bg-[rgba(77,162,255,0.08)] transition-all duration-150"
                    >
                      {text}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active stickers */}
              {stickers.length > 0 && (
                <div>
                  <label className="font-dm-mono text-[0.65rem] uppercase tracking-wider text-[#4a6fa5] block mb-2">
                    Active Stickers
                  </label>
                  <div className="flex flex-col gap-2">
                    {stickers.map((sticker) => {
                      const isSelected = sticker.id === selectedStickerId;
                      return (
                        <div
                          key={sticker.id}
                          className={`p-2.5 rounded-xl border transition-all duration-150 cursor-pointer ${isSelected ? "border-[#4da2ff] bg-[rgba(77,162,255,0.1)]" : "border-[rgba(77,162,255,0.1)] hover:border-[rgba(77,162,255,0.25)]"}`}
                          onClick={() => onSelectSticker(sticker.id)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="font-syne font-bold text-[0.8rem]"
                              style={{ color: sticker.color }}
                            >
                              {sticker.text}
                            </span>
                            <button
                              className="w-5 h-5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 flex items-center justify-center text-[0.5rem] font-bold transition-all border border-red-500/30"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveSticker(sticker.id);
                              }}
                            >
                              ✕
                            </button>
                          </div>
                          {isSelected && (
                            <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-[rgba(77,162,255,0.15)]">
                              {/* Font size */}
                              <div className="flex items-center justify-between">
                                <span className="font-dm-mono text-[0.6rem] text-[#4a6fa5]">
                                  Size
                                </span>
                                <span className="font-dm-mono text-[0.6rem] text-[#4da2ff]">
                                  {sticker.fontSize}
                                </span>
                              </div>
                              <input
                                type="range"
                                min={30}
                                max={160}
                                value={sticker.fontSize}
                                onChange={(e) =>
                                  onUpdateSticker(sticker.id, {
                                    fontSize: Number(e.target.value),
                                  })
                                }
                                className="w-full h-1.5 rounded-full accent-[#4da2ff]"
                              />

                              {/* Rotation */}
                              <div className="flex items-center justify-between">
                                <span className="font-dm-mono text-[0.6rem] text-[#4a6fa5]">
                                  Rotation
                                </span>
                                <span className="font-dm-mono text-[0.6rem] text-[#4da2ff]">
                                  {sticker.rotation}°
                                </span>
                              </div>
                              <input
                                type="range"
                                min={-45}
                                max={45}
                                value={sticker.rotation}
                                onChange={(e) =>
                                  onUpdateSticker(sticker.id, {
                                    rotation: Number(e.target.value),
                                  })
                                }
                                className="w-full h-1.5 rounded-full accent-[#4da2ff]"
                              />

                              {/* Color swatches */}
                              <div className="flex items-center gap-2">
                                <span className="font-dm-mono text-[0.6rem] text-[#4a6fa5]">
                                  Color
                                </span>
                                <div className="flex gap-1.5 flex-wrap">
                                  {[
                                    "#ffffff",
                                    "#4da2ff",
                                    "#fde68a",
                                    "#4ade80",
                                    "#f87171",
                                    "#c084fc",
                                    "#000000",
                                  ].map((color) => (
                                    <button
                                      key={color}
                                      onClick={() =>
                                        onUpdateSticker(sticker.id, { color })
                                      }
                                      className="w-5 h-5 rounded-full border-2 transition-all"
                                      style={{
                                        background: color,
                                        borderColor:
                                          sticker.color === color
                                            ? "#4da2ff"
                                            : "transparent",
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>

                              {/* Bold toggle */}
                              <button
                                onClick={() =>
                                  onUpdateSticker(sticker.id, {
                                    fontWeight:
                                      sticker.fontWeight === "bold"
                                        ? "normal"
                                        : "bold",
                                  })
                                }
                                className={`font-dm-mono text-[0.65rem] px-3 py-1 rounded-lg border transition-all self-start ${sticker.fontWeight === "bold" ? "bg-[#4da2ff] text-black border-[#4da2ff]" : "bg-transparent text-[#4a6fa5] border-[rgba(77,162,255,0.2)]"}`}
                              >
                                Bold
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Background tab ── */}
          {activeTab === "background" && (
            <div className="p-5 flex flex-col gap-3">
              <p className="font-dm-mono text-[0.65rem] text-[#4a6fa5]">
                Replace or keep your photo&lsquo;s background.
              </p>
              <div className="grid grid-cols-3 gap-2">
                {STUDIO_BACKGROUNDS.map((bg) => {
                  const isActive = selectedBackground === bg.id;
                  return (
                    <button
                      key={bg.id}
                      onClick={() => onSetBackground(bg.id)}
                      className={`p-2 rounded-xl border transition-all duration-200 flex flex-col items-center gap-1.5 ${isActive ? "border-[#4da2ff] bg-[rgba(77,162,255,0.1)]" : "border-[rgba(77,162,255,0.1)] hover:border-[rgba(77,162,255,0.3)]"}`}
                      style={
                        isActive
                          ? { boxShadow: "0 0 12px rgba(77,162,255,0.3)" }
                          : {}
                      }
                    >
                      {/* Swatch */}
                      <div
                        className={`w-full aspect-square rounded-lg border border-[rgba(255,255,255,0.1)] overflow-hidden`}
                        style={{
                          background:
                            bg.type === "original"
                              ? "repeating-conic-gradient(#333 0% 25%, #222 0% 50%) 0 0 / 12px 12px"
                              : bg.value,
                        }}
                      >
                        {bg.type === "original" && (
                          <div className="w-full h-full flex items-center justify-center text-[0.9rem]">
                            📷
                          </div>
                        )}
                      </div>
                      <span
                        className={`font-dm-mono text-[0.62rem] tracking-wide ${isActive ? "text-[#4da2ff]" : "text-[#4a6fa5]"}`}
                      >
                        {bg.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Effects tab ── */}
          {activeTab === "effects" && (
            <div className="p-5 flex flex-col gap-5">
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
          )}
        </div>
      </div>
    </aside>
  );
}

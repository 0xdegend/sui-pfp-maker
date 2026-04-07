"use client";

import { PlacedBadge, TextSticker } from "../../types";
import {
  BORDER_OPTIONS,
  OVERLAY_OPTIONS,
  MEME_FRAMES,
  STUDIO_BACKGROUNDS,
} from "../../data";
import DraggableBadge from "./DraggableBadge";
import DraggableSticker from "./DraggableSticker";

interface PreviewPanelProps {
  uploadedImage: string | null;
  placedBadges: PlacedBadge[];
  selectedBadgeId: string | null;
  selectedOverlay: string;
  selectedBorder: string;
  selectedFrame: string;
  selectedBackground: string;
  stickers: TextSticker[];
  selectedStickerId: string | null;
  isDownloading: boolean;
  onSelectBadge: (id: string) => void;
  onDeselectBadge: () => void;
  onMoveBadge: (id: string, x: number, y: number) => void;
  onRemoveBadge: (id: string) => void;
  onSelectSticker: (id: string) => void;
  onMoveSticker: (id: string, x: number, y: number) => void;
  onRemoveSticker: (id: string) => void;
  onDownload: () => void;
  previewRef: React.RefObject<HTMLDivElement>;
}

export default function PreviewPanel({
  uploadedImage,
  placedBadges,
  selectedBadgeId,
  selectedOverlay,
  selectedBorder,
  selectedFrame,
  selectedBackground,
  stickers,
  selectedStickerId,
  isDownloading,
  onSelectBadge,
  onDeselectBadge,
  onMoveBadge,
  onRemoveBadge,
  onSelectSticker,
  onMoveSticker,
  onRemoveSticker,
  onDownload,
  previewRef,
}: PreviewPanelProps) {
  const currentBorder = BORDER_OPTIONS.find((b) => b.id === selectedBorder);
  const overlayClass =
    OVERLAY_OPTIONS.find((o) => o.id === selectedOverlay)?.className ?? "";
  const currentFrame = MEME_FRAMES.find((f) => f.id === selectedFrame);
  const currentBg = STUDIO_BACKGROUNDS.find((b) => b.id === selectedBackground);

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const insideBadge = target.closest("[data-badge]");
    const insideSticker = target.closest("[data-sticker]");
    if (!insideBadge && !insideSticker) {
      onDeselectBadge();
    }
  };

  const totalItems = placedBadges.length + stickers.length;

  return (
    <div className="s-right flex-1 flex flex-col items-center justify-center p-10 gap-6">
      <div className="flex items-center gap-3 self-start flex-wrap">
        <div className="w-8 h-px bg-[#4da2ff]" />
        <span className="font-dm-mono text-[0.7rem] tracking-[0.15em] uppercase text-[#4da2ff]">
          Live Preview
        </span>
        {totalItems > 0 && (
          <>
            <div className="flex">
              {placedBadges.map((b, i) => (
                <img
                  key={b.id}
                  src={b.token.src}
                  alt={b.token.label}
                  className="w-5 h-5 rounded-full object-contain border-2 border-[#020b18]"
                  style={{ marginLeft: i > 0 ? -6 : 0 }}
                />
              ))}
            </div>
            <span className="font-dm-mono text-[0.65rem] text-[#4a6fa5]">
              {placedBadges.length > 0 &&
                `${placedBadges.length} badge${placedBadges.length !== 1 ? "s" : ""}`}
              {placedBadges.length > 0 && stickers.length > 0 && " · "}
              {stickers.length > 0 &&
                `${stickers.length} sticker${stickers.length !== 1 ? "s" : ""}`}
              {totalItems > 0 && " · drag to reposition"}
            </span>
          </>
        )}
        {currentFrame && currentFrame.id !== "none" && (
          <span className="font-dm-mono text-[0.6rem] px-2 py-0.5 rounded-full bg-[rgba(77,162,255,0.1)] border border-[rgba(77,162,255,0.2)] text-[#4da2ff]">
            {currentFrame.label} frame
          </span>
        )}
      </div>
      <div
        ref={previewRef}
        className="relative w-full max-w-120 aspect-square rounded-2xl overflow-hidden select-none"
        style={{ containerType: "inline-size", ...currentBorder?.style }}
        onClick={handleContainerClick}
      >
        {currentBg && currentBg.type !== "original" && (
          <div
            className="absolute inset-0 z-0"
            style={{ background: currentBg.value }}
          />
        )}

        {uploadedImage ? (
          <>
            <img
              src={uploadedImage}
              alt="PFP Preview"
              className="w-full h-full pointer-events-none relative z-1"
              style={{
                objectFit: "cover",
                mixBlendMode:
                  currentBg && currentBg.type !== "original"
                    ? "multiply"
                    : "normal",
              }}
            />
          </>
        ) : (
          <div className="glass w-full h-full flex flex-col items-center justify-center gap-4 relative z-1">
            <div className="text-[3.5rem] opacity-30">🖼️</div>
            <p className="font-dm-mono text-[0.75rem] text-[#4a6fa5] text-center px-8">
              Upload your photo to see the preview here
            </p>
          </div>
        )}
        {selectedOverlay !== "none" && (
          <div
            className={`absolute inset-0 pointer-events-none z-2 ${overlayClass}`}
          />
        )}
        {placedBadges.map((badge) => (
          <DraggableBadge
            key={badge.id}
            badge={badge}
            isSelected={selectedBadgeId === badge.id}
            onSelect={() => onSelectBadge(badge.id)}
            onMove={(x, y) => onMoveBadge(badge.id, x, y)}
            onRemove={() => onRemoveBadge(badge.id)}
            containerRef={previewRef as React.RefObject<HTMLDivElement>}
          />
        ))}
        {stickers.map((sticker) => (
          <DraggableSticker
            key={sticker.id}
            sticker={sticker}
            isSelected={selectedStickerId === sticker.id}
            onSelect={() => onSelectSticker(sticker.id)}
            onMove={(x, y) => onMoveSticker(sticker.id, x, y)}
            onRemove={() => onRemoveSticker(sticker.id)}
            containerRef={previewRef as React.RefObject<HTMLDivElement>}
          />
        ))}
        {currentFrame && currentFrame.svgPattern && (
          <svg
            viewBox="0 0 1000 1000"
            className="absolute inset-0 w-full h-full pointer-events-none z-40"
            dangerouslySetInnerHTML={{ __html: currentFrame.svgPattern }}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03)_0%,transparent_50%)] pointer-events-none z-50" />
      </div>
      {uploadedImage && totalItems === 0 && (
        <div className="flex items-center gap-2 self-start">
          <span>👈</span>
          <span className="font-dm-mono text-[0.68rem] text-[#4a6fa5]">
            Use the panel on the left to add badges, frames, stickers and more
          </span>
        </div>
      )}
      <div className="flex items-center gap-6 self-start flex-wrap">
        {[
          { label: "Export size", val: "1000 × 1000", cls: "text-[#eef5ff]" },
          { label: "Format", val: "PNG", cls: "text-[#eef5ff]" },
          {
            label: "Status",
            val: uploadedImage ? "Ready" : "Waiting",
            cls: uploadedImage ? "text-green-400" : "text-[#4a6fa5]",
          },
          ...(currentFrame && currentFrame.id !== "none"
            ? [
                {
                  label: "Frame",
                  val: currentFrame.label,
                  cls: "text-[#4da2ff]",
                },
              ]
            : []),
          ...(stickers.length > 0
            ? [
                {
                  label: "Text",
                  val: `${stickers.length}`,
                  cls: "text-[#4da2ff]",
                },
              ]
            : []),
        ].map(({ label, val, cls }, i, arr) => (
          <div key={label} className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-dm-mono text-[0.65rem] text-[#4a6fa5] uppercase tracking-wider">
                {label}
              </div>
              <div className={`font-syne font-bold text-sm ${cls}`}>{val}</div>
            </div>
            {i < arr.length - 1 && (
              <div className="w-px h-8 bg-[rgba(77,162,255,0.15)]" />
            )}
          </div>
        ))}
      </div>
      <div className="self-start flex items-center gap-4">
        <button
          onClick={onDownload}
          disabled={!uploadedImage || isDownloading}
          className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed text-base! px-8! py-4!"
        >
          {isDownloading ? (
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin" />
              Exporting...
            </span>
          ) : (
            "Download PFP"
          )}
        </button>
        <span className="font-dm-mono text-[0.68rem] text-[#4a6fa5]">
          Mint onchain — coming soon
        </span>
      </div>
    </div>
  );
}

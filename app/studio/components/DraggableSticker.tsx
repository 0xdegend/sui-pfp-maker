"use client";

import { useRef } from "react";
import { TextSticker } from "../../types";

interface DraggableStickerProps {
  sticker: TextSticker;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function DraggableSticker({
  sticker,
  isSelected,
  onSelect,
  onMove,
  onRemove,
  containerRef,
}: DraggableStickerProps) {
  const isDragging = useRef(false);
  const startPos = useRef({ mouseX: 0, mouseY: 0, sx: 0, sy: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    isDragging.current = true;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    startPos.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      sx: sticker.x,
      sy: sticker.y,
    };

    const onMove_ = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = ((ev.clientX - startPos.current.mouseX) / rect.width) * 100;
      const dy = ((ev.clientY - startPos.current.mouseY) / rect.height) * 100;
      onMove(
        Math.max(0, Math.min(95, startPos.current.sx + dx)),
        Math.max(0, Math.min(95, startPos.current.sy + dy)),
      );
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMove_);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove_);
    window.addEventListener("mouseup", onUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    onSelect();
    isDragging.current = true;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const touch = e.touches[0];
    startPos.current = {
      mouseX: touch.clientX,
      mouseY: touch.clientY,
      sx: sticker.x,
      sy: sticker.y,
    };

    const onMove_ = (ev: TouchEvent) => {
      if (!isDragging.current) return;
      const t = ev.touches[0];
      const dx = ((t.clientX - startPos.current.mouseX) / rect.width) * 100;
      const dy = ((t.clientY - startPos.current.mouseY) / rect.height) * 100;
      onMove(
        Math.max(0, Math.min(95, startPos.current.sx + dx)),
        Math.max(0, Math.min(95, startPos.current.sy + dy)),
      );
    };
    const onEnd = () => {
      isDragging.current = false;
      window.removeEventListener("touchmove", onMove_);
      window.removeEventListener("touchend", onEnd);
    };
    window.addEventListener("touchmove", onMove_, { passive: true });
    window.addEventListener("touchend", onEnd);
  };

  // fontSize is stored in canvas-space (1000px canvas)
  // Preview container uses container-query units: 1cqw = 1% of container width
  // So canvas fontSize / 1000 * 100 = fontSize * 0.1cqw matches exactly
  const previewFontSize = `${sticker.fontSize * 0.1}cqw`;

  return (
    <div
      data-sticker="true"
      className="absolute group/sticker"
      style={{
        left: `${sticker.x}%`,
        top: `${sticker.y}%`,
        transform: `rotate(${sticker.rotation}deg)`,
        zIndex: isSelected ? 35 : 25,
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Selection outline */}
      {isSelected && (
        <div className="absolute -inset-2 border border-dashed border-[#4da2ff] rounded opacity-70 pointer-events-none" />
      )}

      {/* Sticker text */}
      <span
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          fontSize: previewFontSize,
          fontWeight: sticker.fontWeight,
          color: sticker.color,
          whiteSpace: "nowrap",
          display: "block",
          textShadow: "0 1px 4px rgba(0,0,0,0.8), 0 0 12px rgba(0,0,0,0.5)",
          letterSpacing: "0.05em",
        }}
      >
        {sticker.text}
      </span>

      {/* Remove button */}
      <button
        className="absolute -top-3 -right-3 w-5 h-5 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center text-[0.55rem] font-bold opacity-0 group-hover/sticker:opacity-100 transition-opacity duration-150 z-50"
        onMouseDown={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ✕
      </button>
    </div>
  );
}

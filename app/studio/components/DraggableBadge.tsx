"use client";

import { useRef } from "react";
import { PlacedBadge } from "../../types";

interface DraggableBadgeProps {
  badge: PlacedBadge;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function DraggableBadge({
  badge,
  isSelected,
  onSelect,
  onMove,
  onRemove,
  containerRef,
}: DraggableBadgeProps) {
  const isDragging = useRef(false);
  const startPos = useRef({ mouseX: 0, mouseY: 0, badgeX: 0, badgeY: 0 });

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
      badgeX: badge.x,
      badgeY: badge.y,
    };

    const onMove_ = (ev: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = ((ev.clientX - startPos.current.mouseX) / rect.width) * 100;
      const dy = ((ev.clientY - startPos.current.mouseY) / rect.height) * 100;
      onMove(
        Math.max(0, Math.min(100 - badge.size, startPos.current.badgeX + dx)),
        Math.max(0, Math.min(100 - badge.size, startPos.current.badgeY + dy)),
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
      badgeX: badge.x,
      badgeY: badge.y,
    };

    const onMove_ = (ev: TouchEvent) => {
      if (!isDragging.current) return;
      const t = ev.touches[0];
      const dx = ((t.clientX - startPos.current.mouseX) / rect.width) * 100;
      const dy = ((t.clientY - startPos.current.mouseY) / rect.height) * 100;
      onMove(
        Math.max(0, Math.min(100 - badge.size, startPos.current.badgeX + dx)),
        Math.max(0, Math.min(100 - badge.size, startPos.current.badgeY + dy)),
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

  return (
    <div
      className="absolute group/badge"
      style={{
        left: `${badge.x}%`,
        top: `${badge.y}%`,
        width: `${badge.size}%`,
        height: `${badge.size}%`,
        zIndex: isSelected ? 30 : 20,
        userSelect: "none",
      }}
      data-badge="true"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {isSelected && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: `0 0 0 2px ${badge.token.accent}, 0 0 20px ${badge.token.glow}`,
          }}
        />
      )}
      <div
        className="w-full h-full rounded-full overflow-hidden border-2 transition-transform duration-150"
        style={{
          borderColor: badge.token.accent,
          boxShadow: `0 0 16px ${badge.token.glow}`,
          background: "rgba(2,11,24,0.85)",
          transform: isSelected ? "scale(1.05)" : "scale(1)",
        }}
      >
        <img
          src={badge.token.src}
          alt={badge.token.label}
          className="w-full h-full object-cover"
        />
      </div>
      <button
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 hover:bg-red-400 text-white flex items-center justify-center text-[0.5rem] font-bold opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 z-40"
        onMouseDown={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ✕
      </button>
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-5 font-dm-mono text-[0.5rem] tracking-widest whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150"
        style={{ color: badge.token.accent }}
      >
        {badge.token.label}
      </div>
    </div>
  );
}

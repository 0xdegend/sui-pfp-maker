"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
  blue: "#4da2ff",
  blueLight: "#6fbbff",
  bluePale: "#a8d4ff",
  dark: "#020b18",
  dark2: "#050f1f",
  white: "#eef5ff",
  muted: "#4a6fa5",
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface MemeToken {
  id: string;
  label: string;
  src: string;
  accent: string;
  glow: string;
  description: string;
}

interface PlacedBadge {
  id: string;
  token: MemeToken;
  x: number;
  y: number;
  size: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const MEME_TOKENS: MemeToken[] = [
  {
    id: "panda",
    label: "$PANDA",
    src: "/memes/pans-meme.png",
    accent: C.blue,
    glow: "rgba(77,162,255,0.6)",
    description: "The gentle giant of Sui",
  },
  {
    id: "mbp",
    label: "$MBP",
    src: "/memes/mbp-logo.jpg",
    accent: C.blueLight,
    glow: "rgba(111,187,255,0.6)",
    description: "Most Bearish Possible",
  },
  {
    id: "poors",
    label: "$POORS",
    src: "/memes/poors-meme.jpg",
    accent: C.bluePale,
    glow: "rgba(168,212,255,0.5)",
    description: "We are all poors together",
  },
  {
    id: "eagle",
    label: "$EAGLE",
    src: "/memes/eagle-sui-meme.jpg",
    accent: C.blue,
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

const OVERLAYS = [
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
    id: "glow",
    label: "Glow",
    className:
      "bg-[radial-gradient(circle,rgba(77,162,255,0.3)_0%,transparent_70%)]",
  },
];

const BORDERS = [
  { id: "none", label: "None", style: {} },
  {
    id: "sui",
    label: "Sui Blue",
    style: {
      border: `3px solid ${C.blue}`,
      boxShadow: `0 0 20px rgba(77,162,255,0.6)`,
    },
  },
  {
    id: "gradient",
    label: "Gradient",
    style: { boxShadow: `0 0 0 3px ${C.blue}, 0 0 30px rgba(77,162,255,0.4)` },
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
      border: `2px solid ${C.blue}`,
      boxShadow: `0 0 8px ${C.blue}, 0 0 30px rgba(77,162,255,0.5), 0 0 60px rgba(77,162,255,0.2)`,
    },
  },
];

// ─── Draggable Badge ──────────────────────────────────────────────────────────

function DraggableBadge({
  badge,
  isSelected,
  onSelect,
  onMove,
  onRemove,
  containerRef,
}: {
  badge: PlacedBadge;
  isSelected: boolean;
  onSelect: () => void;
  onMove: (x: number, y: number) => void;
  onRemove: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
}) {
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
        cursor: "grab",
        zIndex: isSelected ? 30 : 20,
        userSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {isSelected && (
        <div
          className="absolute inset-0 rounded-full animate-pulse"
          style={{
            boxShadow: `0 0 0 2px ${badge.token.accent}, 0 0 20px ${badge.token.glow}`,
            borderRadius: "50%",
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
        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-white flex items-center justify-center opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150 z-40"
        style={{ background: "#ef4444", fontSize: "0.5rem", fontWeight: 700 }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        ✕
      </button>
      <div
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover/badge:opacity-100 transition-opacity duration-150"
        style={{
          bottom: "-1.25rem",
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: "0.5rem",
          letterSpacing: "0.1em",
          color: badge.token.accent,
        }}
      >
        {badge.token.label}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function StudioPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [placedBadges, setPlacedBadges] = useState<PlacedBadge[]>([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState("none");
  const [selectedBorder, setSelectedBorder] = useState("none");
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [defaultBadgeSize, setDefaultBadgeSize] = useState(25);

  const selectedBadge =
    placedBadges.find((b) => b.id === selectedBadgeId) ?? null;
  const currentBorder = BORDERS.find((b) => b.id === selectedBorder);
  const overlayClass =
    OVERLAYS.find((o) => o.id === selectedOverlay)?.className ?? "";

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".s-header",
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0,
      );
      tl.fromTo(
        ".s-left",
        { x: -60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.2,
      );
      tl.fromTo(
        ".s-right",
        { x: 60, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        0.3,
      );
      tl.fromTo(
        ".s-token",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        0.5,
      );
    },
    { scope: pageRef },
  );

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setActiveStep(2);
    };
    reader.readAsDataURL(file);
  }, []);

  const addBadge = (token: MemeToken) => {
    const existing = placedBadges.find((b) => b.token.id === token.id);
    if (existing) {
      setSelectedBadgeId(existing.id);
      return;
    }
    const id = `${token.id}-${Date.now()}`;
    const offset = placedBadges.length * 6;
    setPlacedBadges((prev) => [
      ...prev,
      {
        id,
        token,
        x: Math.min(65, 60 + offset),
        y: Math.min(65, 60 + offset),
        size: defaultBadgeSize,
      },
    ]);
    setSelectedBadgeId(id);
    setActiveStep(3);
    gsap.fromTo(
      previewRef.current,
      { scale: 0.98 },
      { scale: 1, duration: 0.3, ease: "back.out(2)" },
    );
  };

  const removeBadge = (id: string) => {
    setPlacedBadges((p) => p.filter((b) => b.id !== id));
    if (selectedBadgeId === id) setSelectedBadgeId(null);
  };
  const moveBadge = (id: string, x: number, y: number) =>
    setPlacedBadges((p) => p.map((b) => (b.id === id ? { ...b, x, y } : b)));
  const resizeBadge = (id: string, size: number) =>
    setPlacedBadges((p) => p.map((b) => (b.id === id ? { ...b, size } : b)));
  const isTokenPlaced = (tokenId: string) =>
    placedBadges.some((b) => b.token.id === tokenId);

  const handleDownload = async () => {
    if (!uploadedImage) return;
    setIsDownloading(true);
    const canvas = canvasRef.current!;
    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    await new Promise<void>((res) => {
      const img = new window.Image();
      img.onload = () => {
        const s = Math.min(img.width, img.height);
        ctx.drawImage(
          img,
          (img.width - s) / 2,
          (img.height - s) / 2,
          s,
          s,
          0,
          0,
          size,
          size,
        );
        res();
      };
      img.src = uploadedImage;
    });

    if (selectedOverlay === "vignette") {
      const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        size * 0.3,
        size / 2,
        size / 2,
        size * 0.8,
      );
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(0,0,0,0.75)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    } else if (selectedOverlay === "scanlines") {
      for (let y = 0; y < size; y += 3) {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, y, size, 1);
      }
    } else if (selectedOverlay === "holographic") {
      const g = ctx.createLinearGradient(0, 0, size, size);
      g.addColorStop(0, "rgba(77,162,255,0.15)");
      g.addColorStop(0.5, "rgba(168,212,255,0.15)");
      g.addColorStop(1, "rgba(20,71,230,0.15)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    } else if (selectedOverlay === "glow") {
      const g = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size * 0.5,
      );
      g.addColorStop(0, "rgba(77,162,255,0.3)");
      g.addColorStop(1, "rgba(77,162,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }

    if (selectedBorder !== "none") {
      ctx.strokeStyle = selectedBorder === "gold" ? "#f59e0b" : C.blue;
      ctx.lineWidth = 18;
      ctx.strokeRect(9, 9, size - 18, size - 18);
    }

    for (const badge of placedBadges) {
      const px = (badge.size / 100) * size;
      const bx = (badge.x / 100) * size;
      const by = (badge.y / 100) * size;
      ctx.shadowColor = badge.token.glow;
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(bx + px / 2, by + px / 2, px / 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(2,11,24,0.85)";
      ctx.fill();
      ctx.strokeStyle = badge.token.accent;
      ctx.lineWidth = 6;
      ctx.stroke();
      ctx.shadowBlur = 0;
      await new Promise<void>((res) => {
        const img = new window.Image();
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(bx + px / 2, by + px / 2, px / 2 - 6, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(img, bx + 6, by + 6, px - 12, px - 12);
          ctx.restore();
          res();
        };
        img.src = badge.token.src;
      });
    }

    const link = document.createElement("a");
    link.download = `suipfp-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setIsDownloading(false);
  };

  // ─── Shared style helpers ──────────────────────────────────────────────────

  const stepDot = (n: number) =>
    ({
      width: 20,
      height: 20,
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: activeStep >= n ? C.blue : "rgba(77,162,255,0.1)",
      color: activeStep >= n ? "#000" : C.muted,
      border: activeStep >= n ? "none" : "1px solid rgba(77,162,255,0.2)",
      fontFamily: "var(--font-dm-mono, monospace)",
      fontSize: "0.6rem",
      fontWeight: 700,
      flexShrink: 0,
    }) as React.CSSProperties;

  const chipBtn = (active: boolean) =>
    ({
      fontFamily: "var(--font-dm-mono, monospace)",
      fontSize: "0.68rem",
      letterSpacing: "0.05em",
      padding: "0.3rem 0.75rem",
      borderRadius: "0.5rem",
      cursor: "pointer",
      border: `1px solid ${active ? C.blue : "rgba(77,162,255,0.2)"}`,
      background: active ? C.blue : "transparent",
      color: active ? "#000" : C.muted,
      transition: "all 0.2s",
    }) as React.CSSProperties;

  const sectionLabel = {
    fontFamily: "var(--font-dm-mono, monospace)",
    fontSize: "0.68rem",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: C.muted,
    display: "block",
    marginBottom: "0.6rem",
  };

  return (
    <div
      ref={pageRef}
      style={{
        minHeight: "100vh",
        background: C.dark,
        color: C.white,
        fontFamily: "var(--font-syne, sans-serif)",
        overflowX: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Background layers */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, ${C.dark} 0%, ${C.dark2} 50%, ${C.dark} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(77,162,255,0.12), transparent)",
          }}
        />
        <div
          className="grid-pattern"
          style={{ position: "absolute", inset: 0, opacity: 0.4 }}
        />
      </div>

      {/* ── Header ── */}
      <header
        className="s-header"
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 2rem",
          borderBottom: "1px solid rgba(77,162,255,0.08)",
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              position: "relative",
              width: 28,
              height: 28,
              flexShrink: 0,
            }}
          >
            <Image
              src="/sui-logo.png"
              alt="Sui"
              fill
              className="object-contain"
            />
          </div>
          <span
            style={{
              fontFamily: "var(--font-syne, sans-serif)",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: C.white,
            }}
          >
            sui<span style={{ color: C.blue }}>pfp</span>
          </span>
        </Link>

        {/* Progress steps */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {([1, 2, 3] as const).map((step) => (
            <div
              key={step}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div style={stepDot(step)}>{step}</div>
              <span
                className="hidden md:block"
                style={{
                  fontFamily: "var(--font-dm-mono, monospace)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.04em",
                  color: activeStep >= step ? C.white : C.muted,
                  transition: "color 0.3s",
                }}
              >
                {step === 1
                  ? "Upload"
                  : step === 2
                    ? "Add Tokens"
                    : "Customize"}
              </span>
              {step < 3 && (
                <div
                  className="hidden md:block"
                  style={{
                    width: 24,
                    height: 1,
                    background: "rgba(77,162,255,0.2)",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleDownload}
          disabled={!uploadedImage || isDownloading}
          className="btn-primary"
          style={{
            opacity: !uploadedImage || isDownloading ? 0.3 : 1,
            cursor: !uploadedImage || isDownloading ? "not-allowed" : "pointer",
            fontSize: "0.82rem",
            padding: "0.6rem 1.4rem",
          }}
        >
          {isDownloading ? "Exporting..." : "Download PFP ↓"}
        </button>
      </header>

      {/* ── Main ── */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "row",
          minHeight: "calc(100vh - 73px)",
        }}
      >
        {/* Left panel */}
        <aside
          className="s-left"
          style={{
            width: 360,
            flexShrink: 0,
            borderRight: "1px solid rgba(77,162,255,0.08)",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {/* Step 1 */}
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid rgba(77,162,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <div style={stepDot(1)}>1</div>
              <span
                style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  letterSpacing: "0.02em",
                }}
              >
                Upload Your PFP
              </span>
            </div>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              style={{
                borderRadius: "1rem",
                border: `2px dashed ${isDragging ? C.blue : "rgba(77,162,255,0.25)"}`,
                background: isDragging
                  ? "rgba(77,162,255,0.08)"
                  : "transparent",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(f);
                }}
              />
              {uploadedImage ? (
                <div
                  style={{
                    position: "relative",
                    height: 176,
                    borderRadius: "0.75rem",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(2,11,24,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-dm-mono, monospace)",
                        fontSize: "0.75rem",
                        color: C.white,
                      }}
                    >
                      Click to change
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    padding: "2.5rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: "rgba(77,162,255,0.1)",
                      border: "1px solid rgba(77,162,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.5rem",
                    }}
                  >
                    📸
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-syne, sans-serif)",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      Drop your image here
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-dm-mono, monospace)",
                        fontSize: "0.7rem",
                        color: C.muted,
                        marginTop: "0.25rem",
                      }}
                    >
                      PNG, JPG, WEBP · Max 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2 */}
          <div
            style={{
              padding: "1.5rem",
              borderBottom: "1px solid rgba(77,162,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.25rem",
              }}
            >
              <div style={stepDot(2)}>2</div>
              <span
                style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                Add Token Badges
              </span>
            </div>
            <p
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.65rem",
                color: C.muted,
                marginBottom: "1rem",
                marginLeft: "1.75rem",
              }}
            >
              Select all communities you hold. Drag badges freely on canvas.
            </p>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {MEME_TOKENS.map((token) => {
                const placed = isTokenPlaced(token.id);
                return (
                  <button
                    key={token.id}
                    className="s-token"
                    onClick={() => addBadge(token)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                      padding: "0.75rem",
                      borderRadius: "0.75rem",
                      border: `1px solid ${placed ? C.blue : "rgba(77,162,255,0.1)"}`,
                      background: placed
                        ? "rgba(77,162,255,0.1)"
                        : "transparent",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                      boxShadow: placed ? `0 0 16px ${token.glow}` : "none",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        overflow: "hidden",
                        flexShrink: 0,
                        outline: `2px solid ${placed ? token.accent : "rgba(77,162,255,0.2)"}`,
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
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-syne, sans-serif)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                          color: placed ? token.accent : C.white,
                        }}
                      >
                        {token.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-dm-mono, monospace)",
                          fontSize: "0.65rem",
                          color: C.muted,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {token.description}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: placed ? C.blue : "rgba(77,162,255,0.1)",
                        color: placed ? "#000" : C.muted,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        flexShrink: 0,
                      }}
                    >
                      {placed ? "✓" : "+"}
                    </div>
                  </button>
                );
              })}
            </div>

            {placedBadges.length > 0 && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  background: "rgba(77,162,255,0.05)",
                  border: "1px solid rgba(77,162,255,0.1)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: "0.65rem",
                    color: C.muted,
                    marginBottom: "0.5rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Active badges
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {placedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadgeId(badge.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.5rem",
                        border: `1px solid ${selectedBadgeId === badge.id ? badge.token.accent : "rgba(77,162,255,0.2)"}`,
                        background:
                          selectedBadgeId === badge.id
                            ? `${badge.token.accent}15`
                            : "transparent",
                        color: badge.token.accent,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <img
                        src={badge.token.src}
                        alt=""
                        style={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--font-dm-mono, monospace)",
                          fontSize: "0.6rem",
                          fontWeight: 500,
                        }}
                      >
                        {badge.token.label}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBadge(badge.id);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          color: badge.token.accent,
                          cursor: "pointer",
                          opacity: 0.5,
                          fontSize: "0.55rem",
                          padding: 0,
                          marginLeft: 2,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 3 */}
          <div
            style={{
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <div style={stepDot(3)}>3</div>
              <span
                style={{
                  fontFamily: "var(--font-syne, sans-serif)",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                }}
              >
                Customize
              </span>
            </div>

            {selectedBadge && (
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(77,162,255,0.15)",
                  background: "rgba(77,162,255,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <img
                    src={selectedBadge.token.src}
                    alt=""
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-dm-mono, monospace)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.04em",
                      color: selectedBadge.token.accent,
                    }}
                  >
                    {selectedBadge.token.label} — selected
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span style={sectionLabel}>Badge Size</span>
                  <span
                    style={{
                      fontFamily: "var(--font-dm-mono, monospace)",
                      fontSize: "0.68rem",
                      color: selectedBadge.token.accent,
                    }}
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
                    resizeBadge(selectedBadge.id, Number(e.target.value))
                  }
                  style={{
                    width: "100%",
                    accentColor: C.blue,
                    height: 6,
                    borderRadius: 4,
                  }}
                />
              </div>
            )}

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={sectionLabel}>Default Badge Size</span>
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: "0.68rem",
                    color: C.blue,
                  }}
                >
                  {defaultBadgeSize}%
                </span>
              </div>
              <input
                type="range"
                min={12}
                max={45}
                value={defaultBadgeSize}
                onChange={(e) => setDefaultBadgeSize(Number(e.target.value))}
                style={{
                  width: "100%",
                  accentColor: C.blue,
                  height: 6,
                  borderRadius: 4,
                }}
              />
            </div>

            <div>
              <span style={sectionLabel}>Overlay Effect</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {OVERLAYS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedOverlay(opt.id)}
                    style={chipBtn(selectedOverlay === opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={sectionLabel}>Border Style</span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {BORDERS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedBorder(opt.id)}
                    style={chipBtn(selectedBorder === opt.id)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Right panel */}
        <div
          className="s-right"
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem",
            gap: "2rem",
          }}
        >
          {/* Label */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              alignSelf: "flex-start",
            }}
          >
            <div style={{ width: 32, height: 1, background: C.blue }} />
            <span
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: C.blue,
              }}
            >
              Live Preview
            </span>
            {placedBadges.length > 0 && (
              <>
                <div style={{ display: "flex" }}>
                  {placedBadges.map((b, i) => (
                    <img
                      key={b.id}
                      src={b.token.src}
                      alt={b.token.label}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: `2px solid ${C.dark}`,
                        marginLeft: i > 0 ? -6 : 0,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: "0.65rem",
                    color: C.muted,
                  }}
                >
                  {placedBadges.length} badge
                  {placedBadges.length !== 1 ? "s" : ""} · drag to reposition
                </span>
              </>
            )}
          </div>

          {/* Preview canvas */}
          <div
            ref={previewRef}
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 480,
              aspectRatio: "1/1",
              borderRadius: "1rem",
              overflow: "hidden",
              userSelect: "none",
              ...currentBorder?.style,
            }}
            onClick={(e) => {
              if (
                e.target === e.currentTarget ||
                (e.target as HTMLElement).tagName === "IMG"
              )
                setSelectedBadgeId(null);
            }}
          >
            {uploadedImage ? (
              <>
                <img
                  src={uploadedImage}
                  alt="PFP Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                />
                {selectedOverlay !== "none" && (
                  <div
                    className={`absolute inset-0 pointer-events-none ${overlayClass}`}
                  />
                )}
                {placedBadges.map((badge) => (
                  <DraggableBadge
                    key={badge.id}
                    badge={badge}
                    isSelected={selectedBadgeId === badge.id}
                    onSelect={() => setSelectedBadgeId(badge.id)}
                    onMove={(x, y) => moveBadge(badge.id, x, y)}
                    onRemove={() => removeBadge(badge.id)}
                    containerRef={previewRef as React.RefObject<HTMLDivElement>}
                  />
                ))}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,0.03) 0%,transparent 50%)",
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : (
              <div
                className="glass"
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                }}
              >
                <div style={{ fontSize: "3.5rem", opacity: 0.3 }}>🖼️</div>
                <p
                  style={{
                    fontFamily: "var(--font-dm-mono, monospace)",
                    fontSize: "0.75rem",
                    color: C.muted,
                    textAlign: "center",
                    padding: "0 2rem",
                  }}
                >
                  Upload your photo to see the preview here
                </p>
              </div>
            )}
          </div>

          {uploadedImage && placedBadges.length === 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                alignSelf: "flex-start",
              }}
            >
              <span>👈</span>
              <span
                style={{
                  fontFamily: "var(--font-dm-mono, monospace)",
                  fontSize: "0.68rem",
                  color: C.muted,
                }}
              >
                Select a token community from the left panel to add a badge
              </span>
            </div>
          )}

          {/* Info row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              alignSelf: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Export size", val: "1000 × 1000", color: C.white },
              { label: "Format", val: "PNG", color: C.white },
              {
                label: "Status",
                val: uploadedImage ? "Ready" : "Waiting",
                color: uploadedImage ? "#4ade80" : C.muted,
              },
              ...(placedBadges.length > 0
                ? [
                    {
                      label: "Badges",
                      val: `${placedBadges.length} token${placedBadges.length !== 1 ? "s" : ""}`,
                      color: C.blue,
                    },
                  ]
                : []),
            ].map(({ label, val, color }, i, arr) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-dm-mono, monospace)",
                      fontSize: "0.65rem",
                      color: C.muted,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {label}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-syne, sans-serif)",
                      fontWeight: 700,
                      fontSize: "0.875rem",
                      color,
                    }}
                  >
                    {val}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 1,
                      height: 32,
                      background: "rgba(77,162,255,0.15)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Download */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              alignSelf: "flex-start",
            }}
          >
            <button
              onClick={handleDownload}
              disabled={!uploadedImage || isDownloading}
              className="btn-primary"
              style={{
                opacity: !uploadedImage || isDownloading ? 0.3 : 1,
                cursor:
                  !uploadedImage || isDownloading ? "not-allowed" : "pointer",
                fontSize: "1rem",
                padding: "1rem 2rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {isDownloading ? (
                <>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "2px solid #000",
                      borderTopColor: "transparent",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Exporting...
                </>
              ) : (
                "Download PFP ↓"
              )}
            </button>
            <span
              style={{
                fontFamily: "var(--font-dm-mono, monospace)",
                fontSize: "0.68rem",
                color: C.muted,
              }}
            >
              Mint onchain — coming soon
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}

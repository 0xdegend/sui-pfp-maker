"use client";

import { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MemeToken, PlacedBadge } from "../types";
import StudioHeader from "./components/StudioHeader";
import LeftPanel from "./components/LeftPanel";
import PreviewPanel from "./components/PreviewPanel";

gsap.registerPlugin(useGSAP);

export default function StudioPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [placedBadges, setPlacedBadges] = useState<PlacedBadge[]>([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [selectedOverlay, setSelectedOverlay] = useState("none");
  const [selectedBorder, setSelectedBorder] = useState("none");
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [defaultBadgeSize, setDefaultBadgeSize] = useState(25);

  const selectedBadge =
    placedBadges.find((b) => b.id === selectedBadgeId) ?? null;

  // ─── GSAP entrance ────────────────────────────────────────────────────────

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

  // ─── File handling ────────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setActiveStep(2);
    };
    reader.readAsDataURL(file);
  }, []);

  // ─── Badge actions ────────────────────────────────────────────────────────

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

  // ─── Canvas export ────────────────────────────────────────────────────────

  const handleDownload = async () => {
    if (!uploadedImage) return;
    setIsDownloading(true);

    const canvas = canvasRef.current!;
    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Base image — cover crop to square
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

    // Overlay
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

    // Border
    if (selectedBorder !== "none") {
      ctx.strokeStyle = selectedBorder === "gold" ? "#f59e0b" : "#4da2ff";
      ctx.lineWidth = 18;
      ctx.strokeRect(9, 9, size - 18, size - 18);
    }

    // All badges
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

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#020b18] text-[#eef5ff] font-syne overflow-x-hidden"
    >
      <canvas ref={canvasRef} className="hidden" />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#020b18_0%,#050f1f_50%,#020b18_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(77,162,255,0.12),transparent)]" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <StudioHeader
        activeStep={activeStep}
        isDownloading={isDownloading}
        uploadedImage={uploadedImage}
        onDownload={handleDownload}
      />

      <main className="relative z-10 flex min-h-[calc(100vh-73px)]">
        <LeftPanel
          activeStep={activeStep}
          uploadedImage={uploadedImage}
          isDraggingFile={isDraggingFile}
          placedBadges={placedBadges}
          selectedBadgeId={selectedBadgeId}
          selectedBadge={selectedBadge}
          selectedOverlay={selectedOverlay}
          selectedBorder={selectedBorder}
          defaultBadgeSize={defaultBadgeSize}
          onFile={handleFile}
          onDragOver={() => setIsDraggingFile(true)}
          onDragLeave={() => setIsDraggingFile(false)}
          onAddBadge={addBadge}
          onRemoveBadge={removeBadge}
          onSelectBadge={setSelectedBadgeId}
          onResizeBadge={resizeBadge}
          onSetOverlay={setSelectedOverlay}
          onSetBorder={setSelectedBorder}
          onSetDefaultSize={setDefaultBadgeSize}
        />

        <PreviewPanel
          uploadedImage={uploadedImage}
          placedBadges={placedBadges}
          selectedBadgeId={selectedBadgeId}
          selectedOverlay={selectedOverlay}
          selectedBorder={selectedBorder}
          isDownloading={isDownloading}
          onSelectBadge={setSelectedBadgeId}
          onDeselectBadge={() => setSelectedBadgeId(null)}
          onMoveBadge={moveBadge}
          onRemoveBadge={removeBadge}
          onDownload={handleDownload}
          previewRef={previewRef as React.RefObject<HTMLDivElement>}
        />
      </main>
    </div>
  );
}

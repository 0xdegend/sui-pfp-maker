"use client";

import { useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MemeToken, PlacedBadge, TextSticker } from "../types";
import { MEME_FRAMES, STUDIO_BACKGROUNDS } from "../data";
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [placedBadges, setPlacedBadges] = useState<PlacedBadge[]>([]);
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);
  const [defaultBadgeSize, setDefaultBadgeSize] = useState(25);
  const [selectedOverlay, setSelectedOverlay] = useState("none");
  const [selectedBorder, setSelectedBorder] = useState("none");
  const [selectedFrame, setSelectedFrame] = useState("none");
  const [selectedBackground, setSelectedBackground] = useState("original");
  const [stickers, setStickers] = useState<TextSticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(
    null,
  );

  const selectedBadge =
    placedBadges.find((b) => b.id === selectedBadgeId) ?? null;
  const selectedSticker =
    stickers.find((s) => s.id === selectedStickerId) ?? null;
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
  const addSticker = (text: string) => {
    const id = `sticker-${Date.now()}`;
    const offset = stickers.length * 5;
    const newSticker: TextSticker = {
      id,
      text,
      x: Math.min(50, 20 + offset),
      y: Math.min(50, 20 + offset),
      fontSize: 72,
      color: "#ffffff",
      fontWeight: "bold",
      rotation: 0,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(id);
    setActiveStep(3);
  };
  const removeSticker = (id: string) => {
    setStickers((p) => p.filter((s) => s.id !== id));
    if (selectedStickerId === id) setSelectedStickerId(null);
  };
  const moveSticker = (id: string, x: number, y: number) =>
    setStickers((p) => p.map((s) => (s.id === id ? { ...s, x, y } : s)));
  const updateSticker = (id: string, updates: Partial<TextSticker>) =>
    setStickers((p) => p.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  const handleDownload = async () => {
    if (!uploadedImage) return;
    setIsDownloading(true);
    const canvas = canvasRef.current!;
    const size = 1000;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const bg = STUDIO_BACKGROUNDS.find((b) => b.id === selectedBackground);
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
    if (bg && bg.type !== "original") {
      ctx.globalCompositeOperation = "multiply";
      if (bg.type === "solid") {
        ctx.fillStyle = bg.value;
        ctx.fillRect(0, 0, size, size);
      } else if (bg.type === "gradient") {
        const stops = bg.value.match(/#[0-9a-fA-F]{6}/g) ?? [
          "#020b18",
          "#0a1628",
        ];
        let grad: CanvasGradient;
        if (bg.value.startsWith("radial")) {
          grad = ctx.createRadialGradient(
            size / 2,
            size * 0.4,
            0,
            size / 2,
            size / 2,
            size * 0.75,
          );
        } else if (bg.value.includes("180deg")) {
          grad = ctx.createLinearGradient(0, 0, 0, size);
        } else {
          grad = ctx.createLinearGradient(0, 0, size, size);
        }
        stops.forEach((color, i) =>
          grad.addColorStop(i / Math.max(stops.length - 1, 1), color),
        );
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
      }
      ctx.globalCompositeOperation = "source-over";
    }
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
          // object-cover: scale so the shorter side fills the circle diameter
          const r = px / 2 - 6;
          const d = r * 2;
          const scale = Math.max(d / img.width, d / img.height);
          const sw = img.width * scale;
          const sh = img.height * scale;
          const sx = bx + px / 2 - sw / 2;
          const sy = by + px / 2 - sh / 2;
          ctx.drawImage(img, sx, sy, sw, sh);
          ctx.restore();
          res();
        };
        img.src = badge.token.src;
      });
    }
    for (const sticker of stickers) {
      const x = (sticker.x / 100) * size;
      const y = (sticker.y / 100) * size;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((sticker.rotation * Math.PI) / 180);
      // Use top baseline so position matches preview (text renders downward from y)
      ctx.textBaseline = "top";
      ctx.font = `${sticker.fontWeight} ${sticker.fontSize}px sans-serif`;
      ctx.fillStyle = sticker.color;
      ctx.shadowColor = "rgba(0,0,0,0.85)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillText(sticker.text, 0, 0);
      ctx.restore();
    }

    // 6. Frame SVG
    const frame = MEME_FRAMES.find((f) => f.id === selectedFrame);
    if (frame && frame.svgPattern) {
      await new Promise<void>((res) => {
        const svgBlob = new Blob(
          [
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">${frame.svgPattern}</svg>`,
          ],
          { type: "image/svg+xml" },
        );
        const url = URL.createObjectURL(svgBlob);
        const img = new window.Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          URL.revokeObjectURL(url);
          res();
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          res();
        };
        img.src = url;
      });
    }

    // 7. Border
    if (selectedBorder !== "none") {
      ctx.strokeStyle = selectedBorder === "gold" ? "#f59e0b" : "#4da2ff";
      ctx.lineWidth = 18;
      ctx.strokeRect(9, 9, size - 18, size - 18);
    }

    const link = document.createElement("a");
    link.download = `suipfp-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setIsDownloading(false);
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen bg-[#020b18] text-[#eef5ff] font-syne overflow-x-hidden"
    >
      <canvas ref={canvasRef} className="hidden" />
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
          selectedFrame={selectedFrame}
          selectedBackground={selectedBackground}
          stickers={stickers}
          selectedStickerId={selectedStickerId}
          selectedSticker={selectedSticker}
          onFile={handleFile}
          onDragOver={() => setIsDraggingFile(true)}
          onDragLeave={() => setIsDraggingFile(false)}
          onAddBadge={addBadge}
          onRemoveBadge={removeBadge}
          onSelectBadge={(id) => setSelectedBadgeId(id === "" ? null : id)}
          onResizeBadge={resizeBadge}
          onSetOverlay={setSelectedOverlay}
          onSetBorder={setSelectedBorder}
          onSetDefaultSize={setDefaultBadgeSize}
          onSetFrame={setSelectedFrame}
          onSetBackground={setSelectedBackground}
          onAddSticker={addSticker}
          onRemoveSticker={removeSticker}
          onSelectSticker={setSelectedStickerId}
          onUpdateSticker={updateSticker}
        />

        <PreviewPanel
          uploadedImage={uploadedImage}
          placedBadges={placedBadges}
          selectedBadgeId={selectedBadgeId}
          selectedOverlay={selectedOverlay}
          selectedBorder={selectedBorder}
          selectedFrame={selectedFrame}
          selectedBackground={selectedBackground}
          stickers={stickers}
          selectedStickerId={selectedStickerId}
          isDownloading={isDownloading}
          onSelectBadge={(id) => setSelectedBadgeId(id === "" ? null : id)}
          onDeselectBadge={() => {
            setSelectedBadgeId(null);
            setSelectedStickerId(null);
          }}
          onMoveBadge={moveBadge}
          onRemoveBadge={removeBadge}
          onSelectSticker={setSelectedStickerId}
          onMoveSticker={moveSticker}
          onRemoveSticker={removeSticker}
          onDownload={handleDownload}
          previewRef={previewRef as React.RefObject<HTMLDivElement>}
        />
      </main>
    </div>
  );
}

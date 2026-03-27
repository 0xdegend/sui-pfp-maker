"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { analyzeImage } from "@/app/lib/imageAnalyzer";
import { resolveRecipe, suggestTags } from "@/app/lib/styleEngine";
import { compositeImage } from "@/app/lib/canvasCompositor";
import {
  ALL_VIBE_TAGS,
  TAG_ICONS,
  TAG_DESCRIPTIONS,
  type VibeTag,
  type AutoGenState,
} from "@/app/types/autogen";
import { MEME_TOKENS, PRESET_STICKERS } from "@/app/data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AutoGenPageProps {
  /** Called when user wants to open the full manual editor with the generated result */
  onOpenManualEditor?: (imageDataUrl: string) => void;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

const clsx = (...args: (string | undefined | null | false)[]) =>
  args.filter(Boolean).join(" ");

const CANVAS_SIZE = 1000;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });

async function drawCommunityBadges(
  ctx: CanvasRenderingContext2D,
  communityIds: string[],
) {
  const tokens = MEME_TOKENS.filter((token) => communityIds.includes(token.id));
  if (tokens.length === 0) return;

  const count = Math.min(tokens.length, 4);
  const baseSize = count >= 3 ? 138 : 156;
  const gap = 16;
  const startX = CANVAS_SIZE - baseSize - 24;
  const startY = 26;

  for (let i = 0; i < count; i += 1) {
    const token = tokens[i];
    const x = startX;
    const y = startY + i * (baseSize + gap);
    const cx = x + baseSize / 2;
    const cy = y + baseSize / 2;
    const radius = baseSize / 2;

    ctx.save();
    ctx.shadowColor = token.glow;
    ctx.shadowBlur = 30;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(2,11,24,0.9)";
    ctx.fill();
    ctx.strokeStyle = token.accent;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.restore();

    try {
      const img = await loadImage(token.src);
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 6, 0, Math.PI * 2);
      ctx.clip();
      const targetDiameter = (radius - 6) * 2;
      const scale = Math.max(targetDiameter / img.width, targetDiameter / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
      ctx.restore();
    } catch {
      // Skip broken token images without failing generation.
    }
  }
}

function drawCustomTexts(ctx: CanvasRenderingContext2D, texts: string[]) {
  if (texts.length === 0) return;

  const limitedTexts = texts.slice(0, 3);
  limitedTexts.forEach((rawText, index) => {
    const text = rawText.trim().toUpperCase();
    if (!text) return;
    const y = CANVAS_SIZE - 170 - index * 80;
    const fontSize = text.length > 18 ? 54 : text.length > 10 ? 64 : 72;
    const rotation = index % 2 === 0 ? -0.04 : 0.04;

    ctx.save();
    ctx.translate(CANVAS_SIZE / 2, y);
    ctx.rotate(rotation);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.lineWidth = Math.max(6, Math.round(fontSize * 0.1));
    ctx.strokeStyle = "rgba(0, 0, 0, 0.78)";
    ctx.fillStyle = index === 0 ? "#ffffff" : "#a8d4ff";
    ctx.strokeText(text, 0, 0);
    ctx.fillText(text, 0, 0);
    ctx.restore();
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function StepIndicator({
  step,
  label,
  active,
  done,
}: {
  step: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  return (
    <div
      className={clsx(
        "flex items-center gap-2.5",
        !active && !done && "opacity-35",
      )}
    >
      <div
        className={clsx(
          "w-7 h-7 rounded-full flex items-center justify-center text-[0.7rem] font-mono-dm fw-700 transition-all duration-500",
          done
            ? "bg-[var(--sui-blue)] text-white"
            : active
              ? "border-2 border-[var(--sui-blue)] text-[var(--sui-blue)]"
              : "border border-white/20 text-white/30",
        )}
      >
        {done ? "✓" : step}
      </div>
      <span
        className={clsx(
          "font-mono-dm text-[0.7rem] tracking-[0.1em] uppercase transition-all duration-500",
          active
            ? "text-white"
            : done
              ? "text-[var(--sui-blue)]"
              : "text-white/30",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function UploadZone({
  onFile,
  isDragging,
  setIsDragging,
}: {
  onFile: (f: File) => void;
  isDragging: boolean;
  setIsDragging: (v: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) onFile(f);
  };
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={clsx(
        "relative flex flex-col items-center justify-center gap-6 rounded-3xl cursor-pointer transition-all duration-300 select-none",
        "border-2 border-dashed",
        isDragging
          ? "border-[var(--sui-blue)] bg-[var(--sui-blue)]/8 scale-[1.01]"
          : "border-white/12 hover:border-white/25 bg-white/[0.02] hover:bg-white/[0.035]",
      )}
      style={{ minHeight: 360 }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />

      {/* Icon */}
      <div className="relative">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(77,162,255,0.15) 0%, rgba(77,162,255,0.05) 100%)",
            border: "1px solid rgba(77,162,255,0.2)",
          }}
        >
          ⬆
        </div>
        <div
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[0.55rem] flex items-center justify-center"
          style={{ background: "var(--sui-blue)", color: "white" }}
        >
          ✦
        </div>
      </div>

      <div className="text-center">
        <p className="font-syne fw-700 text-[1.1rem] mb-1.5">
          {isDragging ? "Drop it here" : "Upload your PFP"}
        </p>
        <p className="font-mono-dm text-[0.72rem] text-white/35 tracking-wide">
          PNG, JPG, WEBP · Square recommended · Max 10MB
        </p>
      </div>

      {/* Suggested formats */}
      <div className="flex gap-2">
        {["Twitter PFP", "Discord Avatar", "NFT Portrait"].map((t) => (
          <span
            key={t}
            className="font-mono-dm text-[0.62rem] px-2.5 py-1 rounded-full text-white/30"
            style={{ border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function VibeTagButton({
  tag,
  selected,
  suggested,
  onToggle,
}: {
  tag: VibeTag;
  selected: boolean;
  suggested: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={clsx(
        "relative flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all duration-200 active:scale-[0.97]",
        selected ? "scale-[1.02]" : "hover:scale-[1.01]",
      )}
      style={{
        background: selected
          ? "linear-gradient(135deg, rgba(77,162,255,0.18) 0%, rgba(77,162,255,0.06) 100%)"
          : "rgba(255,255,255,0.03)",
        border: selected
          ? "1px solid rgba(77,162,255,0.45)"
          : suggested
            ? "1px solid rgba(77,162,255,0.2)"
            : "1px solid rgba(255,255,255,0.07)",
        boxShadow: selected ? "0 0 24px rgba(77,162,255,0.15)" : "none",
      }}
    >
      {/* Icon */}
      <span
        className="text-[1.1rem] mt-0.5 shrink-0 transition-colors duration-200"
        style={{
          color: selected ? "var(--sui-blue)" : "rgba(255,255,255,0.4)",
        }}
      >
        {TAG_ICONS[tag]}
      </span>

      {/* Text */}
      <div className="min-w-0">
        <div
          className={clsx(
            "font-syne fw-700 text-[0.82rem] capitalize transition-colors duration-200",
            selected ? "text-white" : "text-white/70",
          )}
        >
          {tag}
        </div>
        <div className="font-mono-dm text-[0.62rem] text-white/30 mt-0.5 leading-tight">
          {TAG_DESCRIPTIONS[tag]}
        </div>
      </div>

      {/* Suggested badge */}
      {suggested && !selected && (
        <span
          className="absolute top-2 right-2 font-mono-dm text-[0.55rem] tracking-wider px-1.5 py-0.5 rounded"
          style={{
            background: "rgba(77,162,255,0.15)",
            color: "var(--sui-blue)",
            border: "1px solid rgba(77,162,255,0.25)",
          }}
        >
          FOR YOU
        </span>
      )}

      {/* Selected checkmark */}
      {selected && (
        <div
          className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-[0.55rem]"
          style={{ background: "var(--sui-blue)", color: "white" }}
        >
          ✓
        </div>
      )}
    </button>
  );
}

function GeneratingAnimation() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      {/* Spinner ring */}
      <div className="relative w-20 h-20">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid rgba(77,162,255,0.1)",
          }}
        />
        <div
          className="absolute inset-0 rounded-full animate-spin"
          style={{
            border: "2px solid transparent",
            borderTopColor: "var(--sui-blue)",
            borderRightColor: "rgba(77,162,255,0.3)",
          }}
        />
        <div
          className="absolute inset-2 rounded-full animate-pulse"
          style={{
            background:
              "radial-gradient(circle, rgba(77,162,255,0.15) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-xl">
          ✦
        </div>
      </div>

      <div className="text-center">
        <p className="font-syne fw-700 text-[1rem] mb-1">Generating your PFP</p>
        <p className="font-mono-dm text-[0.72rem] text-white/35 tracking-wide">
          Analyzing colors · Applying effects · Compositing layers
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex flex-col gap-2 w-48">
        {[
          "Color analysis",
          "Style recipe",
          "Canvas render",
          "Final polish",
        ].map((s, i) => (
          <div key={s} className="flex items-center gap-2.5">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{
                background: "var(--sui-blue)",
                animationDelay: `${i * 0.3}s`,
                opacity: 0.6 + i * 0.1,
              }}
            />
            <span className="font-mono-dm text-[0.65rem] text-white/30 tracking-wider">
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BeforeAfterSlider({
  before,
  after,
}: {
  before: string;
  after: string;
}) {
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = Math.max(
      0,
      Math.min(100, ((clientX - rect.left) / rect.width) * 100),
    );
    setPos(pct);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      updatePos(x);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove as EventListener);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove as EventListener);
      window.removeEventListener("touchend", onUp);
    };
  }, [updatePos]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl overflow-hidden cursor-ew-resize select-none"
      style={{ aspectRatio: "1", width: "100%" }}
      onMouseDown={(e) => {
        dragging.current = true;
        updatePos(e.clientX);
      }}
      onTouchStart={(e) => {
        dragging.current = true;
        updatePos(e.touches[0].clientX);
      }}
    >
      {/* After (full) */}
      <img
        src={after}
        alt="After"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <img src={before} alt="Before" className="w-full h-full object-cover" />
      </div>

      {/* Divider */}
      <div
        className="absolute top-0 bottom-0 w-px"
        style={{
          left: `${pos}%`,
          background: "white",
          boxShadow: "0 0 12px rgba(255,255,255,0.6)",
        }}
      />
      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center"
        style={{
          left: `${pos}%`,
          background: "white",
          boxShadow: "0 2px 16px rgba(0,0,0,0.4)",
        }}
      >
        <span className="text-[0.6rem] text-black">⟺</span>
      </div>

      {/* Labels */}
      <div className="absolute bottom-3 left-3">
        <span
          className="font-mono-dm text-[0.6rem] px-2 py-1 rounded text-white/70"
          style={{ background: "rgba(0,0,0,0.6)" }}
        >
          BEFORE
        </span>
      </div>
      <div className="absolute bottom-3 right-3">
        <span
          className="font-mono-dm text-[0.6rem] px-2 py-1 rounded"
          style={{ background: "rgba(77,162,255,0.8)", color: "white" }}
        >
          AFTER
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AutoGenPage({ onOpenManualEditor }: AutoGenPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showBefore, setShowBefore] = useState(false);
  const [customTextInput, setCustomTextInput] = useState("");

  const [state, setState] = useState<AutoGenState>({
    step: 1,
    uploadedImage: null,
    analysis: null,
    selectedTags: [],
    selectedCommunities: [],
    customTexts: [],
    suggestedTags: [],
    recipe: null,
    resultDataUrl: null,
    isGenerating: false,
    generationSeed: 0,
    showBeforeAfter: false,
  });

  const updateState = useCallback((patch: Partial<AutoGenState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  // Step 1 → image uploaded
  const handleFile = useCallback(
    async (file: File) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        const analysis = await analyzeImage(dataUrl);
        const suggested = suggestTags(analysis);
        updateState({
          uploadedImage: dataUrl,
          analysis,
          suggestedTags: suggested,
          selectedTags: suggested.slice(0, 2), // pre-select top 2
          selectedCommunities: [],
          customTexts: [],
          step: 2,
        });
      };
      reader.readAsDataURL(file);
    },
    [updateState],
  );

  // Generate
  const generate = useCallback(
    async (
      tags: VibeTag[],
      seed: number,
      selectedCommunities = state.selectedCommunities,
      customTexts = state.customTexts,
      analysis = state.analysis,
      img = state.uploadedImage,
    ) => {
      if (!img || !analysis || !canvasRef.current) return;
      updateState({ isGenerating: true });

      // Small async gap so React renders the loading state first
      await new Promise((r) => requestAnimationFrame(() => setTimeout(r, 50)));

      const recipe = resolveRecipe(
        tags.length > 0 ? tags : state.suggestedTags,
        analysis,
        seed,
      );
      await compositeImage({
        imageUrl: img,
        recipe,
        canvas: canvasRef.current,
      });
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        await drawCommunityBadges(ctx, selectedCommunities);
        drawCustomTexts(ctx, customTexts);
      }
      const resultDataUrl = canvasRef.current.toDataURL("image/png");

      updateState({
        recipe,
        resultDataUrl,
        isGenerating: false,
        generationSeed: seed,
        step: 3,
      });
    },
    [
      state.analysis,
      state.customTexts,
      state.selectedCommunities,
      state.uploadedImage,
      state.suggestedTags,
      updateState,
    ],
  );

  const handleGenerate = () =>
    generate(state.selectedTags, state.generationSeed);
  const handleRegenerate = () =>
    generate(state.selectedTags, state.generationSeed + 1);

  const toggleTag = (tag: VibeTag) => {
    updateState({
      selectedTags: state.selectedTags.includes(tag)
        ? state.selectedTags.filter((t) => t !== tag)
        : state.selectedTags.length < 3
          ? [...state.selectedTags, tag]
          : [state.selectedTags[1], state.selectedTags[2], tag], // rolling window of 3
    });
  };

  const toggleCommunity = (communityId: string) => {
    updateState({
      selectedCommunities: state.selectedCommunities.includes(communityId)
        ? state.selectedCommunities.filter((id) => id !== communityId)
        : state.selectedCommunities.length < 4
          ? [...state.selectedCommunities, communityId]
          : [...state.selectedCommunities.slice(1), communityId],
    });
  };

  const addCustomText = (value: string) => {
    const cleaned = value.trim().toUpperCase();
    if (!cleaned) return;
    if (state.customTexts.includes(cleaned)) {
      setCustomTextInput("");
      return;
    }
    updateState({
      customTexts:
        state.customTexts.length < 3
          ? [...state.customTexts, cleaned]
          : [...state.customTexts.slice(1), cleaned],
    });
    setCustomTextInput("");
  };

  const removeCustomText = (text: string) => {
    updateState({
      customTexts: state.customTexts.filter((item) => item !== text),
    });
  };

  const handleDownload = () => {
    if (!state.resultDataUrl) return;
    const a = document.createElement("a");
    a.download = `suipfp-${Date.now()}.png`;
    a.href = state.resultDataUrl;
    a.click();
  };

  const reset = () => {
    setState({
      step: 1,
      uploadedImage: null,
      analysis: null,
      selectedTags: [],
      selectedCommunities: [],
      customTexts: [],
      suggestedTags: [],
      recipe: null,
      resultDataUrl: null,
      isGenerating: false,
      generationSeed: 0,
      showBeforeAfter: false,
    });
    setShowBefore(false);
    setCustomTextInput("");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      className="min-h-screen bg-[#020b18] text-[#eef5ff] font-syne overflow-x-hidden"
      style={{ fontFamily: "'Syne', sans-serif" }}
    >
      {/* Hidden canvas for render */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#020b18_0%,#050f1f_50%,#020b18_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(77,162,255,0.1),transparent)]" />
      </div>

      {/* Header */}
      <header
        className="relative z-10 flex items-center justify-between px-8 py-5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-4">
          <div className="font-syne fw-800 text-[1.1rem] tracking-tight">
            sui<span style={{ color: "var(--sui-blue)" }}>pfp</span>
          </div>
          <div
            className="h-4 w-px"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />
          <span
            className="font-mono-dm text-[0.65rem] tracking-[0.15em] uppercase px-2 py-1 rounded-full"
            style={{
              background: "rgba(77,162,255,0.1)",
              color: "var(--sui-blue)",
              border: "1px solid rgba(77,162,255,0.2)",
            }}
          >
            Auto Generate
          </span>
        </div>

        {/* Steps */}
        <div className="hidden md:flex items-center gap-6">
          <StepIndicator
            step={1}
            label="Upload"
            active={state.step === 1}
            done={state.step > 1}
          />
          <div className="w-8 h-px bg-white/10" />
          <StepIndicator
            step={2}
            label="Pick Vibe"
            active={state.step === 2}
            done={state.step > 2}
          />
          <div className="w-8 h-px bg-white/10" />
          <StepIndicator
            step={3}
            label="Result"
            active={state.step === 3}
            done={false}
          />
        </div>

        {state.step > 1 && (
          <button
            onClick={reset}
            className="font-mono-dm text-[0.7rem] text-white/30 hover:text-white/60 transition-colors tracking-wider"
          >
            ← Start over
          </button>
        )}
      </header>

      {/* Main content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* ── STEP 1: Upload ─────────────────────────────────────────────── */}
        {state.step === 1 && (
          <div className="max-w-lg mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-px"
                  style={{ background: "var(--sui-blue)" }}
                />
                <span
                  className="font-mono-dm text-[0.68rem] tracking-[0.15em] uppercase"
                  style={{ color: "var(--sui-blue)" }}
                >
                  Step 1 of 3
                </span>
                <div
                  className="w-8 h-px"
                  style={{ background: "var(--sui-blue)" }}
                />
              </div>
              <h1 className="font-syne fw-800 text-[2.2rem] leading-[1.15] mb-3">
                Drop your PFP.
                <br />
                <span style={{ color: "var(--sui-blue)" }}>
                  We handle the rest.
                </span>
              </h1>
              <p className="font-mono-dm text-[0.8rem] text-white/35 leading-relaxed max-w-sm mx-auto">
                Upload any profile picture and our engine will automatically
                enhance it with premium styling, lighting, and composition.
              </p>
            </div>
            <UploadZone
              onFile={handleFile}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />
          </div>
        )}

        {/* ── STEP 2: Tags + Preview ─────────────────────────────────────── */}
        {state.step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
            {/* Left: tag selector */}
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 mb-3">
                  <div
                    className="w-6 h-px"
                    style={{ background: "var(--sui-blue)" }}
                  />
                  <span
                    className="font-mono-dm text-[0.65rem] tracking-[0.15em] uppercase"
                    style={{ color: "var(--sui-blue)" }}
                  >
                    Step 2 · Pick your vibe
                  </span>
                </div>
                <h2 className="font-syne fw-800 text-[1.8rem] leading-tight mb-2">
                  What&apos;s the energy?
                </h2>
                <p className="font-mono-dm text-[0.75rem] text-white/35">
                  Select up to 3 tags — we&apos;ll blend them into your final
                  look.
                  {state.suggestedTags.length > 0 &&
                    " AI-suggested tags are highlighted."}
                </p>
              </div>

              {/* Tag grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-8">
                {ALL_VIBE_TAGS.map((tag) => (
                  <VibeTagButton
                    key={tag}
                    tag={tag}
                    selected={state.selectedTags.includes(tag)}
                    suggested={state.suggestedTags.includes(tag)}
                    onToggle={() => toggleTag(tag)}
                  />
                ))}
              </div>

              {/* Selected summary */}
              <div className="flex items-center gap-3 flex-wrap mb-6">
                <span className="font-mono-dm text-[0.68rem] text-white/30 tracking-wider">
                  Selected:
                </span>
                {state.selectedTags.length === 0 ? (
                  <span className="font-mono-dm text-[0.68rem] text-white/20 italic">
                    None — we&apos;ll auto-pick
                  </span>
                ) : (
                  state.selectedTags.map((t) => (
                    <span
                      key={t}
                      className="font-mono-dm text-[0.65rem] px-2.5 py-1 rounded-full capitalize"
                      style={{
                        background: "rgba(77,162,255,0.12)",
                        color: "var(--sui-blue)",
                        border: "1px solid rgba(77,162,255,0.25)",
                      }}
                    >
                      {TAG_ICONS[t]} {t}
                    </span>
                  ))
                )}
              </div>

              <div
                className="mb-6 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="font-mono-dm text-[0.64rem] text-white/35 uppercase tracking-[0.14em] mb-3">
                  Meme Communities (optional)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MEME_TOKENS.map((token) => {
                    const isSelected = state.selectedCommunities.includes(token.id);
                    return (
                      <button
                        key={token.id}
                        onClick={() => toggleCommunity(token.id)}
                        className={clsx(
                          "flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all duration-200 border",
                          isSelected ? "scale-[1.01]" : "hover:scale-[1.01]",
                        )}
                        style={{
                          borderColor: isSelected
                            ? token.accent
                            : "rgba(255,255,255,0.12)",
                          background: isSelected
                            ? "rgba(77,162,255,0.12)"
                            : "rgba(255,255,255,0.02)",
                        }}
                      >
                        <img
                          src={token.src}
                          alt={token.label}
                          className="w-8 h-8 rounded-full object-cover"
                          style={{
                            border: `1px solid ${isSelected ? token.accent : "rgba(255,255,255,0.2)"}`,
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-syne fw-700 text-[0.78rem]">
                            {token.label}
                          </div>
                          <div className="font-mono-dm text-[0.58rem] text-white/35 truncate">
                            {token.description}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                className="mb-8 rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="font-mono-dm text-[0.64rem] text-white/35 uppercase tracking-[0.14em] mb-3">
                  Text on PFP (optional)
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTextInput}
                    onChange={(e) => setCustomTextInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addCustomText(customTextInput);
                    }}
                    placeholder="TYPE SOMETHING..."
                    maxLength={24}
                    className="flex-1 bg-[rgba(77,162,255,0.05)] border border-[rgba(77,162,255,0.2)] rounded-lg px-3 py-2 font-mono-dm text-[0.72rem] text-[#eef5ff] placeholder:text-white/25 focus:outline-none focus:border-(--sui-blue)"
                  />
                  <button
                    onClick={() => addCustomText(customTextInput)}
                    className="px-3 py-2 rounded-lg bg-[#4da2ff] text-black font-mono-dm text-[0.72rem] fw-700 hover:bg-[#6fbbff] transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {PRESET_STICKERS.slice(0, 10).map((text) => (
                    <button
                      key={text}
                      onClick={() => addCustomText(text)}
                      className="font-mono-dm text-[0.62rem] px-2 py-1 rounded-lg border border-[rgba(77,162,255,0.2)] text-[#4a6fa5] hover:border-[#4da2ff] hover:text-[#eef5ff] transition-colors"
                    >
                      {text}
                    </button>
                  ))}
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {state.customTexts.length === 0 ? (
                    <span className="font-mono-dm text-[0.62rem] text-white/25 italic">
                      No text added yet
                    </span>
                  ) : (
                    state.customTexts.map((text) => (
                      <button
                        key={text}
                        onClick={() => removeCustomText(text)}
                        className="font-mono-dm text-[0.62rem] px-2.5 py-1 rounded-full border"
                        style={{
                          borderColor: "rgba(77,162,255,0.3)",
                          color: "var(--sui-blue)",
                          background: "rgba(77,162,255,0.1)",
                        }}
                      >
                        {text} ✕
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleGenerate}
                className="relative w-full py-4 rounded-2xl font-syne fw-700 text-[1rem] tracking-wide overflow-hidden transition-all duration-200 active:scale-[0.99]"
                style={{
                  background:
                    "linear-gradient(135deg, var(--sui-blue) 0%, #1a56db 100%)",
                  boxShadow:
                    "0 0 32px rgba(77,162,255,0.3), 0 4px 16px rgba(0,0,0,0.3)",
                }}
              >
                <span className="relative z-10">Generate My PFP →</span>
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #5bb8ff 0%, var(--sui-blue) 100%)",
                  }}
                />
              </button>
            </div>

            {/* Right: live preview of uploaded image */}
            <div className="lg:sticky lg:top-8">
              <div className="font-mono-dm text-[0.65rem] text-white/25 tracking-wider mb-3 uppercase">
                Your PFP
              </div>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  aspectRatio: "1",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {state.uploadedImage && (
                  <img
                    src={state.uploadedImage}
                    alt="Uploaded"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Analysis readout */}
              {state.analysis && (
                <div
                  className="mt-4 p-4 rounded-xl"
                  style={{
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div className="font-mono-dm text-[0.62rem] text-white/25 tracking-wider mb-3 uppercase">
                    Image analysis
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {state.analysis.dominantColors.slice(0, 5).map((c, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            background: c,
                            border: "1px solid rgba(255,255,255,0.15)",
                          }}
                        />
                        <span className="font-mono-dm text-[0.58rem] text-white/25">
                          {c}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {[
                      [
                        "Brightness",
                        `${Math.round(state.analysis.brightness * 100)}%`,
                      ],
                      [
                        "Saturation",
                        `${Math.round(state.analysis.saturation * 100)}%`,
                      ],
                      ["Warmth", state.analysis.warmth > 0.5 ? "Warm" : "Cool"],
                      [
                        "Palette",
                        state.analysis.isMonochromatic ? "Mono" : "Multi",
                      ],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div className="font-mono-dm text-[0.58rem] text-white/20 mb-0.5">
                          {k}
                        </div>
                        <div className="font-mono-dm text-[0.68rem] text-white/50">
                          {v}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Result ─────────────────────────────────────────────── */}
        {state.step === 3 && (
          <div>
            {state.isGenerating ? (
              <GeneratingAnimation />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 items-start">
                {/* Left: result preview */}
                <div>
                  <div className="mb-5">
                    <div className="inline-flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-px"
                        style={{ background: "var(--sui-blue)" }}
                      />
                      <span
                        className="font-mono-dm text-[0.65rem] tracking-[0.15em] uppercase"
                        style={{ color: "var(--sui-blue)" }}
                      >
                        Result
                      </span>
                    </div>
                    <h2 className="font-syne fw-800 text-[1.8rem] leading-tight">
                      Your new PFP is ready.
                    </h2>
                  </div>

                  {/* Before/After toggle */}
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => setShowBefore(false)}
                      className={clsx(
                        "font-mono-dm text-[0.68rem] px-3.5 py-2 rounded-xl transition-all",
                        !showBefore
                          ? "text-white"
                          : "text-white/35 hover:text-white/50",
                      )}
                      style={{
                        background: !showBefore
                          ? "rgba(77,162,255,0.15)"
                          : "rgba(255,255,255,0.04)",
                        border: !showBefore
                          ? "1px solid rgba(77,162,255,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      Slider compare
                    </button>
                    <button
                      onClick={() => setShowBefore(true)}
                      className={clsx(
                        "font-mono-dm text-[0.68rem] px-3.5 py-2 rounded-xl transition-all",
                        showBefore
                          ? "text-white"
                          : "text-white/35 hover:text-white/50",
                      )}
                      style={{
                        background: showBefore
                          ? "rgba(77,162,255,0.15)"
                          : "rgba(255,255,255,0.04)",
                        border: showBefore
                          ? "1px solid rgba(77,162,255,0.3)"
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      Side by side
                    </button>
                  </div>

                  {/* Image display */}
                  {!showBefore ? (
                    // Slider mode
                    state.resultDataUrl &&
                    state.uploadedImage && (
                      <BeforeAfterSlider
                        before={state.uploadedImage}
                        after={state.resultDataUrl}
                      />
                    )
                  ) : (
                    // Side-by-side mode
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="font-mono-dm text-[0.6rem] text-white/25 mb-2 tracking-wider">
                          BEFORE
                        </div>
                        <div
                          className="rounded-2xl overflow-hidden"
                          style={{ aspectRatio: "1" }}
                        >
                          <img
                            src={state.uploadedImage!}
                            alt="Before"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div
                          className="font-mono-dm text-[0.6rem] mb-2 tracking-wider"
                          style={{ color: "var(--sui-blue)" }}
                        >
                          AFTER
                        </div>
                        <div
                          className="rounded-2xl overflow-hidden"
                          style={{ aspectRatio: "1" }}
                        >
                          <img
                            src={state.resultDataUrl!}
                            alt="After"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: actions */}
                <div className="lg:sticky lg:top-8 flex flex-col gap-4">
                  {/* Applied style card */}
                  {state.recipe && (
                    <div
                      className="p-5 rounded-2xl"
                      style={{
                        background: "rgba(255,255,255,0.025)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div className="font-mono-dm text-[0.62rem] text-white/25 tracking-wider mb-3 uppercase">
                        Style applied
                      </div>
                      <div className="font-syne fw-700 text-[1rem] mb-1">
                        {state.recipe.label}
                      </div>
                      <div className="flex gap-2 flex-wrap mt-3">
                        {state.selectedTags.map((t) => (
                          <span
                            key={t}
                            className="font-mono-dm text-[0.62rem] px-2.5 py-1 rounded-full capitalize"
                            style={{
                              background: "rgba(77,162,255,0.1)",
                              color: "rgba(77,162,255,0.7)",
                              border: "1px solid rgba(77,162,255,0.2)",
                            }}
                          >
                            {TAG_ICONS[t]} {t}
                          </span>
                        ))}
                      </div>
                      {state.selectedCommunities.length > 0 && (
                        <div className="mt-3">
                          <div className="font-mono-dm text-[0.58rem] text-white/20 mb-1 uppercase tracking-wider">
                            Community tags
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {state.selectedCommunities
                              .map((id) =>
                                MEME_TOKENS.find((token) => token.id === id),
                              )
                              .filter((token): token is (typeof MEME_TOKENS)[number] =>
                                Boolean(token),
                              )
                              .map((token) => (
                                <span
                                  key={token.id}
                                  className="font-mono-dm text-[0.6rem] px-2 py-1 rounded-full"
                                  style={{
                                    background: "rgba(77,162,255,0.08)",
                                    color: token.accent,
                                    border: `1px solid ${token.accent}55`,
                                  }}
                                >
                                  {token.label}
                                </span>
                              ))}
                          </div>
                        </div>
                      )}
                      {state.customTexts.length > 0 && (
                        <div className="mt-3">
                          <div className="font-mono-dm text-[0.58rem] text-white/20 mb-1 uppercase tracking-wider">
                            Text overlays
                          </div>
                          <div className="flex gap-1.5 flex-wrap">
                            {state.customTexts.map((text) => (
                              <span
                                key={text}
                                className="font-mono-dm text-[0.6rem] px-2 py-1 rounded-full"
                                style={{
                                  background: "rgba(255,255,255,0.06)",
                                  color: "#cfe5ff",
                                  border: "1px solid rgba(255,255,255,0.14)",
                                }}
                              >
                                {text}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {[
                          ["Background", state.recipe.background.kind],
                          [
                            "Crop",
                            state.recipe.circularCrop ? "Circular" : "Square",
                          ],
                          [
                            "Border",
                            state.recipe.border
                              ? state.recipe.border.style
                              : "None",
                          ],
                          [
                            "Scale",
                            `${Math.round(state.recipe.subjectScale * 100)}%`,
                          ],
                        ].map(([k, v]) => (
                          <div key={k}>
                            <div className="font-mono-dm text-[0.58rem] text-white/20 mb-0.5 capitalize">
                              {k}
                            </div>
                            <div className="font-mono-dm text-[0.68rem] text-white/50 capitalize">
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action buttons */}
                  <button
                    onClick={handleDownload}
                    className="w-full py-4 rounded-2xl font-syne fw-700 text-[0.95rem] tracking-wide transition-all duration-200 active:scale-[0.99]"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--sui-blue) 0%, #1a56db 100%)",
                      boxShadow:
                        "0 0 32px rgba(77,162,255,0.25), 0 4px 16px rgba(0,0,0,0.3)",
                    }}
                  >
                    ↓ Download PFP
                  </button>

                  <button
                    onClick={handleRegenerate}
                    className="w-full py-3.5 rounded-2xl font-syne fw-600 text-[0.88rem] tracking-wide transition-all duration-200 hover:border-white/20 active:scale-[0.99]"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    ↻ Regenerate variant
                  </button>

                  <button
                    onClick={() => updateState({ step: 2 })}
                    className="w-full py-3.5 rounded-2xl font-syne fw-600 text-[0.88rem] tracking-wide transition-all duration-200 hover:border-white/20 active:scale-[0.99]"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    ← Change tags
                  </button>

                  {onOpenManualEditor && state.resultDataUrl && (
                    <button
                      onClick={() => onOpenManualEditor(state.resultDataUrl!)}
                      className="w-full py-3 rounded-2xl font-mono-dm text-[0.72rem] tracking-wider text-white/35 hover:text-white/55 transition-all duration-200"
                      style={{ border: "1px dashed rgba(255,255,255,0.1)" }}
                    >
                      ⚙ Open in manual editor
                    </button>
                  )}

                  {/* Social share hint */}
                  <div
                    className="p-4 rounded-xl text-center"
                    style={{
                      background: "rgba(77,162,255,0.05)",
                      border: "1px solid rgba(77,162,255,0.12)",
                    }}
                  >
                    <p className="font-mono-dm text-[0.65rem] text-white/30 leading-relaxed">
                      Tag{" "}
                      <span style={{ color: "var(--sui-blue)" }}>@suipfp</span>{" "}
                      when you set this as your avatar ✦
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

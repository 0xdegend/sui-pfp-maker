/**
 * canvasCompositor.ts
 * Takes a StyleRecipe + source image → renders a polished 1000×1000 canvas.
 * Every visual layer is deterministic from the recipe.
 */

import type {
  StyleRecipe,
  BackgroundType,
  GlowConfig,
  OverlayEffect,
  GradientStop,
} from "./styleEngine";

const SIZE = 1000;

// ---- Gradient builders ----

function buildLinearGradient(
  ctx: CanvasRenderingContext2D,
  stops: GradientStop[],
  angle = 135,
): CanvasGradient {
  const rad = (angle * Math.PI) / 180;
  const x1 = 0.5 - Math.cos(rad) * 0.5;
  const y1 = 0.5 - Math.sin(rad) * 0.5;
  const x2 = 0.5 + Math.cos(rad) * 0.5;
  const y2 = 0.5 + Math.sin(rad) * 0.5;
  const g = ctx.createLinearGradient(
    x1 * SIZE,
    y1 * SIZE,
    x2 * SIZE,
    y2 * SIZE,
  );
  stops.forEach(({ color, stop }) => g.addColorStop(stop, color));
  return g;
}

function buildRadialGradient(
  ctx: CanvasRenderingContext2D,
  stops: GradientStop[],
  cx = 0.5,
  cy = 0.42,
): CanvasGradient {
  const g = ctx.createRadialGradient(
    cx * SIZE,
    cy * SIZE,
    0,
    SIZE / 2,
    SIZE / 2,
    SIZE * 0.75,
  );
  stops.forEach(({ color, stop }) => g.addColorStop(stop, color));
  return g;
}

// ---- Background layer ----

function drawBackground(
  ctx: CanvasRenderingContext2D,
  bg: BackgroundType,
): void {
  ctx.save();
  if (bg.kind === "solid") {
    ctx.fillStyle = bg.color;
  } else if (bg.kind === "linear") {
    ctx.fillStyle = buildLinearGradient(ctx, bg.stops, bg.angle);
  } else if (bg.kind === "radial") {
    ctx.fillStyle = buildRadialGradient(ctx, bg.stops, bg.cx, bg.cy);
  } else if (bg.kind === "mesh") {
    // Base
    ctx.fillStyle = bg.base;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Accent blob top-left
    const g1 = ctx.createRadialGradient(
      SIZE * 0.2,
      SIZE * 0.2,
      0,
      SIZE * 0.2,
      SIZE * 0.2,
      SIZE * 0.55,
    );
    g1.addColorStop(0, bg.accent + "55");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, SIZE, SIZE);
    // Secondary blob bottom-right
    const g2 = ctx.createRadialGradient(
      SIZE * 0.8,
      SIZE * 0.8,
      0,
      SIZE * 0.8,
      SIZE * 0.8,
      SIZE * 0.5,
    );
    g2.addColorStop(0, bg.secondary + "44");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.restore();
    return;
  }
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.restore();
}

// ---- Glow layer ----

function drawGlows(ctx: CanvasRenderingContext2D, glows: GlowConfig[]): void {
  for (const glow of glows) {
    const cx = SIZE / 2 + ((glow.x ?? 0) / 100) * SIZE;
    const cy = SIZE / 2 + ((glow.y ?? 0) / 100) * SIZE;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, glow.radius);
    // Parse color to add alpha
    const col = glow.color;
    g.addColorStop(
      0,
      col +
        Math.round(glow.opacity * 255)
          .toString(16)
          .padStart(2, "0"),
    );
    g.addColorStop(
      0.4,
      col +
        Math.round(glow.opacity * 0.4 * 255)
          .toString(16)
          .padStart(2, "0"),
    );
    g.addColorStop(1, "transparent");
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.restore();
  }
}

// ---- Subject (PFP image) ----

async function drawSubject(
  ctx: CanvasRenderingContext2D,
  imgSrc: string,
  scale: number,
  yOffset: number,
  circular: boolean,
): Promise<void> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const diameter = SIZE * scale;
      const radius = diameter / 2;
      const cx = SIZE / 2;
      const cy = SIZE / 2 + (yOffset / 100) * SIZE;

      ctx.save();
      if (circular) {
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.clip();
      }
      // object-cover crop: scale so shorter side = diameter
      const srcMin = Math.min(img.width, img.height);
      const drawScale = diameter / srcMin;
      const dw = img.width * drawScale;
      const dh = img.height * drawScale;
      ctx.drawImage(img, cx - dw / 2, cy - dh / 2, dw, dh);
      ctx.restore();
      resolve();
    };
    img.src = imgSrc;
  });
}

// ---- Outer ring(s) ----

function drawRings(ctx: CanvasRenderingContext2D, recipe: StyleRecipe): void {
  const cx = SIZE / 2;
  const cy = SIZE / 2 + (recipe.subjectY / 100) * SIZE;
  const radius = (SIZE * recipe.subjectScale) / 2;

  if (recipe.outerRingColor) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 8, 0, Math.PI * 2);
    ctx.strokeStyle = recipe.outerRingColor;
    ctx.lineWidth = recipe.outerRingWidth ?? 2;
    if (recipe.border?.style === "glow" && recipe.border.glowColor) {
      ctx.shadowColor = recipe.border.glowColor;
      ctx.shadowBlur = recipe.border.glowBlur ?? 16;
    }
    ctx.stroke();
    ctx.restore();
  }

  // Double ring for luxury/collectible
  if (recipe.badgeRingColor) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius + 18, 0, Math.PI * 2);
    ctx.strokeStyle = recipe.badgeRingColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 8]);
    ctx.stroke();
    ctx.restore();
  }
}

// ---- Border (square canvas edge) ----

function drawBorder(ctx: CanvasRenderingContext2D, recipe: StyleRecipe): void {
  if (!recipe.border) return;
  const { color, width, style, glowColor, glowBlur } = recipe.border;
  ctx.save();
  if (style === "glow" && glowColor) {
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = glowBlur ?? 20;
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  if (style === "dashed") ctx.setLineDash([12, 8]);
  ctx.strokeRect(width / 2, width / 2, SIZE - width, SIZE - width);
  if (style === "double") {
    ctx.shadowBlur = 0;
    ctx.strokeStyle = color + "55";
    ctx.lineWidth = width * 2;
    ctx.strokeRect(
      width * 1.5,
      width * 1.5,
      SIZE - width * 3,
      SIZE - width * 3,
    );
  }
  ctx.restore();
}

// ---- Corner frame accents ----

function drawCornerFrame(
  ctx: CanvasRenderingContext2D,
  recipe: StyleRecipe,
): void {
  if (!recipe.frame) return;
  const { cornerColor, cornerSize } = recipe.frame;
  const s = cornerSize * SIZE;
  const m = 20; // margin from edge
  const corners = [
    { x: m, y: m, rx: 1, ry: 1 },
    { x: SIZE - m, y: m, rx: -1, ry: 1 },
    { x: m, y: SIZE - m, rx: 1, ry: -1 },
    { x: SIZE - m, y: SIZE - m, rx: -1, ry: -1 },
  ];
  ctx.save();
  ctx.strokeStyle = cornerColor;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "square";
  if (recipe.border?.style === "glow") {
    ctx.shadowColor = cornerColor;
    ctx.shadowBlur = 10;
  }
  for (const { x, y, rx, ry } of corners) {
    ctx.beginPath();
    ctx.moveTo(x + rx * s, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + ry * s);
    ctx.stroke();
  }
  ctx.restore();
}

// ---- Overlay effects ----

function drawOverlay(
  ctx: CanvasRenderingContext2D,
  effect: OverlayEffect,
): void {
  if (effect.kind === "none") return;
  ctx.save();

  if (effect.kind === "vignette") {
    const g = ctx.createRadialGradient(
      SIZE / 2,
      SIZE / 2,
      SIZE * 0.3,
      SIZE / 2,
      SIZE / 2,
      SIZE * 0.85,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, `rgba(0,0,0,${effect.opacity})`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
  } else if (effect.kind === "scanlines") {
    for (let y = 0; y < SIZE; y += 3) {
      ctx.fillStyle = `rgba(0,0,0,${effect.opacity})`;
      ctx.fillRect(0, y, SIZE, 1);
    }
  } else if (effect.kind === "grain") {
    // Pseudo-random noise via tiny rects
    const density = 0.08;
    for (let i = 0; i < SIZE * SIZE * density; i++) {
      const x = Math.random() * SIZE;
      const y = Math.random() * SIZE;
      const v = Math.random();
      ctx.fillStyle = `rgba(${v > 0.5 ? 255 : 0},${v > 0.5 ? 255 : 0},${v > 0.5 ? 255 : 0},${effect.opacity})`;
      ctx.fillRect(x, y, 1, 1);
    }
  } else if (effect.kind === "holographic") {
    const g = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    g.addColorStop(0, `rgba(103,232,249,${effect.opacity})`);
    g.addColorStop(0.25, `rgba(167,139,250,${effect.opacity})`);
    g.addColorStop(0.5, `rgba(52,211,153,${effect.opacity})`);
    g.addColorStop(0.75, `rgba(244,114,182,${effect.opacity})`);
    g.addColorStop(1, `rgba(103,232,249,${effect.opacity})`);
    ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SIZE, SIZE);
  } else if (effect.kind === "dust") {
    // Starfield dots
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * SIZE;
      const y = Math.random() * SIZE;
      const r = Math.random() * 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * effect.opacity})`;
      ctx.fill();
    }
  }
  ctx.restore();
}

// ===== MAIN COMPOSITOR =====

export interface CompositorOptions {
  imageUrl: string;
  recipe: StyleRecipe;
  canvas: HTMLCanvasElement;
}

export async function compositeImage({
  imageUrl,
  recipe,
  canvas,
}: CompositorOptions): Promise<void> {
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;

  // 1. Background
  drawBackground(ctx, recipe.background);

  // 2. Glows (behind subject)
  drawGlows(ctx, recipe.glows);

  // 3. Subject
  await drawSubject(
    ctx,
    imageUrl,
    recipe.subjectScale,
    recipe.subjectY,
    recipe.circularCrop,
  );

  // 4. Post-subject glows (soft light on top)
  const postGlows = recipe.glows.map((g) => ({
    ...g,
    opacity: g.opacity * 0.25,
  }));
  drawGlows(ctx, postGlows);

  // 5. Rings
  drawRings(ctx, recipe);

  // 6. Canvas-edge border
  drawBorder(ctx, recipe);

  // 7. Corner frame
  drawCornerFrame(ctx, recipe);

  // 8. Overlays (vignette, grain, etc.)
  for (const overlay of recipe.overlays) {
    drawOverlay(ctx, overlay);
  }
}

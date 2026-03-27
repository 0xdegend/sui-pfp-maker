export interface ImageAnalysis {
  dominantColors: string[]; // hex strings, most dominant first
  brightness: number; // 0–1
  saturation: number; // 0–1
  warmth: number; // 0–1 (0 = cool blues, 1 = warm reds/yellows)
  hasHighContrast: boolean;
  isMonochromatic: boolean;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

function rgbToHex({ r, g, b }: RGB): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const rn = r / 255,
    gn = g / 255,
    bn = b / 255;
  const max = Math.max(rn, gn, bn),
    min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rn) h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
  else if (max === gn) h = ((bn - rn) / d + 2) / 6;
  else h = ((rn - gn) / d + 4) / 6;
  return { h, s, l };
}

// k-means color quantization (simplified, single pass)
function quantizeColors(pixels: Uint8ClampedArray, k = 6): RGB[] {
  const sample: RGB[] = [];
  // Sample every 16px (performance)
  for (let i = 0; i < pixels.length; i += 16 * 4) {
    const a = pixels[i + 3];
    if (a < 128) continue; // skip transparent
    sample.push({ r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] });
  }

  if (sample.length === 0) return [{ r: 10, g: 20, b: 40 }];

  // Init centroids from evenly-spaced samples
  let centroids: RGB[] = Array.from(
    { length: k },
    (_, i) => sample[Math.floor((i / k) * sample.length)],
  );

  for (let iter = 0; iter < 5; iter++) {
    const clusters: RGB[][] = Array.from({ length: k }, () => []);
    for (const px of sample) {
      let minDist = Infinity,
        closest = 0;
      centroids.forEach((c, ci) => {
        const d = (px.r - c.r) ** 2 + (px.g - c.g) ** 2 + (px.b - c.b) ** 2;
        if (d < minDist) {
          minDist = d;
          closest = ci;
        }
      });
      clusters[closest].push(px);
    }
    centroids = clusters.map((cl) => {
      if (cl.length === 0) return centroids[0];
      const avg = cl.reduce(
        (acc, p) => ({ r: acc.r + p.r, g: acc.g + p.g, b: acc.b + p.b }),
        { r: 0, g: 0, b: 0 },
      );
      return {
        r: avg.r / cl.length,
        g: avg.g / cl.length,
        b: avg.b / cl.length,
      };
    });
  }

  // Sort by cluster population proxy (saturation × brightness = vibrancy)
  return centroids.sort((a, b) => {
    const va = rgbToHsl(a).s * rgbToHsl(a).l;
    const vb = rgbToHsl(b).s * rgbToHsl(b).l;
    return vb - va;
  });
}

export async function analyzeImage(dataUrl: string): Promise<ImageAnalysis> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const size = 80; // downsample for speed
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
      const { data } = ctx.getImageData(0, 0, size, size);

      const colors = quantizeColors(data, 6);
      const dominantColors = colors.map(rgbToHex);

      // Average brightness (perceived luminance)
      let totalL = 0,
        totalS = 0,
        totalWarmth = 0,
        count = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i + 3] < 128) continue;
        const rgb = { r: data[i], g: data[i + 1], b: data[i + 2] };
        const { h, s, l } = rgbToHsl(rgb);
        totalL += l;
        totalS += s;
        // warmth: reds/yellows (h < 0.17 or h > 0.85) = warm
        const isWarm = h < 0.17 || h > 0.85 || (h > 0.05 && h < 0.2);
        totalWarmth += isWarm ? 1 : 0;
        count++;
      }
      if (count === 0) count = 1;
      const brightness = totalL / count;
      const saturation = totalS / count;
      const warmth = totalWarmth / count;

      // High contrast: big difference between lightest and darkest luminance
      const lums = colors.map((c) => rgbToHsl(c).l);
      const hasHighContrast = Math.max(...lums) - Math.min(...lums) > 0.5;

      // Monochromatic: all hues close together
      const hues = colors.map((c) => rgbToHsl(c).h);
      const hRange = Math.max(...hues) - Math.min(...hues);
      const isMonochromatic = hRange < 0.08 || saturation < 0.12;

      resolve({
        dominantColors,
        brightness,
        saturation,
        warmth,
        hasHighContrast,
        isMonochromatic,
      });
    };
    img.src = dataUrl;
  });
}

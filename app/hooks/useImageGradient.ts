"use client";

import { useEffect, useState } from "react";

export function useImageGradient(src: string) {
  const [colors, setColors] = useState<{ from: string; to: string }>({
    from: "#1e3a8a",
    to: "#2563eb",
  });

  useEffect(() => {
    const img = document.createElement("img");
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 10;
      canvas.height = 10;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, 10, 10);
      const data = ctx.getImageData(0, 0, 10, 10).data;

      const fromR = data[0],
        fromG = data[1],
        fromB = data[2];

      const lastPixel = data.length - 4;
      const toR = data[lastPixel],
        toG = data[lastPixel + 1],
        toB = data[lastPixel + 2];

      const darken = (v: number) => Math.max(0, Math.floor(v * 0.6));
      const saturate = (v: number) => Math.min(255, Math.floor(v * 1.2));

      setColors({
        from: `rgb(${darken(fromR)},${darken(fromG)},${darken(fromB)})`,
        to: `rgb(${saturate(toR)},${saturate(toG)},${saturate(toB)})`,
      });
    };
  }, [src]);

  return colors;
}

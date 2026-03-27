"use client";

import { useState, useCallback } from "react";
import AutoGenPage from "./AutoGenPage";

type Mode = "auto" | "manual";
export default function PFPMakerRoot() {
  const [mode, setMode] = useState<Mode>("auto");
  const [seedImage, setSeedImage] = useState<string | null>(null);

  const handleOpenManualEditor = useCallback((imageDataUrl: string) => {
    setSeedImage(imageDataUrl);
    setMode("manual");
  }, []);

  if (mode === "manual") {
    return (
      <div className="relative">
        <button
          onClick={() => setMode("auto")}
          className="fixed top-4 right-4 z-50 font-mono-dm text-[0.7rem] px-3.5 py-2 rounded-xl transition-all"
          style={{
            background: "rgba(2, 11, 24, 0.8)",
            border: "1px solid rgba(77,162,255,0.25)",
            color: "rgba(77,162,255,0.8)",
            backdropFilter: "blur(12px)",
          }}
        >
          ✦ Auto-Generate
        </button>
        {/*
          <StudioPage initialImage={seedImage} />
          — swap the placeholder below for your real StudioPage import:
        */}
        <div className="min-h-screen flex items-center justify-center bg-[#020b18] text-white/40 font-mono-dm text-sm">
          StudioPage renders here — import and place it in this slot.
        </div>
      </div>
    );
  }

  return <AutoGenPage onOpenManualEditor={handleOpenManualEditor} />;
}

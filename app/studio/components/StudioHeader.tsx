"use client";

import Image from "next/image";
import Link from "next/link";

interface StudioHeaderProps {
  activeStep: 1 | 2 | 3;
  isDownloading: boolean;
  uploadedImage: string | null;
  onDownload: () => void;
}

export default function StudioHeader({
  activeStep,
  isDownloading,
  uploadedImage,
  onDownload,
}: StudioHeaderProps) {
  return (
    <header className="s-header relative z-20 flex items-center justify-between px-8 py-5 border-b border-[rgba(77,162,255,0.08)]">
      <Link href="/" className="flex items-center gap-3 group no-underline">
        <div className="relative w-7 h-7 shrink-0">
          <Image
            src="/sui-logo.png"
            alt="Sui"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-syne font-extrabold text-[1.1rem] text-white">
          sui<span className="text-[#4da2ff]">pfp</span>
        </span>
        <span className="font-dm-mono text-[0.65rem] tracking-[0.15em] uppercase text-[#4a6fa5] opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          ← back
        </span>
      </Link>
      <div className="flex items-center gap-2">
        {([1, 2, 3] as const).map((step) => (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-dm-mono text-[0.65rem] font-bold shrink-0 transition-all duration-300 ${activeStep >= step ? "bg-[#4da2ff] text-black" : "bg-[rgba(77,162,255,0.1)] text-[#4a6fa5] border border-[rgba(77,162,255,0.2)]"}`}
            >
              {step}
            </div>
            <span
              className={`hidden md:block font-dm-mono text-[0.7rem] tracking-wide transition-colors duration-300 ${activeStep >= step ? "text-[#eef5ff]" : "text-[#4a6fa5]"}`}
            >
              {step === 1 ? "Upload" : step === 2 ? "Add Tokens" : "Customize"}
            </span>
            {step < 3 && (
              <div className="hidden md:block w-6 h-px bg-[rgba(77,162,255,0.2)]" />
            )}
          </div>
        ))}
      </div>

      <button
        onClick={onDownload}
        disabled={!uploadedImage || isDownloading}
        className="btn-primary disabled:opacity-30 disabled:cursor-not-allowed text-[0.82rem]! px-[1.4rem]! py-[0.6rem]!"
      >
        {isDownloading ? "Exporting..." : "Download PFP"}
      </button>
    </header>
  );
}

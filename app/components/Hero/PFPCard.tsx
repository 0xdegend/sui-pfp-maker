"use client";

import Image from "next/image";
import { useImageGradient } from "@/app/hooks/useImageGradient";

interface PFPCardProps {
  emoji: string;
  label: string;
  index: number;
}

export default function PFPCard({ emoji, label, index }: PFPCardProps) {
  const { from, to } = useImageGradient(emoji);

  return (
    <div
      className="pfp-card animate-float group relative cursor-pointer"
      style={{
        animationDelay: `${index * 0.4}s`,
        transition: "transform 0.3s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform =
          "scale(1.06) translateY(-8px) rotate(-1deg)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
    >
      {/* Glow ring */}
      <div
        className="absolute inset-0 rounded-[1.25rem] opacity-0 group-hover:opacity-70 blur-xl transition-all duration-500 scale-110"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      />

      {/* Card */}
      <div
        className="relative w-[120px] h-[140px] rounded-[1.25rem] overflow-hidden transition-all duration-300 flex flex-col items-center justify-center"
        style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
      >
        {/* Shimmer */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.15)_0%,transparent_50%,rgba(255,255,255,0.05)_100%)] z-10" />

        {/* Top glass strip */}
        <div className="absolute top-0 inset-x-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] z-20" />

        {/* Image */}
        <div className="relative z-10 flex items-center justify-center mb-2">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-[rgba(255,255,255,0.15)] blur-sm" />
            <Image
              src={emoji}
              width={64}
              height={64}
              alt={label}
              className="rounded-full object-cover w-16 h-16 aspect-square relative z-10 ring-2 ring-white/20"
            />
          </div>
        </div>

        {/* Label */}
        <div className="relative z-10 text-center px-2">
          <span className="font-dm-mono text-[0.6rem] tracking-[0.14em] uppercase text-white/90 font-medium">
            {label}
          </span>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-[linear-gradient(0deg,rgba(0,0,0,0.25),transparent)] z-10" />
      </div>

      {/* Coin badge */}
      <div className="absolute -top-2 -right-2 z-30 w-6 h-6 rounded-full bg-[#4da2ff] flex items-center justify-center shadow-[0_0_10px_rgba(77,162,255,0.8)] opacity-0 group-hover:opacity-100 transition-all duration-300 scale-0 group-hover:scale-100">
        <span className="text-[0.55rem] font-dm-mono font-bold text-black">
          ✦
        </span>
      </div>
    </div>
  );
}

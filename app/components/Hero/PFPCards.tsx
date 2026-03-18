"use client";

import { RefObject } from "react";
import PFPCard from "./PFPCard";
import { SAMPLE_PFPS } from "@/app/data";

interface PFPCardsProps {
  cardsRef: RefObject<HTMLDivElement | null>;
}

export default function PFPCards({ cardsRef }: PFPCardsProps) {
  return (
    <div
      ref={cardsRef}
      className="relative z-10 flex justify-center items-center gap-5 mt-16 px-6 flex-wrap"
    >
      {SAMPLE_PFPS.map(({ emoji, label }, i) => (
        <PFPCard key={label} emoji={emoji} label={label} index={i} />
      ))}
    </div>
  );
}

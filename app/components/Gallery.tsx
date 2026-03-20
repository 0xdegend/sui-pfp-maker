"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  {
    emoji: "🐬",
    coin: "$BLUB",
    username: "0xwave",
    bg: "from-blue-950 to-blue-700",
    size: "large",
  },
  {
    emoji: "🦈",
    coin: "$DEEP",
    username: "deepdiver",
    bg: "from-slate-900 to-blue-800",
    size: "small",
  },
  {
    emoji: "🐋",
    coin: "$SUIB",
    username: "whalewatcher",
    bg: "from-indigo-950 to-indigo-700",
    size: "small",
  },
  {
    emoji: "🦑",
    coin: "$LOFI",
    username: "lofivibes",
    bg: "from-blue-900 to-cyan-700",
    size: "medium",
  },
  {
    emoji: "🐠",
    coin: "$NAVX",
    username: "navigator",
    bg: "from-sky-950 to-sky-700",
    size: "medium",
  },
  {
    emoji: "🐙",
    coin: "$TURBOS",
    username: "turbomode",
    bg: "from-blue-950 to-violet-800",
    size: "large",
  },
  {
    emoji: "🦐",
    coin: "$BUCK",
    username: "buckshot",
    bg: "from-slate-900 to-blue-900",
    size: "small",
  },
  {
    emoji: "🐡",
    coin: "$SDOG",
    username: "suidog",
    bg: "from-blue-800 to-indigo-900",
    size: "medium",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-item",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative py-24 overflow-hidden"
    >
      <div className="max-w-275 mx-auto px-8">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-var(--sui-blue)" />
              <span className="font-mono-dm text-[0.7rem] tracking-[0.15em] uppercase text-var(--sui-blue)">
                Gallery
              </span>
            </div>
            <h2 className="font-syne fw-800 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.1]">
              The Sui degen
              <br />
              <span className="text-var(--sui-blue)">hall of fame.</span>
            </h2>
          </div>
          <button className="btn-ghost">Browse All →</button>
        </div>
        <div className="grid grid-cols-4 auto-rows-[180px] gap-4">
          {GALLERY_ITEMS.map(({ emoji, coin, username, bg, size }, i) => (
            <div
              key={i}
              className={`gallery-item glass rounded-2xl overflow-hidden relative cursor-pointer ${size === "large" ? "row-span-2" : ""}`}
            >
              {/* Card content */}
              <div
                className={`w-full h-full bg-linear-to-br ${bg} flex flex-col items-center justify-center gap-2 transition-transform duration-300 hover:scale-105`}
              >
                <span
                  className={
                    size === "large" ? "text-[3.5rem]" : "text-[2.25rem]"
                  }
                >
                  {emoji}
                </span>
                <div className="text-center">
                  <div className="font-mono-dm fw-500 text-[0.7rem] tracking-widest text-var(--sui-blue)">
                    {coin}
                  </div>
                  <div className="font-mono-dm text-[0.65rem] mt-0.5 text-white/35">
                    @{username}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center bg-[rgba(2,11,24,0.7)]">
                <span className="font-mono-dm text-[0.82rem] tracking-[0.04em] text-var(--sui-blue)">
                  Use Template →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

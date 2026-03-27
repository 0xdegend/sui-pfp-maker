"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GALLERY_ITEMS } from "../data";
gsap.registerPlugin(ScrollTrigger);

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 80%" },
        },
      );

      // Staggered card entrance — alternate from left/right for odd-even
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((el, i) => {
        const fromX = i % 2 === 0 ? -20 : 20;
        gsap.fromTo(
          el,
          { y: 40, x: fromX, opacity: 0, scale: 0.93 },
          {
            y: 0,
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 0.7,
            delay: i * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative py-24 overflow-hidden"
    >
      {/* Subtle background accent */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, var(--sui-blue) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-275 mx-auto px-8">
        {/* Header */}
        <div
          ref={headingRef}
          className="flex items-end justify-between mb-14 flex-wrap gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-4">
              <div
                className="w-8 h-px"
                style={{ background: "var(--sui-blue)" }}
              />
              <span
                className="font-mono-dm text-[0.7rem] tracking-[0.15em] uppercase"
                style={{ color: "var(--sui-blue)" }}
              >
                Gallery
              </span>
            </div>
            <h2 className="font-syne fw-800 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.1]">
              The Sui degen
              <br />
              <span style={{ color: "var(--sui-blue)" }}>hall of fame.</span>
            </h2>
          </div>
          <button className="btn-ghost">Browse All →</button>
        </div>

        {/*
          Asymmetric grid:
          5 columns, auto rows at 200px.
          Layout map (col-span / row-span):
            [0] tall  → col 1,   row 1-2
            [1] normal→ col 2,   row 1
            [2] wide  → col 3-4, row 1
            [3] normal→ col 5,   row 1
            [4] normal→ col 2,   row 2
            [5] tall  → col 3,   row 2-3
            [6] normal→ col 4,   row 2
            [7] normal→ col 5,   row 2
        */}
        <div
          className="grid gap-3"
          style={{
            gridTemplateColumns: "repeat(5, 1fr)",
            gridAutoRows: "200px",
          }}
        >
          {GALLERY_ITEMS.map(({ img, coin, username, layout }, i) => {
            const spanClass =
              layout === "tall"
                ? "row-span-2"
                : layout === "wide"
                  ? "col-span-2"
                  : "";

            return (
              <div
                key={i}
                className={`gallery-item group relative overflow-hidden rounded-2xl cursor-pointer ${spanClass}`}
                style={{ border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Image */}
                <img
                  src={img}
                  alt={`${coin} pfp`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />

                {/* Permanent gradient vignette */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                {/* Bottom label — always visible */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                  <div
                    className="font-mono-dm fw-600 text-[0.72rem] tracking-widest"
                    style={{ color: "var(--sui-blue)" }}
                  >
                    {coin}
                  </div>
                  <div className="font-mono-dm text-[0.62rem] text-white/40 mt-0.5">
                    @{username}
                  </div>
                </div>

                {/* Hover overlay CTA */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span
                    className="font-mono-dm text-[0.78rem] tracking-[0.06em] px-4 py-2 rounded-full backdrop-blur-sm"
                    style={{
                      color: "var(--sui-blue)",
                      background: "rgba(2, 11, 24, 0.65)",
                      border:
                        "1px solid rgba(var(--sui-blue-rgb, 100,180,255), 0.25)",
                    }}
                  >
                    Use Template →
                  </span>
                </div>

                {/* Top-right index badge */}
                <div
                  className="absolute top-3 right-3 font-mono-dm text-[0.6rem] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "rgba(2,11,24,0.7)",
                    color: "rgba(255,255,255,0.4)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  #{String(i + 1).padStart(2, "0")}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer strip */}
        <div className="flex items-center justify-between mt-8">
          <p className="font-mono-dm text-[0.68rem] text-white/25 tracking-wider">
            {GALLERY_ITEMS.length} PFPS SHOWN · UPDATED DAILY
          </p>
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background:
                    i === 0 ? "var(--sui-blue)" : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEPS = [
  {
    num: "01",
    title: "Upload Your Base",
    desc: "Drop in any photo or selfie. Our engine handles the rest. No design skills needed.",
    detail: "PNG, JPG, WEBP · Up to 10MB",
  },
  {
    num: "02",
    title: "Pick Your Coin",
    desc: "Choose from 20+ Sui ecosystem memecoins. Each has exclusive traits, badges, and vibes.",
    detail: "$BLUB · $LOFI · $SUIB · and more",
  },
  {
    num: "03",
    title: "Customize & Export",
    desc: "Tweak layers, backgrounds, and accessories. Download as 1:1 image or mint as NFT.",
    detail: "PNG export · NFT metadata · Mint to Sui",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".step-card",
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        },
      );

      document.querySelectorAll<HTMLElement>(".step-card").forEach((card) => {
        const bottomBar = card.querySelector<HTMLElement>(".step-bottom-bar");

        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -6,
            borderColor: "rgba(77,162,255,0.35)",
            duration: 0.3,
            ease: "power2.out",
          });
          if (bottomBar) {
            gsap.to(bottomBar, {
              width: "100%",
              duration: 0.5,
              ease: "power2.out",
            });
          }
        });

        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            borderColor: "rgba(77,162,255,0.1)",
            duration: 0.3,
            ease: "power2.out",
          });
          if (bottomBar) {
            gsap.to(bottomBar, {
              width: bottomBar.dataset.defaultWidth ?? "30%",
              duration: 0.4,
              ease: "power2.in",
            });
          }
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute top-1/2 left-0 w-80 h-80 pointer-events-none -translate-x-[30%] -translate-y-1/2 blur-[60px] rounded-full bg-[radial-gradient(circle,rgba(77,162,255,0.06)_0%,transparent_70%)]" />
      <div className="max-w-275 mx-auto px-8">
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-var(--sui-blue)" />
            <span className="font-mono-dm text-[0.7rem] tracking-[0.15em] uppercase text-var(--sui-blue)">
              How it works
            </span>
          </div>
          <h2 className="font-syne fw-800 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.1]">
            Three steps to
            <br />
            <span className="text-var(--sui-blue)">degen status.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map(({ num, title, desc, detail }, i) => {
            const defaultWidth = i === 0 ? "30%" : i === 1 ? "60%" : "90%";
            return (
              <div
                key={num}
                className="step-card glass rounded-2xl p-8 relative overflow-hidden cursor-default"
              >
                <div className="font-syne fw-800 absolute -top-4 -right-2 text-[7rem] leading-none text-[rgba(77,162,255,0.05)] select-none pointer-events-none">
                  {num}
                </div>
                <div className="font-mono-dm fw-500 inline-flex items-center justify-center w-10 h-10 rounded-xl mb-6 text-[0.8rem] bg-[rgba(77,162,255,0.12)] border border-[rgba(77,162,255,0.25)] text-var(--sui-blue)">
                  {num}
                </div>
                <h3 className="font-syne fw-700 text-[1.2rem] mb-3">{title}</h3>
                <p className="font-mono-dm text-[0.85rem] leading-[1.65] text-var(--sui-muted) mb-5">
                  {desc}
                </p>
                <div className="font-mono-dm text-[0.72rem] tracking-[0.05em] px-3 py-1.5 rounded-lg inline-block bg-[rgba(77,162,255,0.06)] text-[rgba(77,162,255,0.6)] border border-[rgba(77,162,255,0.12)]">
                  {detail}
                </div>
                <div
                  className="step-bottom-bar absolute bottom-0 left-0 h-0.5 bg-[linear-gradient(90deg,var(--sui-blue),transparent)]"
                  data-default-width={defaultWidth}
                  style={{ width: defaultWidth }}
                />
              </div>
            );
          })}
        </div>
        <div className="mt-12 text-center">
          <button className="btn-primary">Start Making PFPs →</button>
        </div>
      </div>
    </section>
  );
}

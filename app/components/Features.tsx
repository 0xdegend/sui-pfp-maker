"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: "⚡",
    title: "Instant Generation",
    desc: "Upload your base image and get a Sui-branded PFP in under 3 seconds. No waiting, no BS.",
    tag: "SPEED",
  },
  {
    icon: "🎨",
    title: "100+ Layers & Traits",
    desc: "Mix backgrounds, accessories, overlays, and coin-specific badges for a truly unique identity.",
    tag: "CUSTOMIZATION",
  },
  {
    icon: "🔗",
    title: "On-chain Metadata",
    desc: "Every PFP generates NFT-ready metadata. Mint directly to your Sui wallet in one click.",
    tag: "WEB3 NATIVE",
  },
  {
    icon: "🪙",
    title: "20+ Sui Memecoins",
    desc: "Exclusive assets for every major Sui ecosystem memecoin. BLUB, LOFI, SUIB and more.",
    tag: "ECOSYSTEM",
  },
  {
    icon: "🛡️",
    title: "Zero Custody",
    desc: "We never store your images. All processing happens client-side. Your PFP, your keys.",
    tag: "PRIVACY",
  },
  {
    icon: "📤",
    title: "Export Anywhere",
    desc: "Download in 1:1 format optimized for Twitter, Discord, Telegram, or any platform.",
    tag: "PORTABLE",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
      gsap.fromTo(
        ".features-headline",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 overflow-hidden"
    >
      <div className="absolute top-1/2 right-0 w-96 h-96 pointer-events-none translate-x-[30%] -translate-y-1/2 blur-[60px] rounded-full bg-[radial-gradient(circle,rgba(77,162,255,0.07)_0%,transparent_70%)]" />

      <div className="max-w-275 mx-auto px-8">
        <div className="features-headline mb-14">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-8 h-px bg-var(--sui-blue)" />
            <span className="font-mono-dm text-[0.7rem] tracking-[0.15em] uppercase text-var(--sui-blue)">
              Features
            </span>
          </div>
          <h2 className="font-syne fw-800 text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.1]">
            Everything you need
            <br />
            <span className="text-var(--sui-blue)">to flex right.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, title, desc, tag }) => (
            <div
              key={title}
              className="feature-card glass rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-5">
                <span className="text-[1.75rem]">{icon}</span>
                <span className="font-mono-dm text-[0.65rem] tracking-widest px-2 py-1 rounded bg-[rgba(77,162,255,0.1)] border border-[rgba(77,162,255,0.2)] text-var(--sui-blue)">
                  {tag}
                </span>
              </div>
              <h3 className="font-syne fw-700 text-[1.15rem] mb-2.5">
                {title}
              </h3>
              <p className="font-mono-dm text-[0.85rem] leading-[1.65] text-var(--sui-muted)">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

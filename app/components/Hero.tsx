"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";
import Link from "next/link";
import PFPCards from "./Hero/PFPCards";

gsap.registerPlugin(SplitText);

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        blobRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.4 },
        0,
      );

      if (headlineRef.current) {
        const split = new SplitText(headlineRef.current, {
          type: "lines,words",
        });
        tl.fromTo(
          split.words,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.05 },
          0.3,
        );
      }

      tl.fromTo(
        subRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        0.9,
      );
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        1.1,
      );

      const cards = cardsRef.current?.querySelectorAll(".pfp-card");
      if (cards) {
        tl.fromTo(
          cards,
          { y: 40, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 },
          1.3,
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="grid-pattern min-h-[135vh] relative flex flex-col justify-center items-center overflow-hidden pt-24 pb-16"
    >
      <div className="absolute inset-0 z-0">
        <Image
          src="/sui-gradient.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,var(--sui-dark)_0%,transparent_30%,transparent_70%,var(--sui-dark)_100%)]" />
      </div>
      <div
        ref={blobRef}
        className="animate-blob animate-pulse-glow absolute z-0 w-150 h-150 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-2xl rounded-full bg-[radial-gradient(circle,rgba(77,162,255,0.18)_0%,transparent_70%)]"
      />
      <div className="animate-scan absolute inset-x-0 h-px z-10 opacity-20 bg-[linear-gradient(90deg,transparent,var(--sui-blue),transparent)]" />
      <div className="z-10 text-center relative px-6 w-full max-w-4xl mx-auto">
        <div className="glass rounded-full inline-flex items-center gap-2 px-5 py-2 mb-8">
          <span className="w-2 h-2 rounded-full bg-(--sui-blue) animate-pulse shrink-0" />
          <span className="font-mono-dm text-[0.7rem] tracking-[0.15em] uppercase text-(--sui-blue)">
            Built on Sui Network
          </span>
        </div>
        <h1
          ref={headlineRef}
          className="font-syne fw-800 glow-text text-[clamp(3rem,8vw,6rem)] leading-[1.05] tracking-[-0.02em] mb-6"
        >
          Your Sui Meme
          <br />
          <span className="text-(--sui-blue)">Identity.</span> Minted.
        </h1>
        <p
          ref={subRef}
          className="font-mono-dm text-[1.1rem] leading-[1.7] text-(--sui-muted) max-w-120 mx-auto mb-10"
        >
          Generate killer PFPs for every memecoin in the Sui ecosystem. Upload,
          customize, flex.
        </p>
        <div
          ref={ctaRef}
          className="flex flex-wrap items-center justify-center gap-4 mb-14"
        >
          <Link href="/studio">
            <button className="btn-primary">Make My PFP →</button>
          </Link>
          <button className="btn-ghost">View Gallery</button>
        </div>
      </div>
      <PFPCards cardsRef={cardsRef} />
      <div className="animate-float absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <span className="font-mono-dm text-[0.65rem] tracking-[0.15em] uppercase text-(--sui-muted)">
          Scroll
        </span>
        <div className="w-px h-10 bg-[linear-gradient(180deg,var(--sui-blue),transparent)]" />
      </div>
    </section>
  );
}

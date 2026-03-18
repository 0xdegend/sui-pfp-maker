"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

gsap.registerPlugin(SplitText);

import { SAMPLE_PFPS } from "../data";
import PFPCards from "./Hero/PFPCards";

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
        <div
          className="absolute inset-0 "
          style={{
            background:
              "linear-gradient(180deg, var(--sui-dark) 0%, transparent 30%, transparent 70%, var(--sui-dark) 100%)",
          }}
        />
      </div>

      <div
        ref={blobRef}
        className="animate-blob animate-pulse-glow absolute z-0 w-150 h-150 top-1/2 left-1/2"
        style={{
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="animate-scan absolute left-0 right-0 h-px z-10 opacity-[0.2]"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--sui-blue), transparent)",
        }}
      />

      <div className="z-10 text-center relative px-6 py-0 w-full max-w-225 my-0 mx-auto">
        <div className="glass rounded-full inline-flex items-center gap-2 px-5 py-2 mb-8">
          <span
            className="animate-pulse"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "var(--sui-blue)",
              flexShrink: 0,
            }}
          />
          <span
            className="font-mono-dm"
            style={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--sui-blue)",
            }}
          >
            Built on Sui Network
          </span>
        </div>

        <h1
          ref={headlineRef}
          className="font-syne fw-800 glow-text"
          style={{
            fontSize: "clamp(3rem, 8vw, 6rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
        >
          Your Sui Meme
          <br />
          <span style={{ color: "var(--sui-blue)" }}>Identity.</span> Minted.
        </h1>

        <p
          ref={subRef}
          className="font-mono-dm"
          style={{
            fontSize: "1.1rem",
            lineHeight: 1.7,
            color: "var(--sui-muted)",
            maxWidth: "480px",
            margin: "0 auto 2.5rem",
          }}
        >
          Generate killer PFPs for every memecoin in the Sui ecosystem. Upload,
          customize, flex.
        </p>

        <div
          ref={ctaRef}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "3.5rem",
          }}
        >
          <button className="btn-primary">Make My PFP →</button>
          <button className="btn-ghost">View Gallery</button>
        </div>
      </div>

      <PFPCards cardsRef={cardsRef} />

      <div className="animate-float absolute bottom-0 left-[50%] flex flex-col items-center gap-2 z-10 translateX-[50%]">
        <span
          className="font-mono-dm"
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "var(--sui-muted)",
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: "1px",
            height: "2.5rem",
            background: "linear-gradient(180deg, var(--sui-blue), transparent)",
          }}
        />
      </div>
    </section>
  );
}

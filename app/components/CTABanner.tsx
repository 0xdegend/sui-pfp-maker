"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export default function CTABanner() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-8 overflow-hidden">
      <div className="max-w-275 mx-auto">
        <div className="rounded-3xl relative overflow-hidden py-16 px-12 text-center bg-[linear-gradient(135deg,rgba(10,22,40,0.9)_0%,rgba(20,71,230,0.15)_50%,rgba(10,22,40,0.9)_100%)] border border-[rgba(77,162,255,0.2)]">
          <div className="absolute inset-0 z-0 opacity-20">
            <Image
              src="/sui-gradient.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="animate-blob absolute inset-0 pointer-events-none blur-2xl bg-[radial-gradient(ellipse_at_center,rgba(77,162,255,0.1)_0%,transparent_70%)]" />
          <div className="absolute right-8 bottom-8 w-28 h-28 opacity-[0.05]">
            <Image src="/sui-logo.png" alt="" fill className="object-contain" />
          </div>
          <div className="relative z-10">
            <div className="glass rounded-full inline-flex items-center gap-2 px-5 py-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-(--sui-blue) animate-pulse shrink-0" />
              <span className="font-mono-dm text-[0.7rem] tracking-[0.12em] uppercase text-(--sui-blue)">
                Free to use · No wallet required
              </span>
            </div>
            <h2 className="font-syne fw-800 glow-text text-[clamp(2rem,5vw,3.5rem)] leading-[1.1] mb-5">
              Stop being a faceless
              <br />
              <span className="text-(--sui-blue)">degen.</span>
            </h2>
            <p className="font-mono-dm text-[1rem] leading-[1.65] text-(--sui-muted) max-w-110 mx-auto mb-10">
              Join 50,000+ Sui community members who already have their perfect
              PFP.
            </p>
            <button className="btn-primary animate-pulse-glow text-[1rem]! px-10! py-4!">
              Create My PFP — It&apos;s Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

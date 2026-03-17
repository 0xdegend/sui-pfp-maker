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
    <section
      ref={sectionRef}
      style={{ padding: "5rem 2rem", overflow: "hidden" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          className="rounded-3xl"
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "4rem 3rem",
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(10,22,40,0.9) 0%, rgba(20,71,230,0.15) 50%, rgba(10,22,40,0.9) 100%)",
            border: "1px solid rgba(77,162,255,0.2)",
          }}
        >
          <div
            style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.2 }}
          >
            <Image
              src="/sui-gradient.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div
            className="animate-blob"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at center, rgba(77,162,255,0.1) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "2rem",
              bottom: "2rem",
              width: "7rem",
              height: "7rem",
              opacity: 0.05,
            }}
          >
            <Image src="/sui-logo.png" alt="" fill className="object-contain" />
          </div>

          <div style={{ position: "relative", zIndex: 10 }}>
            <div
              className="glass rounded-full"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.5rem 1.25rem",
                marginBottom: "1.5rem",
              }}
            >
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
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--sui-blue)",
                }}
              >
                Free to use · No wallet required
              </span>
            </div>

            <h2
              className="font-syne fw-800 glow-text"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                lineHeight: 1.1,
                marginBottom: "1.25rem",
              }}
            >
              Stop being a faceless
              <br />
              <span style={{ color: "var(--sui-blue)" }}>degen.</span>
            </h2>

            <p
              className="font-mono-dm"
              style={{
                fontSize: "1rem",
                lineHeight: 1.65,
                color: "var(--sui-muted)",
                maxWidth: "440px",
                margin: "0 auto 2.5rem",
              }}
            >
              Join 50,000+ Sui community members who already have their perfect
              PFP.
            </p>

            <button
              className="btn-primary animate-pulse-glow"
              style={{ fontSize: "1rem", padding: "1rem 2.5rem" }}
            >
              Create My PFP — It&apos;s Free
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

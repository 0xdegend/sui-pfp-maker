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
      // Entrance animation
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

      // Hover animations per card
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
      style={{ position: "relative", padding: "6rem 0", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: "20rem",
          height: "20rem",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(77,162,255,0.06) 0%, transparent 70%)",
          transform: "translate(-30%, -50%)",
          filter: "blur(60px)",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "2rem",
                height: "1px",
                background: "var(--sui-blue)",
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
              How it works
            </span>
          </div>
          <h2
            className="font-syne fw-800"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            Three steps to
            <br />
            <span style={{ color: "var(--sui-blue)" }}>degen status.</span>
          </h2>
        </div>

        {/* Steps */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {STEPS.map(({ num, title, desc, detail }, i) => {
            const defaultWidth = i === 0 ? "30%" : i === 1 ? "60%" : "90%";
            return (
              <div
                key={num}
                className="step-card glass rounded-2xl"
                style={{
                  padding: "2rem",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "default",
                }}
              >
                {/* Watermark number */}
                <div
                  className="font-syne fw-800"
                  style={{
                    position: "absolute",
                    top: "-1rem",
                    right: "-0.5rem",
                    fontSize: "7rem",
                    lineHeight: 1,
                    color: "rgba(77,162,255,0.05)",
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {num}
                </div>

                {/* Step badge */}
                <div
                  className="font-mono-dm fw-500"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "0.75rem",
                    marginBottom: "1.5rem",
                    fontSize: "0.8rem",
                    background: "rgba(77,162,255,0.12)",
                    border: "1px solid rgba(77,162,255,0.25)",
                    color: "var(--sui-blue)",
                  }}
                >
                  {num}
                </div>

                <h3
                  className="font-syne fw-700"
                  style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}
                >
                  {title}
                </h3>
                <p
                  className="font-mono-dm"
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.65,
                    color: "var(--sui-muted)",
                    marginBottom: "1.25rem",
                  }}
                >
                  {desc}
                </p>

                <div
                  className="font-mono-dm"
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.05em",
                    padding: "0.4rem 0.75rem",
                    borderRadius: "0.5rem",
                    display: "inline-block",
                    background: "rgba(77,162,255,0.06)",
                    color: "rgba(77,162,255,0.6)",
                    border: "1px solid rgba(77,162,255,0.12)",
                  }}
                >
                  {detail}
                </div>

                {/* Animated bottom bar */}
                <div
                  className="step-bottom-bar"
                  data-default-width={defaultWidth}
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    height: "2px",
                    width: defaultWidth,
                    background:
                      "linear-gradient(90deg, var(--sui-blue), transparent)",
                  }}
                />
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <button className="btn-primary">Start Making PFPs →</button>
        </div>
      </div>
    </section>
  );
}

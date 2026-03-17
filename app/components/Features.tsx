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
      style={{ position: "relative", padding: "6rem 0", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          width: "24rem",
          height: "24rem",
          pointerEvents: "none",
          background:
            "radial-gradient(circle, rgba(77,162,255,0.07) 0%, transparent 70%)",
          transform: "translate(30%, -50%)",
          filter: "blur(60px)",
        }}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div className="features-headline" style={{ marginBottom: "3.5rem" }}>
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
              Features
            </span>
          </div>
          <h2
            className="font-syne fw-800"
            style={{ fontSize: "clamp(2.2rem, 5vw, 3.5rem)", lineHeight: 1.1 }}
          >
            Everything you need
            <br />
            <span style={{ color: "var(--sui-blue)" }}>to flex right.</span>
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1rem",
          }}
        >
          {FEATURES.map(({ icon, title, desc, tag }) => (
            <div
              key={title}
              className="feature-card glass rounded-2xl"
              style={{
                padding: "1.75rem",
                cursor: "default",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-4px)")
              }
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <span style={{ fontSize: "1.75rem" }}>{icon}</span>
                <span
                  className="font-mono-dm"
                  style={{
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    padding: "0.25rem 0.5rem",
                    borderRadius: "0.25rem",
                    color: "var(--sui-blue)",
                    background: "rgba(77,162,255,0.1)",
                    border: "1px solid rgba(77,162,255,0.2)",
                  }}
                >
                  {tag}
                </span>
              </div>
              <h3
                className="font-syne fw-700"
                style={{ fontSize: "1.15rem", marginBottom: "0.6rem" }}
              >
                {title}
              </h3>
              <p
                className="font-mono-dm"
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.65,
                  color: "var(--sui-muted)",
                }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

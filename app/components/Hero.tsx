"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import Image from "next/image";

gsap.registerPlugin(SplitText);

const SAMPLE_PFPS = [
  { bg: "from-blue-900 to-blue-600", emoji: "🐬", label: "DOLPHIN" },
  { bg: "from-indigo-900 to-blue-500", emoji: "🦈", label: "SHARK" },
  { bg: "from-blue-800 to-cyan-500", emoji: "🐋", label: "WHALE" },
  { bg: "from-slate-800 to-blue-700", emoji: "🦑", label: "SQUID" },
  { bg: "from-blue-950 to-indigo-600", emoji: "🐠", label: "CLOWN" },
];

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
      className="grid-pattern"
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "6rem",
        paddingBottom: "4rem",
      }}
    >
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <Image
          src="/sui-gradient.png"
          alt=""
          fill
          className="object-cover opacity-30"
          priority
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, var(--sui-dark) 0%, transparent 30%, transparent 70%, var(--sui-dark) 100%)",
          }}
        />
      </div>

      <div
        ref={blobRef}
        className="animate-blob animate-pulse-glow"
        style={{
          position: "absolute",
          zIndex: 0,
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(77,162,255,0.18) 0%, transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(40px)",
        }}
      />

      <div
        className="animate-scan"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: "1px",
          zIndex: 10,
          opacity: 0.2,
          background:
            "linear-gradient(90deg, transparent, var(--sui-blue), transparent)",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          padding: "0 1.5rem",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <div
          className="glass rounded-full"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1.25rem",
            marginBottom: "2rem",
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

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "3rem",
          }}
        >
          {[
            { val: "50K+", label: "PFPs Generated" },
            { val: "20+", label: "Sui Memecoins" },
            { val: "100%", label: "On-chain Ready" },
          ].map(({ val, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div
                className="font-syne fw-800 glow-text"
                style={{ fontSize: "2rem", color: "var(--sui-blue)" }}
              >
                {val}
              </div>
              <div
                className="font-mono-dm"
                style={{
                  fontSize: "0.7rem",
                  marginTop: "0.25rem",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--sui-muted)",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={cardsRef}
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          marginTop: "4rem",
          padding: "0 1.5rem",
          flexWrap: "wrap",
        }}
      >
        {SAMPLE_PFPS.map(({ bg, emoji, label }, i) => (
          <div
            key={label}
            className={`pfp-card animate-float glass rounded-2xl overflow-hidden`}
            style={{
              animationDelay: `${i * 0.4}s`,
              width: "110px",
              height: "110px",
              cursor: "pointer",
              flexShrink: 0,
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08) translateY(-6px)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            <div
              className={`w-full h-full bg-gradient-to-br ${bg}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.25rem",
              }}
            >
              <span style={{ fontSize: "2rem" }}>{emoji}</span>
              <span
                className="font-mono-dm"
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "0.1em",
                  color: "var(--sui-blue-pale)",
                }}
              >
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div
        className="animate-float"
        style={{
          position: "absolute",
          bottom: "2.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          zIndex: 10,
        }}
      >
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

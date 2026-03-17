"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const GALLERY_ITEMS = [
  {
    emoji: "🐬",
    coin: "$BLUB",
    username: "0xwave",
    bg: "from-blue-950 to-blue-700",
    size: "large",
  },
  {
    emoji: "🦈",
    coin: "$DEEP",
    username: "deepdiver",
    bg: "from-slate-900 to-blue-800",
    size: "small",
  },
  {
    emoji: "🐋",
    coin: "$SUIB",
    username: "whalewatcher",
    bg: "from-indigo-950 to-indigo-700",
    size: "small",
  },
  {
    emoji: "🦑",
    coin: "$LOFI",
    username: "lofivibes",
    bg: "from-blue-900 to-cyan-700",
    size: "medium",
  },
  {
    emoji: "🐠",
    coin: "$NAVX",
    username: "navigator",
    bg: "from-sky-950 to-sky-700",
    size: "medium",
  },
  {
    emoji: "🐙",
    coin: "$TURBOS",
    username: "turbomode",
    bg: "from-blue-950 to-violet-800",
    size: "large",
  },
  {
    emoji: "🦐",
    coin: "$BUCK",
    username: "buckshot",
    bg: "from-slate-900 to-blue-900",
    size: "small",
  },
  {
    emoji: "🐡",
    coin: "$SDOG",
    username: "suidog",
    bg: "from-blue-800 to-indigo-900",
    size: "medium",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-item",
        { scale: 0.85, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        },
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      style={{ position: "relative", padding: "6rem 0", overflow: "hidden" }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "3rem",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}
        >
          <div>
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
                Gallery
              </span>
            </div>
            <h2
              className="font-syne fw-800"
              style={{
                fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
                lineHeight: 1.1,
              }}
            >
              The Sui degen
              <br />
              <span style={{ color: "var(--sui-blue)" }}>hall of fame.</span>
            </h2>
          </div>
          <button className="btn-ghost">Browse All →</button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gridAutoRows: "180px",
            gap: "1rem",
          }}
        >
          {GALLERY_ITEMS.map(({ emoji, coin, username, bg, size }, i) => (
            <div
              key={i}
              className={`gallery-item glass rounded-2xl overflow-hidden ${size === "large" ? "row-span-2" : ""}`}
              style={{ position: "relative", cursor: "pointer" }}
            >
              <div
                className={`w-full h-full bg-gradient-to-br ${bg}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
              >
                <span
                  style={{ fontSize: size === "large" ? "3.5rem" : "2.25rem" }}
                >
                  {emoji}
                </span>
                <div style={{ textAlign: "center" }}>
                  <div
                    className="font-mono-dm fw-500"
                    style={{
                      fontSize: "0.7rem",
                      letterSpacing: "0.1em",
                      color: "var(--sui-blue)",
                    }}
                  >
                    {coin}
                  </div>
                  <div
                    className="font-mono-dm"
                    style={{
                      fontSize: "0.65rem",
                      marginTop: "0.15rem",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    @{username}
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(2,11,24,0.7)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
              >
                <span
                  className="font-mono-dm"
                  style={{
                    fontSize: "0.82rem",
                    letterSpacing: "0.04em",
                    color: "var(--sui-blue)",
                  }}
                >
                  Use Template →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

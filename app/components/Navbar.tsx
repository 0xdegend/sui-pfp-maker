"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 },
    );

    const handleScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 60) {
        navRef.current.style.background = "rgba(2,11,24,0.92)";
        navRef.current.style.backdropFilter = "blur(20px)";
        navRef.current.style.borderBottomColor = "rgba(77,162,255,0.1)";
      } else {
        navRef.current.style.background = "transparent";
        navRef.current.style.backdropFilter = "none";
        navRef.current.style.borderBottomColor = "transparent";
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.1rem 2rem",
        borderBottom: "1px solid transparent",
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
        <div
          style={{
            width: "28px",
            height: "28px",
            position: "relative",
            flexShrink: 0,
          }}
        >
          <Image
            src="/sui-logo.png"
            alt="Sui"
            fill
            className="object-contain"
          />
        </div>
        <span
          className="font-syne fw-800"
          style={{
            fontSize: "1.1rem",
            color: "white",
            letterSpacing: "-0.01em",
          }}
        >
          sui<span style={{ color: "var(--sui-blue)" }}>pfp</span>
        </span>
      </div>

      <div
        style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}
        className="hidden md:flex"
      >
        {["Features", "Gallery", "How it works", "FAQ"].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
            className="font-mono-dm"
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.04em",
              color: "var(--sui-muted)",
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "var(--sui-blue)")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "var(--sui-muted)")
            }
          >
            {link}
          </a>
        ))}
      </div>

      <button
        className="btn-primary"
        style={{ padding: "0.6rem 1.4rem", fontSize: "0.82rem" }}
      >
        Launch App →
      </button>
    </nav>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";

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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-[1.1rem] border-b border-transparent transition-[background,border-color] duration-300"
    >
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative w-7 h-7 shrink-0">
          <Image
            src="/sui-logo.png"
            alt="Sui"
            fill
            className="object-contain"
          />
        </div>
        <span className="font-syne fw-800 text-[1.1rem] text-white tracking-[-0.01em]">
          sui<span className="text-var(--sui-blue)">pfp</span>
        </span>
      </div>
      <div className="hidden md:flex items-center gap-10">
        {["Features", "Gallery", "How it works", "FAQ"].map((link) => (
          <a
            key={link}
            href={`#${link.toLowerCase().replace(/\s/g, "-")}`}
            className="font-mono-dm text-[0.82rem] tracking-[0.04em] text-var(--sui-muted) no-underline transition-colors duration-200 hover:text-var(--sui-blue)"
          >
            {link}
          </a>
        ))}
      </div>
      <Link href="/create">
        <button className="btn-primary px-[1.4rem]! py-[0.6rem]! text-[0.82rem]!">
          Launch App
        </button>
      </Link>
    </nav>
  );
}

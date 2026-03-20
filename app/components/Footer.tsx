"use client";

import Image from "next/image";

const LINKS = {
  Product: ["PFP Maker", "Gallery", "Memecoins", "NFT Minting"],
  Community: ["Discord", "Twitter / X", "Telegram", "Submit Coin"],
  Resources: ["Docs", "API", "Changelog", "Status"],
};

export default function Footer() {
  return (
    <footer className="relative py-16 px-8 border-t border-[rgba(77,162,255,0.08)] bg-[rgba(5,15,31,0.8)]">
      <div className="max-w-275 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-7 h-7 shrink-0">
                <Image
                  src="/sui-logo.png"
                  alt="Sui"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-syne fw-800 text-[1.1rem] text-white">
                sui<span className="text-var(--sui-blue)">pfp</span>
              </span>
            </div>
            <p className="font-mono-dm text-[0.82rem] leading-[1.65] text-var(--sui-muted)">
              The go-to PFP generator for the Sui ecosystem. Fast. Free.
              Degen-approved.
            </p>
            <div className="flex gap-2.5 mt-5">
              {["𝕏", "💬", "📢"].map((icon, i) => (
                <button
                  key={i}
                  className="glass rounded-xl w-9 h-9 flex items-center justify-center text-[0.85rem] text-var(--sui-blue) transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="font-mono-dm fw-500 text-[0.7rem] tracking-[0.15em] uppercase text-var(--sui-blue) mb-4">
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5 list-none">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-mono-dm text-[0.85rem] text-var(--sui-muted) no-underline transition-colors duration-200 hover:text-var(--sui-white)"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-[rgba(77,162,255,0.06)]">
          <span className="font-mono-dm text-[0.75rem] text-var(--sui-muted)">
            © 2025 SuiPFP. Built on{" "}
            <span className="text-var(--sui-blue)">Sui Network</span>.
          </span>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-mono-dm text-[0.75rem] text-var(--sui-muted) no-underline transition-colors duration-200 hover:text-var(--sui-blue)"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

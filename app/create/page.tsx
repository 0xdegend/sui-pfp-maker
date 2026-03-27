"use client";

import Link from "next/link";

const EDITOR_OPTIONS = [
  {
    title: "Manual",
    description:
      "Upload your own image and place badges, text, frames, overlays, and effects by hand.",
    href: "/studio",
    cta: "Open Manual Editor",
  },
  {
    title: "Auto",
    description:
      "Generate a PFP automatically, then optionally continue editing in the studio.",
    href: "/auto-generate",
    cta: "Open Auto Generator",
  },
];

export default function CreatePage() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#020b18] text-[#eef5ff] font-syne">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#020b18_0%,#050f1f_50%,#020b18_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(77,162,255,0.14),transparent)]" />
        <div className="absolute inset-0 grid-pattern opacity-40" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="glass rounded-full inline-flex items-center gap-2 px-5 py-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-(--sui-blue) animate-pulse shrink-0" />
          <span className="font-mono-dm text-[0.7rem] tracking-[0.15em] uppercase text-(--sui-blue)">
            Choose your workflow
          </span>
        </div>

        <h1 className="font-syne fw-800 glow-text text-center text-[clamp(2.3rem,6vw,4.5rem)] leading-[1.08] tracking-[-0.02em]">
          How do you want to
          <br />
          <span className="text-(--sui-blue)">build your PFP?</span>
        </h1>

        <p className="mt-5 max-w-2xl text-center font-mono-dm text-[1rem] leading-[1.7] text-(--sui-muted)">
          Pick one mode to start. You can always switch between Auto and Manual
          later.
        </p>

        <div className="mt-10 grid w-full gap-6 md:grid-cols-2">
          {EDITOR_OPTIONS.map((option) => (
            <article
              key={option.title}
              className="glass rounded-3xl border border-[rgba(77,162,255,0.12)] p-7 md:p-8"
            >
              <h2 className="font-syne fw-800 text-3xl tracking-[-0.02em] text-[#eef5ff]">
                {option.title}
              </h2>
              <p className="mt-3 font-mono-dm text-[0.95rem] leading-[1.75] text-(--sui-muted)">
                {option.description}
              </p>

              <div className="mt-7">
                <Link href={option.href}>
                  <button className="btn-primary w-full md:w-auto">
                    {option.cta} →
                  </button>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

"use client";

const COINS = ["$BLUB", "$SUIB", "$LOFI", "$CETUS", "$DEEP", "$BUCK", "$FDUSD", "$NAVX", "$SDOG", "$TURBOS", "$SUICAT", "$MEMEFI"];

export default function Ticker() {
  const doubled = [...COINS, ...COINS];

  return (
    <div
      className="relative overflow-hidden py-4 border-y"
      style={{
        borderColor: "rgba(77,162,255,0.1)",
        background: "rgba(10,22,40,0.6)",
      }}
    >
      <div className="flex animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
        {doubled.map((coin, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-6">
            <span
              className="font-mono-dm text-sm font-500 tracking-widest"
              style={{ color: "var(--sui-blue)" }}
            >
              {coin}
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "var(--sui-muted)" }} />
          </span>
        ))}
      </div>
    </div>
  );
}

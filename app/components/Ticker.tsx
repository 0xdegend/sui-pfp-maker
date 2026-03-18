"use client";

const COINS = [
  "$PANS",
  "$MBP",
  "$EGS",
  "$KYLN",
  "$KLS",
  "$POORS",
  "$BEARS",
  "$LIONS",
  "$CKS",
  "$BVS",
  "$FOMO",
  "$GENERAL",
];

export default function Ticker() {
  const doubled = [...COINS, ...COINS];

  return (
    <div className="relative overflow-hidden py-4 border-y border-[rgba(77,162,255,0.1)] bg-[rgba(10,22,40,0.6)]">
      <div className="animate-ticker flex whitespace-nowrap w-max">
        {doubled.map((coin, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-6">
            <span className="font-dm-mono text-sm font-medium tracking-widest text-sui-blue">
              {coin}
            </span>
            <span className="w-1 h-1 rounded-full bg-sui-muted shrink-0" />
          </span>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";

const LINKS = {
  Product: ["PFP Maker", "Gallery", "Memecoins", "NFT Minting"],
  Community: ["Discord", "Twitter / X", "Telegram", "Submit Coin"],
  Resources: ["Docs", "API", "Changelog", "Status"],
};

export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        padding: "4rem 2rem",
        borderTop: "1px solid rgba(77,162,255,0.08)",
        background: "rgba(5,15,31,0.8)",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                marginBottom: "1rem",
              }}
            >
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
                style={{ fontSize: "1.1rem", color: "white" }}
              >
                sui<span style={{ color: "var(--sui-blue)" }}>pfp</span>
              </span>
            </div>
            <p
              className="font-mono-dm"
              style={{
                fontSize: "0.82rem",
                lineHeight: 1.65,
                color: "var(--sui-muted)",
              }}
            >
              The go-to PFP generator for the Sui ecosystem. Fast. Free.
              Degen-approved.
            </p>
            <div
              style={{ display: "flex", gap: "0.6rem", marginTop: "1.25rem" }}
            >
              {["𝕏", "💬", "📢"].map((icon, i) => (
                <button
                  key={i}
                  className="glass rounded-xl"
                  style={{
                    width: "2.25rem",
                    height: "2.25rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    color: "var(--sui-blue)",
                    cursor: "pointer",
                    border: "none",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([section, links]) => (
            <div key={section}>
              <h4
                className="font-mono-dm fw-500"
                style={{
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--sui-blue)",
                  marginBottom: "1rem",
                }}
              >
                {section}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="font-mono-dm"
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--sui-muted)",
                        textDecoration: "none",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "var(--sui-white)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color =
                          "var(--sui-muted)")
                      }
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            paddingTop: "2rem",
            borderTop: "1px solid rgba(77,162,255,0.06)",
          }}
        >
          <span
            className="font-mono-dm"
            style={{ fontSize: "0.75rem", color: "var(--sui-muted)" }}
          >
            © 2025 SuiPFP. Built on{" "}
            <span style={{ color: "var(--sui-blue)" }}>Sui Network</span>.
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <a
                key={l}
                href="#"
                className="font-mono-dm"
                style={{
                  fontSize: "0.75rem",
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
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

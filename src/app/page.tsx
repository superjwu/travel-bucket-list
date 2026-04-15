import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function IconBookmark() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconBarChart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Mosaic Backdrop ──────────────────────────────────────────────────────────

// A decorative grid of colored tiles evocative of passport stamps / map grids
const MOSAIC_TILES = [
  // [col, row, color-stop-1, color-stop-2, opacity]
  [0, 0, "#1a4a6b", "#0d2b3e", 0.9],
  [1, 0, "#2d6a4f", "#1b4332", 0.85],
  [2, 0, "#7b3f00", "#4a2500", 0.8],
  [3, 0, "#1a4a6b", "#0d2b3e", 0.7],
  [4, 0, "#5a189a", "#3c096c", 0.75],
  [5, 0, "#2d6a4f", "#1b4332", 0.9],

  [0, 1, "#7b3f00", "#4a2500", 0.6],
  [1, 1, "#9d0208", "#6a040f", 0.8],
  [2, 1, "#1a4a6b", "#0d2b3e", 0.85],
  [3, 1, "#2d6a4f", "#1b4332", 0.7],
  [4, 1, "#7b3f00", "#4a2500", 0.9],
  [5, 1, "#5a189a", "#3c096c", 0.65],

  [0, 2, "#5a189a", "#3c096c", 0.8],
  [1, 2, "#1a4a6b", "#0d2b3e", 0.75],
  [2, 2, "#9d0208", "#6a040f", 0.7],
  [3, 2, "#7b3f00", "#4a2500", 0.85],
  [4, 2, "#1a4a6b", "#0d2b3e", 0.9],
  [5, 2, "#2d6a4f", "#1b4332", 0.8],

  [0, 3, "#2d6a4f", "#1b4332", 0.7],
  [1, 3, "#7b3f00", "#4a2500", 0.85],
  [2, 3, "#5a189a", "#3c096c", 0.9],
  [3, 3, "#9d0208", "#6a040f", 0.75],
  [4, 3, "#2d6a4f", "#1b4332", 0.65],
  [5, 3, "#1a4a6b", "#0d2b3e", 0.8],
];

function MosaicBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Tiled gradient grid */}
      <div
        className="absolute inset-0 grid"
        style={{
          gridTemplateColumns: "repeat(6, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
        }}
      >
        {MOSAIC_TILES.map(([col, row, c1, c2, op], i) => (
          <div
            key={i}
            style={{
              gridColumn: (col as number) + 1,
              gridRow: (row as number) + 1,
              background: `linear-gradient(135deg, ${c1}, ${c2})`,
              opacity: op as number,
            }}
          />
        ))}
      </div>

      {/* Grain texture overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Dark gradient overlay — heavy at bottom-left, light at top-right */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 60%, rgba(8,6,14,0.88) 0%, rgba(8,6,14,0.55) 55%, rgba(8,6,14,0.2) 100%)",
        }}
      />

      {/* Subtle top vignette */}
      <div
        className="absolute inset-x-0 top-0 h-40"
        style={{ background: "linear-gradient(to bottom, rgba(8,6,14,0.7), transparent)" }}
      />

      {/* Bottom fade to page background */}
      <div
        className="absolute inset-x-0 bottom-0 h-48"
        style={{ background: "linear-gradient(to top, #08060e, transparent)" }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "#08060e", color: "#e8e0d0" }}
    >
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <MosaicBackdrop />

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-12 pt-32 pb-24">
          {/* Kicker label */}
          <div className="flex items-center gap-3 mb-8">
            <span
              className="block h-px w-12"
              style={{ background: "#c9a96e" }}
              aria-hidden="true"
            />
            <span
              className="text-xs tracking-[0.25em] uppercase font-sans font-medium"
              style={{ color: "#c9a96e" }}
            >
              Your World Awaits
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-display leading-[0.92] tracking-tight"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 8.5rem)",
              color: "#f5f0e8",
              maxWidth: "14ch",
            }}
          >
            Discover
            <br />
            <em
              className="not-italic"
              style={{
                WebkitTextStroke: "1px #c9a96e",
                color: "transparent",
              }}
            >
              the World
            </em>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-8 font-sans leading-relaxed max-w-md"
            style={{ fontSize: "1.125rem", color: "#b8b0a0" }}
          >
            Explore 250+ countries with real travel photography, live safety
            advisories, curated attractions, and cost-of-living insights — all
            in one place.
          </p>

          {/* CTA row */}
          <div className="mt-12 flex flex-wrap gap-4 items-center">
            <Link
              href="/explore"
              className="font-sans font-medium inline-flex items-center gap-2 px-8 py-4 transition-all duration-200 hover:gap-3"
              style={{
                background: "#c9a96e",
                color: "#08060e",
                fontSize: "0.9375rem",
                letterSpacing: "0.02em",
              }}
            >
              Start Exploring
              <IconArrow />
            </Link>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="font-sans font-medium inline-flex items-center gap-2 px-8 py-4 transition-all duration-200 border hover:bg-white/5"
                  style={{
                    borderColor: "rgba(201,169,110,0.4)",
                    color: "#c9a96e",
                    fontSize: "0.9375rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  Sign In
                </button>
              </SignInButton>
            </Show>

            <Show when="signed-in">
              <Link
                href="/bucket-list"
                className="font-sans font-medium inline-flex items-center gap-2 px-8 py-4 transition-all duration-200 border hover:bg-white/5"
                style={{
                  borderColor: "rgba(201,169,110,0.4)",
                  color: "#c9a96e",
                  fontSize: "0.9375rem",
                  letterSpacing: "0.02em",
                }}
              >
                My List
              </Link>
            </Show>
          </div>

          {/* Scroll indicator */}
          <div className="mt-24 flex items-center gap-3" aria-hidden="true">
            <div
              className="h-10 w-px"
              style={{ background: "linear-gradient(to bottom, transparent, #c9a96e)" }}
            />
            <span
              className="font-sans text-xs tracking-[0.2em] uppercase"
              style={{ color: "#7a7060" }}
            >
              Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ borderTop: "1px solid rgba(201,169,110,0.2)", borderBottom: "1px solid rgba(201,169,110,0.2)", background: "rgba(201,169,110,0.05)" }}
      >
        <div className="max-w-6xl mx-auto px-6 lg:px-12 py-5 flex flex-wrap gap-x-12 gap-y-3 items-center justify-center sm:justify-between">
          {[
            { number: "250+", label: "Countries & Territories" },
            { number: "Live", label: "Safety Advisories" },
            { number: "Free", label: "Travel Photography" },
            { number: "Real", label: "Cost of Living Data" },
          ].map(({ number, label }) => (
            <div key={label} className="flex items-center gap-3">
              <span
                className="font-display font-bold"
                style={{ fontSize: "1.5rem", color: "#c9a96e" }}
              >
                {number}
              </span>
              <span
                className="font-sans text-sm tracking-wide uppercase"
                style={{ color: "#7a7060", letterSpacing: "0.1em" }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 lg:px-12">
        {/* Section label */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-16">
            <span
              className="block h-px w-12"
              style={{ background: "#c9a96e" }}
              aria-hidden="true"
            />
            <span
              className="text-xs tracking-[0.25em] uppercase font-sans font-medium"
              style={{ color: "#c9a96e" }}
            >
              How It Works
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-px"
            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.06)" }}
          >
            {[
              {
                num: "01",
                icon: <IconSearch />,
                title: "Search & Discover",
                body:
                  "Browse our full database of 250+ countries. Filter by region, climate, or travel advisory level. See real photography from Pexels alongside key facts.",
              },
              {
                num: "02",
                icon: <IconBookmark />,
                title: "Save & Plan",
                body:
                  "Add destinations to your personal bucket list. Set target travel dates, jot down notes, and rate each destination by priority.",
              },
              {
                num: "03",
                icon: <IconGlobe />,
                title: "Track & Share",
                body:
                  "Mark countries as visited as you go. Watch your map fill in and your stats grow. Your list, your story.",
              },
            ].map(({ num, icon, title, body }) => (
              <div
                key={num}
                className="relative p-10 lg:p-12 flex flex-col gap-6 group transition-colors duration-300 hover:bg-white/[0.03]"
                style={{ background: "#08060e" }}
              >
                {/* Big outlined number */}
                <span
                  className="absolute top-8 right-10 font-display font-bold select-none pointer-events-none"
                  style={{
                    fontSize: "5rem",
                    lineHeight: 1,
                    WebkitTextStroke: "1px rgba(201,169,110,0.12)",
                    color: "transparent",
                  }}
                  aria-hidden="true"
                >
                  {num}
                </span>

                {/* Icon */}
                <div
                  className="w-12 h-12 flex items-center justify-center flex-shrink-0"
                  style={{
                    border: "1px solid rgba(201,169,110,0.3)",
                    color: "#c9a96e",
                  }}
                >
                  {icon}
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="font-display mb-3"
                    style={{ fontSize: "1.5rem", color: "#f5f0e8" }}
                  >
                    {title}
                  </h3>
                  <p className="font-sans leading-relaxed" style={{ color: "#8a8070", fontSize: "0.9375rem" }}>
                    {body}
                  </p>
                </div>

                {/* Bottom accent line that grows on hover */}
                <div
                  className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                  style={{ background: "#c9a96e" }}
                  aria-hidden="true"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED APIs ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 lg:px-12" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-6xl mx-auto">
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="block h-px w-12"
                  style={{ background: "#c9a96e" }}
                  aria-hidden="true"
                />
                <span
                  className="text-xs tracking-[0.25em] uppercase font-sans font-medium"
                  style={{ color: "#c9a96e" }}
                >
                  Powered By
                </span>
              </div>
              <h2
                className="font-display leading-tight"
                style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", color: "#f5f0e8" }}
              >
                Rich Data,
                <br />
                Every Country
              </h2>
            </div>
            <p
              className="font-sans max-w-xs leading-relaxed"
              style={{ color: "#7a7060", fontSize: "0.9375rem" }}
            >
              We aggregate real-time data from four trusted APIs so you get the
              full picture before you book.
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: <IconCamera />,
                source: "Pexels",
                title: "Travel Photography",
                desc:
                  "Stunning, royalty-free photographs for every destination, sourced from the world's best travel photographers.",
                accent: "#2d6a4f",
                accentText: "#52b788",
              },
              {
                icon: <IconShield />,
                source: "U.S. State Dept.",
                title: "Safety Advisories",
                desc:
                  "Live travel advisories and entry requirements from official government sources, updated in real time.",
                accent: "#6a040f",
                accentText: "#e5383b",
              },
              {
                icon: <IconMapPin />,
                source: "OpenTripMap",
                title: "Attractions & Sights",
                desc:
                  "Curated points of interest — from UNESCO heritage sites to hidden local gems — ranked by popularity.",
                accent: "#1a4a6b",
                accentText: "#48cae4",
              },
              {
                icon: <IconBarChart />,
                source: "Teleport",
                title: "Cost of Living",
                desc:
                  "City-level cost indexes covering accommodation, dining, transport, and more — so you can budget smarter.",
                accent: "#3c096c",
                accentText: "#c77dff",
              },
            ].map(({ icon, source, title, desc, accent, accentText }) => (
              <div
                key={title}
                className="relative p-8 flex flex-col gap-5 group transition-transform duration-300 hover:-translate-y-0.5"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "#0d0b15",
                }}
              >
                {/* Color accent strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: accent }}
                  aria-hidden="true"
                />

                {/* Icon + source badge */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                    style={{ background: accent + "33", color: accentText }}
                  >
                    {icon}
                  </div>
                  <span
                    className="font-sans text-xs tracking-widest uppercase px-2 py-1"
                    style={{
                      background: accent + "22",
                      color: accentText,
                      letterSpacing: "0.12em",
                    }}
                  >
                    {source}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <h3
                    className="font-display mb-2"
                    style={{ fontSize: "1.25rem", color: "#f5f0e8" }}
                  >
                    {title}
                  </h3>
                  <p
                    className="font-sans leading-relaxed"
                    style={{ color: "#7a7060", fontSize: "0.9375rem" }}
                  >
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA BAND ───────────────────────────────────────────────── */}
      <section
        className="relative py-28 px-6 lg:px-12 overflow-hidden text-center"
        style={{ background: "#0d0b15" }}
      >
        {/* Decorative background word */}
        <span
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-display font-bold pointer-events-none select-none"
          style={{
            fontSize: "clamp(5rem, 20vw, 16rem)",
            lineHeight: 1,
            WebkitTextStroke: "1px rgba(201,169,110,0.05)",
            color: "transparent",
            letterSpacing: "-0.04em",
          }}
          aria-hidden="true"
        >
          WANDER
        </span>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2
            className="font-display leading-tight mb-6"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#f5f0e8" }}
          >
            Ready to start your journey?
          </h2>
          <p
            className="font-sans leading-relaxed mb-10"
            style={{ color: "#7a7060", fontSize: "1.0625rem" }}
          >
            Join thousands of travelers building their ultimate bucket list.
            Free to start — no credit card required.
          </p>
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <Link
              href="/explore"
              className="font-sans font-medium inline-flex items-center gap-2 px-10 py-4 transition-all duration-200 hover:gap-3"
              style={{
                background: "#c9a96e",
                color: "#08060e",
                fontSize: "0.9375rem",
                letterSpacing: "0.02em",
              }}
            >
              Explore All Countries
              <IconArrow />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        className="py-8 px-6 lg:px-12"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#08060e",
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span
            className="font-display italic"
            style={{ color: "#c9a96e", fontSize: "1.125rem" }}
          >
            Travel Bucket List
          </span>

          <p
            className="font-sans text-sm text-center sm:text-right"
            style={{ color: "#4a4438" }}
          >
            Photos by{" "}
            <a
              href="https://www.pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[#7a7060]"
            >
              Pexels
            </a>
            {" · "}
            Safety data via{" "}
            <a
              href="https://travel.state.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[#7a7060]"
            >
              U.S. State Dept.
            </a>
            {" · "}
            Attractions via{" "}
            <a
              href="https://opentripmap.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[#7a7060]"
            >
              OpenTripMap
            </a>
            {" · "}
            Cost data via{" "}
            <a
              href="https://teleport.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline transition-colors hover:text-[#7a7060]"
            >
              Teleport
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

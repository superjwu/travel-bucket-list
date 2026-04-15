"use client";

import Image from "next/image";
import Link from "next/link";
import type { Country } from "@/lib/countries";
import { formatPopulation } from "@/lib/countries";
import { getSafetyDotColor } from "@/lib/safety";

interface CountryCardProps {
  country: Country;
  isSaved?: boolean;
  safetyLevel?: number;
  photoUrl?: string;
  lazy?: boolean;
  variant?: "tall" | "medium" | "short";
}

const ASPECT = {
  tall: "aspect-[2/3]",
  medium: "aspect-[4/3]",
  short: "aspect-[3/2]",
};

export function CountryCard({
  country,
  isSaved,
  safetyLevel,
  photoUrl,
  lazy,
  variant = "medium",
}: CountryCardProps) {
  const capital = country.capital?.[0] ?? "N/A";
  const pop = formatPopulation(country.population);
  const dotColor = getSafetyDotColor(safetyLevel ?? 0);
  const hasPhoto = !!photoUrl;

  return (
    <Link
      href={`/country/${country.cca3}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-xl hover:ring-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Image area — variable height based on variant */}
      <div className={`relative w-full overflow-hidden bg-surface-dim ${ASPECT[variant]}`}>
        {hasPhoto ? (
          <Image
            src={photoUrl}
            alt={`${country.name.common} travel`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading={lazy ? "lazy" : "eager"}
            unoptimized
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-surface-dim to-accent/10" />
            <Image
              src={country.flags.svg}
              alt={`Flag of ${country.name.common}`}
              fill
              className="object-cover opacity-25 blur-sm"
              unoptimized
              loading="lazy"
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Top-left: region */}
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm">
            {country.region}
          </span>
        </div>

        {/* Top-right: safety + saved */}
        <div className="absolute right-3 top-3 flex items-center gap-2">
          {safetyLevel !== undefined && safetyLevel > 0 && (
            <span
              className={`h-3 w-3 rounded-full ring-2 ring-white/60 ${dotColor}`}
              title={`Safety level ${safetyLevel}`}
            />
          )}
          {isSaved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
              <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-5.121-5.121a1 1 0 111.414-1.414L8.414 12.172l6.879-6.879a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Saved
            </span>
          )}
        </div>

        {/* Bottom content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-end justify-between">
            <div className="flex-1 min-w-0 mr-3">
              <h3 className="font-display text-lg font-semibold leading-tight text-white drop-shadow-sm sm:text-xl">
                {country.name.common}
              </h3>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/70">
                <svg className="h-3 w-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z" clipRule="evenodd" />
                </svg>
                {capital} · {pop}
              </p>
            </div>
            {/* Small flag badge */}
            <Image
              src={country.flags.svg}
              alt=""
              width={24}
              height={16}
              className="shrink-0 rounded-[2px] shadow-sm ring-1 ring-white/30"
              unoptimized
            />
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white shadow-lg">
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}

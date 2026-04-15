"use client";

import Image from "next/image";
import Link from "next/link";
import type { Country } from "@/lib/countries";

interface CountryCardProps {
  country: Country;
  isSaved?: boolean;
}

export function CountryCard({ country, isSaved }: CountryCardProps) {
  return (
    <Link
      href={`/country/${country.cca3}`}
      className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg hover:-translate-y-0.5 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={country.flags.svg}
          alt={`Flag of ${country.name.common}`}
          fill
          className="object-cover transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {isSaved && (
          <div className="absolute right-2 top-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-medium text-white">
            Saved
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          {country.name.common}
        </h3>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          {country.region}
          {country.subregion ? ` · ${country.subregion}` : ""}
        </p>
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>
            {country.capital?.[0] ?? "N/A"}
          </span>
          <span>
            {new Intl.NumberFormat().format(country.population)} people
          </span>
        </div>
      </div>
    </Link>
  );
}

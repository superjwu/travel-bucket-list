"use client";

import { useMemo, useState, useCallback } from "react";
import type { Country } from "@/lib/countries";
import { CountryCard } from "@/components/CountryCard";
import { SearchBar } from "@/components/SearchBar";
import { RegionFilter } from "@/components/RegionFilter";
import { POPULARITY_SCORES, EU_COUNTRIES } from "@/lib/popular-countries";

type SortKey = "popular" | "name" | "population";
const PAGE_SIZE = 24;

interface ExploreClientProps {
  countries: Country[];
  savedCodes: Set<string>;
  safetyMap: Record<string, number>;
  photoMap: Record<string, string>;
  isLoggedIn: boolean;
}

export function ExploreClient({
  countries,
  savedCodes,
  safetyMap,
  photoMap,
  isLoggedIn,
}: ExploreClientProps) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = countries;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.common.toLowerCase().includes(q) ||
          c.capital?.[0]?.toLowerCase().includes(q)
      );
    }

    if (region) {
      list = list.filter((c) => c.region === region);
    }

    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.common.localeCompare(b.name.common);
      if (sort === "population") return b.population - a.population;

      const scoreA = POPULARITY_SCORES[a.cca3] ?? 0;
      const scoreB = POPULARITY_SCORES[b.cca3] ?? 0;

      if (isLoggedIn) {
        const euA = EU_COUNTRIES.has(a.cca3);
        const euB = EU_COUNTRIES.has(b.cca3);
        if (euA && !euB) return -1;
        if (!euA && euB) return 1;
      }

      if (scoreA !== scoreB) return scoreB - scoreA;
      return a.name.common.localeCompare(b.name.common);
    });

    return list;
  }, [countries, search, region, sort, isLoggedIn]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    setVisibleCount((v) => Math.min(v + PAGE_SIZE, filtered.length));
  }, [filtered.length]);

  const handleSearch = useCallback((v: string) => {
    setSearch(v);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleRegion = useCallback((v: string) => {
    setRegion(v);
    setVisibleCount(PAGE_SIZE);
  }, []);

  const handleSort = useCallback((v: SortKey) => {
    setSort(v);
    setVisibleCount(PAGE_SIZE);
  }, []);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <SearchBar value={search} onChange={handleSearch} />
        </div>
        <select
          value={sort}
          onChange={(e) => handleSort(e.target.value as SortKey)}
          className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          <option value="popular">Popular</option>
          <option value="name">Name A-Z</option>
          <option value="population">Population</option>
        </select>
      </div>

      <div className="mt-4">
        <RegionFilter selected={region} onChange={handleRegion} />
      </div>

      <p className="mt-4 text-sm text-foreground/50">
        {filtered.length === 0
          ? "No countries found"
          : `${filtered.length} ${filtered.length === 1 ? "country" : "countries"}`}
      </p>

      {/* Pinterest / Masonry Grid */}
      {visible.length > 0 ? (
        <>
          <div className="mt-6 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
            {visible.map((country, index) => {
              // Vary card height: top-ranked get tall, others alternate
              const score = POPULARITY_SCORES[country.cca3] ?? 0;
              const variant: "tall" | "medium" | "short" =
                score >= 85
                  ? "tall"
                  : score >= 40
                    ? "medium"
                    : index % 3 === 0
                      ? "medium"
                      : "short";

              return (
                <div key={country.cca3} className="mb-5 break-inside-avoid">
                  <CountryCard
                    country={country}
                    isSaved={savedCodes.has(country.cca3)}
                    safetyLevel={safetyMap[country.cca2]}
                    photoUrl={photoMap[country.cca3]}
                    lazy={!photoMap[country.cca3] && index >= 8}
                    variant={variant}
                  />
                </div>
              );
            })}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={loadMore}
                className="rounded-full border border-border bg-surface px-8 py-2.5 text-sm font-semibold text-foreground shadow-sm hover:bg-surface-dim hover:shadow-md"
              >
                Show More ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-20 text-center">
          <p className="text-lg font-semibold text-foreground/60">
            No countries found
          </p>
          <p className="mt-1 text-sm text-foreground/40">
            Try a different search term or region filter.
          </p>
        </div>
      )}
    </div>
  );
}

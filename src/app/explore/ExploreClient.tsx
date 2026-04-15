"use client";

import { useMemo, useState } from "react";
import type { Country } from "@/lib/countries";
import { CountryCard } from "@/components/CountryCard";
import { SearchBar } from "@/components/SearchBar";
import { RegionFilter } from "@/components/RegionFilter";

type SortKey = "name" | "population";

interface ExploreClientProps {
  countries: Country[];
  savedCodes: Set<string>;
  safetyMap: Record<string, number>;
}

export function ExploreClient({ countries, savedCodes, safetyMap }: ExploreClientProps) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

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
      return b.population - a.population;
    });

    return list;
  }, [countries, search, region, sort]);

  return (
    <div>
      {/* Controls row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex items-center gap-3">
          <label htmlFor="explore-sort" className="sr-only">
            Sort by
          </label>
          <select
            id="explore-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          >
            <option value="name">Sort by Name</option>
            <option value="population">Sort by Population</option>
          </select>
        </div>
      </div>

      {/* Region pills */}
      <div className="mt-4">
        <RegionFilter selected={region} onChange={setRegion} />
      </div>

      {/* Result count */}
      <p className="mt-4 text-sm text-foreground/50">
        {filtered.length === 0
          ? "No countries found"
          : `${filtered.length} ${filtered.length === 1 ? "country" : "countries"}`}
      </p>

      {/* Grid — first card spans 2 columns at lg+ */}
      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((country, index) => (
            <div
              key={country.cca3}
              className={index === 0 ? "lg:col-span-2" : undefined}
            >
              <CountryCard
                country={country}
                isSaved={savedCodes.has(country.cca3)}
                safetyLevel={safetyMap[country.cca2]}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-20 text-center">
          <p className="text-lg font-semibold text-foreground/60">No countries found</p>
          <p className="mt-1 text-sm text-foreground/40">
            Try a different search term or region filter.
          </p>
        </div>
      )}
    </div>
  );
}

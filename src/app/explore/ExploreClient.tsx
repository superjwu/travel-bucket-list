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
}

export function ExploreClient({ countries, savedCodes }: ExploreClientProps) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [sort, setSort] = useState<SortKey>("name");

  const filtered = useMemo(() => {
    let list = countries;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.common.toLowerCase().includes(q));
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-sm">
          <SearchBar value={search} onChange={setSearch} />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          >
            <option value="name">Sort by Name</option>
            <option value="population">Sort by Population</option>
          </select>
        </div>
      </div>

      <div className="mt-4">
        <RegionFilter selected={region} onChange={setRegion} />
      </div>

      <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
        {filtered.length} {filtered.length === 1 ? "country" : "countries"} found
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((country) => (
          <CountryCard
            key={country.cca3}
            country={country}
            isSaved={savedCodes.has(country.cca3)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
            No countries found
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Try a different search term or region filter.
          </p>
        </div>
      )}
    </div>
  );
}

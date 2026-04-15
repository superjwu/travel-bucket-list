"use client";

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

interface RegionFilterProps {
  selected: string;
  onChange: (region: string) => void;
}

export function RegionFilter({ selected, onChange }: RegionFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {REGIONS.map((region) => (
        <button
          key={region}
          onClick={() => onChange(region === "All" ? "" : region)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            (region === "All" && !selected) || region === selected
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
          }`}
        >
          {region}
        </button>
      ))}
    </div>
  );
}

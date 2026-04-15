"use client";

import { useMemo, useState } from "react";
import { BucketListCard } from "@/components/BucketListCard";
import type { BucketListItem } from "@/lib/types";
import { useRouter } from "next/navigation";

type FilterKey = "all" | "visited" | "want";
type SortKey = "date" | "priority" | "name";

interface BucketListClientProps {
  items: BucketListItem[];
}

export function BucketListClient({ items }: BucketListClientProps) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sort, setSort] = useState<SortKey>("date");

  const filtered = useMemo(() => {
    let list = items;

    if (filter === "visited") {
      list = list.filter((i) => i.visited);
    } else if (filter === "want") {
      list = list.filter((i) => !i.visited);
    }

    list = [...list].sort((a, b) => {
      if (sort === "name") return a.country_name.localeCompare(b.country_name);
      if (sort === "priority") return b.priority - a.priority;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [items, filter, sort]);

  const stats = useMemo(() => {
    const visited = items.filter((i) => i.visited).length;
    return {
      total: items.length,
      visited,
      want: items.length - visited,
    };
  }, [items]);

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.total}</p>
          <p className="text-sm text-zinc-500">Total</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-2xl font-bold text-green-600">{stats.visited}</p>
          <p className="text-sm text-zinc-500">Visited</p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-2xl font-bold text-blue-600">{stats.want}</p>
          <p className="text-sm text-zinc-500">Want to Visit</p>
        </div>
      </div>

      {/* Filters & Sort */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(
            [
              ["all", "All"],
              ["want", "Want to Visit"],
              ["visited", "Visited"],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === key
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <option value="date">Sort by Date Added</option>
          <option value="priority">Sort by Priority</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <BucketListCard
            key={item.id}
            item={item}
            onRemoved={() => router.refresh()}
          />
        ))}
      </div>

      {filtered.length === 0 && items.length > 0 && (
        <div className="mt-16 text-center">
          <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
            No countries match this filter
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Try a different filter option.
          </p>
        </div>
      )}
    </div>
  );
}

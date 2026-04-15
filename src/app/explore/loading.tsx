export default function ExploreLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
        <div className="mt-2 h-5 w-96 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="flex gap-4">
        <div className="h-10 w-80 animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
          >
            <div className="aspect-[3/2] animate-pulse bg-zinc-200 dark:bg-zinc-800" />
            <div className="p-4 space-y-2">
              <div className="h-5 w-32 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl">🌎</div>
      <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Your bucket list is empty
      </h2>
      <p className="mt-2 max-w-md text-zinc-500 dark:text-zinc-400">
        Start exploring countries around the world and add them to your travel
        bucket list to keep track of where you want to go.
      </p>
      <Link
        href="/explore"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Start Exploring
      </Link>
    </div>
  );
}

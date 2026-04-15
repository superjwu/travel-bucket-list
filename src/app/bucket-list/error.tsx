"use client";

export default function BucketListError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
      <div className="text-5xl">😵</div>
      <h2 className="mt-4 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Something went wrong
      </h2>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        We couldn&apos;t load your bucket list. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
}

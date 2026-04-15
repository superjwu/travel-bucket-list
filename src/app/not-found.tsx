import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <div className="text-6xl">🗺️</div>
      <h1 className="mt-4 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        Page Not Found
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        This destination doesn&apos;t exist on our map.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
}

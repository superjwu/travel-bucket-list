import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="text-7xl">🌍</div>
        <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl dark:text-zinc-100">
          Your World Travel Bucket List
        </h1>
        <p className="mt-4 max-w-lg text-lg text-zinc-600 dark:text-zinc-400">
          Discover countries, save your dream destinations, and track your
          travels around the globe.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/explore"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            Start Exploring
          </Link>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900">
                Sign In to Save
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <Link
              href="/bucket-list"
              className="rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              My Bucket List
            </Link>
          </Show>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-200 bg-zinc-50 px-4 py-16 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            How It Works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <FeatureCard
              icon="🔍"
              title="Explore"
              description="Browse 250+ countries with details like capitals, languages, currencies, and population."
            />
            <FeatureCard
              icon="📌"
              title="Save"
              description="Add countries to your bucket list with personal notes, travel dates, and priority ratings."
            />
            <FeatureCard
              icon="✅"
              title="Track"
              description="Mark countries as visited, filter your list, and watch your travel progress grow."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-4 py-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        Built with Next.js, Tailwind CSS, Clerk, and Supabase.
        Data from{" "}
        <a
          href="https://restcountries.com"
          className="underline hover:text-zinc-700 dark:hover:text-zinc-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          REST Countries API
        </a>
        .
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
    </div>
  );
}

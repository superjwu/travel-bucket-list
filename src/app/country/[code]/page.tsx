import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryByCode } from "@/lib/countries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { AddToBucketList } from "@/components/AddToBucketList";

export async function generateMetadata(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const country = await getCountryByCode(code);
  if (!country) return { title: "Country Not Found" };
  return {
    title: `${country.name.common} | Travel Bucket List`,
    description: `Learn about ${country.name.common} and add it to your travel bucket list`,
  };
}

export default async function CountryPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const country = await getCountryByCode(code);
  if (!country) notFound();

  // Check if user has this country saved
  let savedItem = null;
  const { userId } = await auth();
  if (userId) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("bucket_list_items")
      .select("*")
      .eq("country_code", country.cca3)
      .single();
    savedItem = data;
  }

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c) => `${c.name} (${c.symbol})`)
        .join(", ")
    : "N/A";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/explore"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Explore
      </Link>

      <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative aspect-[2/1] bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={country.flags.svg}
            alt={`Flag of ${country.name.common}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                {country.name.common}
              </h1>
              <p className="mt-1 text-lg text-zinc-500 dark:text-zinc-400">
                {country.name.official}
              </p>
            </div>
            {userId && (
              <AddToBucketList
                countryCode={country.cca3}
                countryName={country.name.common}
                flagUrl={country.flags.svg}
                region={country.region}
                isSaved={!!savedItem}
              />
            )}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InfoItem label="Region" value={`${country.region}${country.subregion ? ` · ${country.subregion}` : ""}`} />
            <InfoItem label="Capital" value={country.capital?.join(", ") ?? "N/A"} />
            <InfoItem label="Population" value={new Intl.NumberFormat().format(country.population)} />
            <InfoItem label="Languages" value={languages} />
            <InfoItem label="Currencies" value={currencies} />
            <InfoItem label="Country Code" value={country.cca3} />
          </div>

          {savedItem && (
            <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                This country is in your bucket list!
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-green-700 dark:text-green-300">
                <span>Status: {savedItem.visited ? "Visited" : "Want to Visit"}</span>
                {savedItem.priority > 0 && (
                  <span>Priority: {"★".repeat(savedItem.priority)}{"☆".repeat(5 - savedItem.priority)}</span>
                )}
                {savedItem.travel_date && (
                  <span>Date: {savedItem.travel_date}</span>
                )}
              </div>
              {savedItem.notes && (
                <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                  Notes: {savedItem.notes}
                </p>
              )}
              <Link
                href="/bucket-list"
                className="mt-3 inline-block text-sm font-medium text-green-700 underline hover:text-green-900 dark:text-green-300 dark:hover:text-green-100"
              >
                View in My Bucket List
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </dt>
      <dd className="mt-1 text-base text-zinc-900 dark:text-zinc-100">
        {value}
      </dd>
    </div>
  );
}

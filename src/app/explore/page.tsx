import { getAllCountries } from "@/lib/countries";
import { getTravelAdvisories } from "@/lib/safety";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { ExploreClient } from "./ExploreClient";

export const metadata = {
  title: "Explore Countries | Travel Bucket List",
  description: "Browse and discover countries around the world",
};

export default async function ExplorePage() {
  // Fetch countries + advisories in parallel
  const [countries, advisories] = await Promise.all([
    getAllCountries(),
    getTravelAdvisories(),
  ]);

  // Build safety map: cca2 (ISO alpha-2) → advisory level
  const safetyMap: Record<string, number> = {};
  for (const [code, advisory] of advisories.entries()) {
    // The advisory uses alpha-2 codes; store directly
    safetyMap[code] = advisory.level;
  }

  // If user is signed in, fetch their saved country codes
  let savedCodes = new Set<string>();
  const { userId } = await auth();
  if (userId) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("bucket_list_items")
      .select("country_code");
    if (data) {
      savedCodes = new Set(data.map((d) => d.country_code));
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Explore Countries
        </h1>
        <p className="mt-2 text-foreground/60">
          Discover {countries.length} countries around the world and add them to
          your bucket list.
        </p>
      </div>

      <ExploreClient
        countries={countries}
        savedCodes={savedCodes}
        safetyMap={safetyMap}
      />
    </div>
  );
}

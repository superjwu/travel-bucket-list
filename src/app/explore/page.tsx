import { getAllCountries } from "@/lib/countries";
import { getTravelAdvisories } from "@/lib/safety";
import { getPhotoMapForCountries } from "@/lib/pexels";
import { PHOTO_COUNTRIES } from "@/lib/popular-countries";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { ExploreClient } from "./ExploreClient";

export const metadata = {
  title: "Explore Countries | Travel Bucket List",
  description: "Browse and discover countries around the world",
};

export default async function ExplorePage() {
  // Fetch everything in parallel
  const [countries, advisories, photoMap, authResult] = await Promise.all([
    getAllCountries(),
    getTravelAdvisories(),
    getPhotoMapForCountries(PHOTO_COUNTRIES),
    auth(),
  ]);

  // Build safety map: cca2 → level
  const safetyMap: Record<string, number> = {};
  for (const [code, advisory] of advisories.entries()) {
    safetyMap[code] = advisory.level;
  }

  // If signed in, fetch saved codes
  let savedCodes = new Set<string>();
  const isLoggedIn = !!authResult.userId;
  if (isLoggedIn) {
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
        photoMap={photoMap}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

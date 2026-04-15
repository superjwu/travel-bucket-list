export interface CityScore {
  name: string;
  score: number;
  color: string;
}

export interface CityScores {
  summary: string;
  categories: CityScore[];
  teleportCityScore: number;
}

export async function getCityScores(
  capitalName: string
): Promise<CityScores | null> {
  try {
    // Step 1: Search for city to get urban area slug
    const searchRes = await fetch(
      `https://api.teleport.org/api/cities/?search=${encodeURIComponent(capitalName)}&limit=1`,
      { next: { revalidate: 86400 } }
    );
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const cityResult =
      searchData?._embedded?.["city:search-results"]?.[0];
    if (!cityResult) return null;

    // Step 2: Get city detail to find urban area link
    const cityRes = await fetch(cityResult._links?.["city:item"]?.href, {
      next: { revalidate: 86400 },
    });
    if (!cityRes.ok) return null;

    const cityData = await cityRes.json();
    const urbanAreaHref =
      cityData?._links?.["city:urban_area"]?.href;
    if (!urbanAreaHref) return null;

    // Step 3: Get scores for the urban area
    const scoresRes = await fetch(`${urbanAreaHref}scores/`, {
      next: { revalidate: 86400 },
    });
    if (!scoresRes.ok) return null;

    const scoresData = await scoresRes.json();

    return {
      summary: scoresData.summary || "",
      teleportCityScore: scoresData.teleport_city_score || 0,
      categories: (scoresData.categories ?? []).map(
        (c: Record<string, unknown>) => ({
          name: c.name,
          score: (c.score_out_of_10 as number) || 0,
          color: (c.color as string) || "#6366f1",
        })
      ),
    };
  } catch {
    return null;
  }
}

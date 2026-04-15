export interface PexelsPhoto {
  id: number;
  src: string;
  srcLarge: string;
  srcSmall: string;
  photographer: string;
  photographerUrl: string;
  alt: string;
}

// Batch fetch one photo per country for the explore grid
// Returns a map of cca3 code → photo URL (medium size for fast loading)
export async function getPhotoMapForCountries(
  countryQueries: Record<string, string>
): Promise<Record<string, string>> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return {};

  const entries = Object.entries(countryQueries);
  const results: Record<string, string> = {};

  // Fetch in batches of 15 to stay well under rate limits
  for (let i = 0; i < entries.length; i += 15) {
    const batch = entries.slice(i, i + 15);
    const fetches = batch.map(async ([code, query]) => {
      try {
        const res = await fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
          {
            headers: { Authorization: key },
            next: { revalidate: 86400 },
          }
        );
        if (!res.ok) return;
        const data = await res.json();
        const photo = data.photos?.[0];
        if (photo) {
          results[code] = photo.src.medium;
        }
      } catch {
        // Skip failed fetches
      }
    });
    await Promise.all(fetches);
  }

  return results;
}

export async function getCountryPhotos(
  countryName: string,
  perPage = 6
): Promise<PexelsPhoto[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];

  const query = `${countryName} landmarks travel`;
  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
    {
      headers: { Authorization: key },
      next: { revalidate: 86400 },
    }
  );

  if (!res.ok) return [];
  const data = await res.json();

  return (data.photos ?? []).map((p: Record<string, unknown>) => ({
    id: p.id,
    src: (p.src as Record<string, string>).landscape,
    srcLarge: (p.src as Record<string, string>).large2x,
    srcSmall: (p.src as Record<string, string>).medium,
    photographer: p.photographer,
    photographerUrl: p.photographer_url,
    alt: (p.alt as string) || `${countryName} travel photo`,
  }));
}

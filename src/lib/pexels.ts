export interface PexelsPhoto {
  id: number;
  src: string;
  srcLarge: string;
  srcSmall: string;
  photographer: string;
  photographerUrl: string;
  alt: string;
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

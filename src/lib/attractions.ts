export interface Attraction {
  xid: string;
  name: string;
  kinds: string;
  lat: number;
  lon: number;
  rate: number;
}

export interface AttractionDetail {
  xid: string;
  name: string;
  kinds: string;
  description: string;
  image: string;
  preview: string;
  wikipedia: string;
  url: string;
  rate: number;
  address: string;
}

// Category labels for display
const KIND_LABELS: Record<string, string> = {
  architecture: "Architecture",
  historic_architecture: "Historic",
  churches: "Church",
  castles: "Castle",
  monuments_and_memorials: "Monument",
  museums: "Museum",
  natural: "Nature",
  beaches: "Beach",
  mountains: "Mountain",
  parks: "Park",
  theatres_and_entertainments: "Entertainment",
  sport: "Sport",
  gardens_and_parks: "Garden",
  view_points: "Viewpoint",
  archaeological_sites: "Archaeological",
  bridges: "Bridge",
  towers: "Tower",
  lighthouses: "Lighthouse",
};

export function getAttractionCategory(kinds: string): string {
  for (const [key, label] of Object.entries(KIND_LABELS)) {
    if (kinds.includes(key)) return label;
  }
  return "Place of Interest";
}

export async function getAttractions(
  lat: number,
  lon: number,
  limit = 15
): Promise<Attraction[]> {
  const key = process.env.OPENTRIPMAP_API_KEY;
  if (!key) return [];

  try {
    // Use large radius (500km) to cover entire country area from capital
    const radius = 500000;
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=interesting_places,architecture,historic,museums,natural,beaches&rate=2&format=json&limit=${limit}&apikey=${key}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    // Deduplicate by name and sort by rating
    const seen = new Set<string>();
    return (data ?? [])
      .filter((p: Record<string, unknown>) => {
        const name = p.name as string;
        if (!name || seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
        ((b.rate as number) || 0) - ((a.rate as number) || 0)
      )
      .map((p: Record<string, unknown>) => ({
        xid: p.xid,
        name: p.name,
        kinds: p.kinds || "",
        lat: (p.point as Record<string, number>)?.lat ?? 0,
        lon: (p.point as Record<string, number>)?.lon ?? 0,
        rate: p.rate || 0,
      }));
  } catch {
    return [];
  }
}

// Extract a clean English name from an English Wikipedia URL
// e.g. "https://en.wikipedia.org/wiki/Eiffel_Tower" → "Eiffel Tower"
function englishNameFromWikipedia(url: string): string | null {
  if (!url || !url.includes("en.wikipedia.org/wiki/")) return null;
  try {
    const path = new URL(url).pathname;
    const slug = path.split("/wiki/")[1];
    if (!slug) return null;
    return decodeURIComponent(slug).replace(/_/g, " ").replace(/ \(.*\)$/, "");
  } catch {
    return null;
  }
}

export async function getAttractionDetail(
  xid: string
): Promise<AttractionDetail | null> {
  const key = process.env.OPENTRIPMAP_API_KEY;
  if (!key) return null;

  try {
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/xid/${xid}?apikey=${key}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const d = await res.json();

    // Prefer English name from Wikipedia, fall back to API name
    const localName = d.name || "";
    const wikiName = englishNameFromWikipedia(d.wikipedia || "");
    const englishName = wikiName || localName;

    // Use English Wikipedia extracts for description (already in English)
    const description = d.wikipedia_extracts?.text || d.info?.descr || "";

    return {
      xid: d.xid || xid,
      name: englishName,
      kinds: d.kinds || "",
      description,
      image: d.image || "",
      preview: d.preview?.source || "",
      wikipedia: d.wikipedia || "",
      url: d.url || "",
      rate: d.rate || 0,
      address: [d.address?.road, d.address?.city, d.address?.country]
        .filter(Boolean)
        .join(", "),
    };
  } catch {
    return null;
  }
}

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

export async function getAttractions(
  lat: number,
  lon: number,
  limit = 8
): Promise<Attraction[]> {
  const key = process.env.OPENTRIPMAP_API_KEY;
  if (!key) return [];

  try {
    const radius = 50000; // 50km radius from capital
    const res = await fetch(
      `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&kinds=interesting_places&rate=3&format=json&limit=${limit}&apikey=${key}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];

    const data = await res.json();
    return (data ?? [])
      .filter((p: Record<string, unknown>) => p.name)
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
    return {
      xid: d.xid || xid,
      name: d.name || "",
      kinds: d.kinds || "",
      description: d.info?.descr || d.wikipedia_extracts?.text || "",
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

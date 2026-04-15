const BASE_URL = "https://restcountries.com/v3.1";

// REST Countries API limits to 10 fields per request
const LIST_FIELDS = "name,cca2,cca3,flags,region,subregion,capital,population,languages,latlng";
const DETAIL_FIELDS = "name,cca2,cca3,flags,region,subregion,capital,population,languages,currencies";
const DETAIL_EXTRA_FIELDS = "latlng,area,borders,maps,coatOfArms,demonyms,timezones,car,name,cca3";

export interface Country {
  name: { common: string; official: string };
  cca2: string;
  cca3: string;
  flags: { svg: string; png: string };
  region: string;
  subregion?: string;
  capital?: string[];
  population: number;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
  latlng?: [number, number];
  area?: number;
  borders?: string[];
  maps?: { googleMaps: string; openStreetMaps: string };
  coatOfArms?: { svg: string; png: string };
  demonyms?: { eng: { m: string; f: string } };
  timezones?: string[];
  car?: { side: string };
}

export async function getAllCountries(): Promise<Country[]> {
  const res = await fetch(`${BASE_URL}/all?fields=${LIST_FIELDS}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export async function getCountryByCode(
  code: string
): Promise<Country | null> {
  // Fetch both field sets in parallel to get all data within 10-field limit
  const [res1, res2] = await Promise.all([
    fetch(`${BASE_URL}/alpha/${code}?fields=${DETAIL_FIELDS}`, {
      next: { revalidate: 86400 },
    }),
    fetch(`${BASE_URL}/alpha/${code}?fields=${DETAIL_EXTRA_FIELDS}`, {
      next: { revalidate: 86400 },
    }),
  ]);

  if (res1.status === 404 || res2.status === 404) return null;
  if (!res1.ok || !res2.ok) throw new Error("Failed to fetch country");

  const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
  const d1 = Array.isArray(data1) ? data1[0] : data1;
  const d2 = Array.isArray(data2) ? data2[0] : data2;

  return { ...d1, ...d2 };
}

export function formatPopulation(pop: number): string {
  if (pop >= 1_000_000_000) return `${(pop / 1_000_000_000).toFixed(1)}B`;
  if (pop >= 1_000_000) return `${(pop / 1_000_000).toFixed(1)}M`;
  if (pop >= 1_000) return `${(pop / 1_000).toFixed(0)}K`;
  return pop.toString();
}

export function formatArea(area: number): string {
  if (area >= 1_000_000) return `${(area / 1_000_000).toFixed(2)}M km²`;
  return `${new Intl.NumberFormat().format(Math.round(area))} km²`;
}

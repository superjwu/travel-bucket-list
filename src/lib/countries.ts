const BASE_URL = "https://restcountries.com/v3.1";
const FIELDS =
  "name,cca2,cca3,flags,region,subregion,capital,population,languages,currencies,latlng,area,borders,maps,coatOfArms,demonyms,timezones,car";

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
  const res = await fetch(`${BASE_URL}/all?fields=${FIELDS}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error("Failed to fetch countries");
  return res.json();
}

export async function getCountryByCode(
  code: string
): Promise<Country | null> {
  const res = await fetch(`${BASE_URL}/alpha/${code}?fields=${FIELDS}`, {
    next: { revalidate: 86400 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch country");
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
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

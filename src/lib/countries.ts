const BASE_URL = "https://restcountries.com/v3.1";
const FIELDS =
  "name,cca3,flags,region,subregion,capital,population,languages,currencies";

export interface Country {
  name: { common: string; official: string };
  cca3: string;
  flags: { svg: string; png: string };
  region: string;
  subregion?: string;
  capital?: string[];
  population: number;
  languages?: Record<string, string>;
  currencies?: Record<string, { name: string; symbol: string }>;
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

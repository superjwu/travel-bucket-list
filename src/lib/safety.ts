export interface TravelAdvisory {
  countryCode: string;
  countryName: string;
  level: number;
  levelDescription: string;
  lastUpdated: string;
}

export interface CountrySafetyDetail {
  safetyAndSecurity: string;
  health: string;
  entryExitRequirements: string;
  lastUpdated: string;
}

const LEVEL_DESCRIPTIONS: Record<number, string> = {
  1: "Exercise Normal Precautions",
  2: "Exercise Increased Caution",
  3: "Reconsider Travel",
  4: "Do Not Travel",
};

let advisoryCache: Map<string, TravelAdvisory> | null = null;
let advisoryCacheTime = 0;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function getTravelAdvisories(): Promise<
  Map<string, TravelAdvisory>
> {
  if (advisoryCache && Date.now() - advisoryCacheTime < CACHE_TTL) {
    return advisoryCache;
  }

  try {
    const res = await fetch(
      "https://cadataapi.state.gov/api/TravelAdvisories",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return new Map();

    const data = await res.json();
    const map = new Map<string, TravelAdvisory>();

    for (const item of data) {
      const code = item.iso_code?.toUpperCase();
      if (!code) continue;

      const level = parseInt(item.advisory_level, 10) || 0;
      map.set(code, {
        countryCode: code,
        countryName: item.geopoliticalarea || "",
        level,
        levelDescription: LEVEL_DESCRIPTIONS[level] || "Unknown",
        lastUpdated: item.last_update_date || "",
      });
    }

    advisoryCache = map;
    advisoryCacheTime = Date.now();
    return map;
  } catch {
    return new Map();
  }
}

export async function getCountrySafety(
  isoCode: string
): Promise<CountrySafetyDetail | null> {
  try {
    const res = await fetch(
      `https://cadataapi.state.gov/api/CountryTravelInformation/${isoCode.toUpperCase()}`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;

    const data = await res.json();
    return {
      safetyAndSecurity: data.safety_and_security || "",
      health: data.health || "",
      entryExitRequirements: data.entry_exit_requirements || "",
      lastUpdated: data.last_update_date || "",
    };
  } catch {
    return null;
  }
}

export function getSafetyColor(level: number): string {
  switch (level) {
    case 1:
      return "bg-green-100 text-green-800 border-green-200";
    case 2:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case 3:
      return "bg-orange-100 text-orange-800 border-orange-200";
    case 4:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-stone-100 text-stone-600 border-stone-200";
  }
}

export function getSafetyDotColor(level: number): string {
  switch (level) {
    case 1: return "bg-green-500";
    case 2: return "bg-yellow-500";
    case 3: return "bg-orange-500";
    case 4: return "bg-red-500";
    default: return "bg-stone-400";
  }
}

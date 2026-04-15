// Tourism popularity scores (0-100) for top travel destinations
// Used for default sort order and deciding which countries get Pexels photos
// Sources: UNWTO tourism rankings, travel search volume

export const POPULARITY_SCORES: Record<string, number> = {
  // Tier 1: Top global destinations
  FRA: 100, ESP: 98, USA: 97, ITA: 96, TUR: 94, MEX: 93, GBR: 92,
  DEU: 91, THA: 90, JPN: 89, AUT: 88, GRC: 87, CHN: 86, PRT: 85,
  // Tier 2: Major travel destinations
  NLD: 83, CAN: 82, AUS: 81, HRV: 80, POL: 79, CZE: 78,
  IND: 77, MAR: 76, SAU: 75, ARE: 74, IDN: 73, KOR: 72,
  HUN: 71, VNM: 70, EGY: 69, SGP: 68, DNK: 67, IRL: 66,
  NZL: 65, BRA: 64, ZAF: 63, NOR: 62, SWE: 61, CHE: 60,
  // Tier 3: Popular EU + notable destinations
  BEL: 58, ROU: 57, BGR: 56, FIN: 55, ARG: 54, PER: 53,
  COL: 52, CHL: 51, ISL: 50, SVN: 49, MLT: 48, CYP: 47,
  EST: 46, LVA: 45, LTU: 44, LUX: 43, SVK: 42, MYS: 41,
  PHL: 40, LKA: 39, NPL: 38, KEN: 37, TZA: 36, CRI: 35,
  CUB: 34, JAM: 33, DOM: 32, PAN: 31, ISR: 30, JOR: 29,
  // Tier 4: Interesting destinations
  GEO: 28, ARM: 27, MNE: 26, ALB: 25, SRB: 24, MKD: 23,
  BIH: 22, UKR: 21, RUS: 20, TUN: 19, SEN: 18, GHA: 17,
  ETH: 16, UGA: 15, RWA: 14, BWA: 13, NAM: 12, MDG: 11,
};

// EU member states (ISO alpha-3)
export const EU_COUNTRIES = new Set([
  "AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST",
  "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA",
  "LTU", "LUX", "MLT", "NLD", "POL", "PRT", "ROU", "SVK",
  "SVN", "ESP", "SWE",
]);

// Countries that should get Pexels photos fetched
export const PHOTO_COUNTRIES: Record<string, string> = {
  FRA: "Paris France Eiffel Tower",
  ESP: "Barcelona Spain",
  USA: "New York City skyline",
  ITA: "Rome Italy Colosseum",
  TUR: "Istanbul Turkey mosque",
  MEX: "Mexico City travel",
  GBR: "London England Big Ben",
  DEU: "Berlin Germany",
  THA: "Bangkok Thailand temple",
  JPN: "Tokyo Japan cherry blossom",
  AUT: "Vienna Austria palace",
  GRC: "Santorini Greece",
  CHN: "Great Wall China",
  PRT: "Lisbon Portugal",
  NLD: "Amsterdam Netherlands canal",
  CAN: "Banff Canada mountains",
  AUS: "Sydney Opera House Australia",
  HRV: "Dubrovnik Croatia",
  POL: "Krakow Poland",
  CZE: "Prague Czech Republic",
  IND: "Taj Mahal India",
  MAR: "Marrakech Morocco",
  ARE: "Dubai skyline",
  IDN: "Bali Indonesia temple",
  KOR: "Seoul South Korea",
  HUN: "Budapest Hungary parliament",
  VNM: "Ha Long Bay Vietnam",
  EGY: "Pyramids Egypt",
  SGP: "Singapore Marina Bay",
  DNK: "Copenhagen Denmark",
  IRL: "Dublin Ireland cliffs",
  NZL: "New Zealand mountains",
  BRA: "Rio de Janeiro Brazil",
  ZAF: "Cape Town South Africa",
  NOR: "Norway fjords",
  SWE: "Stockholm Sweden",
  CHE: "Swiss Alps Switzerland",
  BEL: "Brussels Belgium",
  FIN: "Helsinki Finland aurora",
  ARG: "Buenos Aires Argentina",
  PER: "Machu Picchu Peru",
  ISL: "Iceland waterfall",
  CRI: "Costa Rica rainforest",
  JOR: "Petra Jordan",
  ISR: "Jerusalem Israel",
  CUB: "Havana Cuba",
  SVN: "Lake Bled Slovenia",
  MLT: "Malta Valletta",
  GEO: "Tbilisi Georgia",
  MNE: "Kotor Montenegro",
};

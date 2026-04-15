export type { Place } from "./places-data-1";
import { PLACES_BATCH_1 } from "./places-data-1";
import { PLACES_BATCH_2 } from "./places-data-2";
import { PLACES_BATCH_3 } from "./places-data-3";
import { PLACES_BATCH_4 } from "./places-data-4";
import { PLACES_BATCH_5 } from "./places-data-5";
import type { Place } from "./places-data-1";

export const ALL_PLACES: Record<string, Place[]> = {
  ...PLACES_BATCH_1,
  ...PLACES_BATCH_2,
  ...PLACES_BATCH_3,
  ...PLACES_BATCH_4,
  ...PLACES_BATCH_5,
};

export function getPlacesForCountry(cca3: string): Place[] {
  return ALL_PLACES[cca3] ?? [];
}

import Image from "next/image";
import { getPlacesForCountry } from "@/lib/places";
import { getCountryPhotos } from "@/lib/pexels";

export async function AttractionsSection({ cca3 }: { cca3: string }) {
  const places = getPlacesForCountry(cca3);
  if (places.length === 0) return null;

  // Fetch a Pexels photo for each place in parallel
  const photoResults = await Promise.all(
    places.map((p) => getCountryPhotos(p.pexelsQuery || `${p.name} ${p.city}`, 1))
  );

  const placesWithPhotos = places.map((place, i) => ({
    ...place,
    photo: photoResults[i]?.[0] ?? null,
  }));

  // Split: places with photos as featured, rest as compact
  const featured = placesWithPhotos.filter((p) => p.photo).slice(0, 3);
  const rest = placesWithPhotos.filter((p) => !featured.includes(p));

  const categoryColor: Record<string, string> = {
    Landmark: "bg-blue-100 text-blue-700",
    Museum: "bg-purple-100 text-purple-700",
    Nature: "bg-green-100 text-green-700",
    Beach: "bg-cyan-100 text-cyan-700",
    Historic: "bg-amber-100 text-amber-700",
    Entertainment: "bg-pink-100 text-pink-700",
    Religious: "bg-orange-100 text-orange-700",
    Park: "bg-emerald-100 text-emerald-700",
  };

  return (
    <section className="mb-10">
      <h2 className="mb-2 font-display text-2xl font-semibold">Places of Interest</h2>
      <p className="mb-6 text-sm text-foreground/50">
        {places.length} must-see destinations
      </p>

      {/* Featured places — large cards with photos */}
      {featured.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((place) => (
            <div key={place.name} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg">
              <div className="relative h-44 w-full shrink-0 overflow-hidden bg-surface-dim">
                {place.photo && (
                  <Image
                    src={place.photo.srcSmall}
                    alt={place.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                )}
                <div className="absolute left-2 top-2">
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${categoryColor[place.category] ?? "bg-stone-100 text-stone-600"}`}>
                    {place.category}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-display text-base font-semibold leading-snug">{place.name}</h3>
                <p className="text-[11px] font-medium text-foreground/40">{place.city}</p>
                <p className="flex-1 text-xs leading-relaxed text-foreground/60 line-clamp-3">{place.description}</p>
                {place.photo && (
                  <p className="text-[9px] text-foreground/30">
                    Photo by{" "}
                    <a href={place.photo.photographerUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent hover:underline">
                      {place.photo.photographer}
                    </a>{" "}
                    on Pexels
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remaining places — compact cards */}
      {rest.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {rest.map((place) => (
            <div key={place.name} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 transition-shadow hover:shadow-sm">
              {place.photo ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-dim">
                  <Image src={place.photo.srcSmall} alt={place.name} fill className="object-cover" sizes="64px" unoptimized />
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-surface-dim text-foreground/15">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold leading-snug truncate">{place.name}</h3>
                  <span className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-semibold ${categoryColor[place.category] ?? "bg-stone-100 text-stone-600"}`}>
                    {place.category}
                  </span>
                </div>
                <p className="text-[10px] text-foreground/40">{place.city}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-foreground/50 line-clamp-2">{place.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

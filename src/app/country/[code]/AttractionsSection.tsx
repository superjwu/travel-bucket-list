import Image from "next/image";
import { getAttractions, getAttractionDetail, getAttractionCategory } from "@/lib/attractions";

export async function AttractionsSection({ latlng }: { latlng?: [number, number] }) {
  if (!latlng) return null;
  const [lat, lon] = latlng;

  // Fetch up to 15 attractions with 500km radius
  const attractionsList = await getAttractions(lat, lon, 15);
  if (attractionsList.length === 0) return null;

  // Fetch details for top 12 in parallel
  const top = attractionsList.slice(0, 12);
  const details = await Promise.all(
    top.map((a) => getAttractionDetail(a.xid))
  );

  const validPairs = top
    .map((base, i) => ({ base, detail: details[i] }))
    .filter((p) => p.detail);

  if (validPairs.length === 0) return null;

  // Split into featured (first 3 with images) and rest
  const featured = validPairs.filter((p) => p.detail!.preview).slice(0, 3);
  const rest = validPairs.filter((p) => !featured.includes(p));

  return (
    <section className="mb-10">
      <h2 className="mb-2 font-display text-2xl font-semibold">Places of Interest</h2>
      <p className="mb-6 text-sm text-foreground/50">
        {validPairs.length} notable attractions and landmarks
      </p>

      {/* Featured attractions — large cards */}
      {featured.length > 0 && (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map(({ base, detail }) => {
            const d = detail!;
            const stars = Math.min(5, Math.max(0, Math.round((base.rate / 7) * 5)));
            const category = getAttractionCategory(d.kinds);

            return (
              <div key={d.xid} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-lg">
                <div className="relative h-44 w-full shrink-0 bg-surface-dim overflow-hidden">
                  <Image
                    src={d.preview}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute left-2 top-2">
                    <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      {category}
                    </span>
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="font-display text-base font-semibold leading-snug line-clamp-2">{d.name || base.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <svg key={j} className={`h-3 w-3 ${j < stars ? "text-amber-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {d.address && <span className="text-[10px] text-foreground/40 truncate">{d.address}</span>}
                  </div>
                  {d.description && (
                    <p className="flex-1 text-xs leading-relaxed text-foreground/60 line-clamp-4">{d.description}</p>
                  )}
                  {d.wikipedia && (
                    <a href={d.wikipedia} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                      Wikipedia
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Remaining attractions — compact list */}
      {rest.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {rest.map(({ base, detail }) => {
            const d = detail!;
            const stars = Math.min(5, Math.max(0, Math.round((base.rate / 7) * 5)));
            const category = getAttractionCategory(d.kinds);

            return (
              <div key={d.xid} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-3 transition-shadow hover:shadow-sm">
                {d.preview ? (
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-dim">
                    <Image src={d.preview} alt={d.name} fill className="object-cover" sizes="64px" />
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
                    <h3 className="text-sm font-semibold leading-snug truncate">{d.name || base.name}</h3>
                    <span className="shrink-0 rounded bg-surface-dim px-1.5 py-0.5 text-[9px] font-medium text-foreground/50">{category}</span>
                  </div>
                  <div className="mt-0.5 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className={`h-2.5 w-2.5 ${j < stars ? "text-amber-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {d.description && (
                    <p className="mt-1 text-[11px] leading-relaxed text-foreground/50 line-clamp-2">{d.description}</p>
                  )}
                  <div className="mt-1 flex gap-3">
                    {d.wikipedia && (
                      <a href={d.wikipedia} target="_blank" rel="noopener noreferrer" className="text-[10px] font-medium text-accent hover:underline">Wikipedia</a>
                    )}
                    {d.url && (
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-medium text-accent hover:underline">Website</a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

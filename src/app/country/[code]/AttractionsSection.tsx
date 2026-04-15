import Image from "next/image";
import { getAttractions, getAttractionDetail } from "@/lib/attractions";

export async function AttractionsSection({ latlng }: { latlng?: [number, number] }) {
  if (!latlng) return null;
  const [lat, lon] = latlng;

  const attractionsList = await getAttractions(lat, lon, 6);
  if (attractionsList.length === 0) return null;

  const details = await Promise.all(
    attractionsList.map((a) => getAttractionDetail(a.xid))
  );

  const validDetails = details.filter(Boolean);
  if (validDetails.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-2xl font-semibold">Top Attractions</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {validDetails.map((detail, i) => {
          if (!detail) return null;
          const base = attractionsList[i];
          const stars = Math.min(5, Math.max(0, Math.round((base.rate / 7) * 5)));

          return (
            <div key={detail.xid} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md">
              {detail.preview ? (
                <div className="relative h-36 w-full shrink-0 bg-surface-dim">
                  <Image
                    src={detail.preview}
                    alt={detail.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              ) : (
                <div className="flex h-36 w-full items-center justify-center bg-surface-dim text-foreground/20">
                  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-display text-base font-semibold leading-snug line-clamp-2">{detail.name || base.name}</h3>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className={`h-3.5 w-3.5 ${j < stars ? "text-amber-400" : "text-border"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                {detail.description && <p className="flex-1 text-xs leading-relaxed text-foreground/60 line-clamp-3">{detail.description}</p>}
                {detail.wikipedia && (
                  <a href={detail.wikipedia} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                    Learn more
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
    </section>
  );
}

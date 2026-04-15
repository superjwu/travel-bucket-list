import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getCountryByCode, formatPopulation, formatArea } from "@/lib/countries";
import { getCountryPhotos } from "@/lib/pexels";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { AddToBucketList } from "@/components/AddToBucketList";
import { SafetySection } from "./SafetySection";
import { AttractionsSection } from "./AttractionsSection";
import { CostOfLivingSection } from "./CostOfLivingSection";

export async function generateMetadata(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const country = await getCountryByCode(code);
  if (!country) return { title: "Country Not Found" };
  return {
    title: `${country.name.common} | Travel Bucket List`,
    description: `Explore ${country.name.common} — attractions, safety advisories, cost of living, and more.`,
  };
}

export default async function CountryPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const country = await getCountryByCode(code);
  if (!country) notFound();

  const capitalName = country.capital?.[0];

  // Only fetch FAST data server-side: photo + auth (both < 500ms)
  const [photos, authResult] = await Promise.all([
    getCountryPhotos(country.name.common, 1),
    auth(),
  ]);

  const heroPhoto = photos[0] ?? null;

  // Check bucket list status
  let isSaved = false;
  const { userId } = authResult;
  if (userId) {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from("bucket_list_items")
      .select("id")
      .eq("country_code", country.cca3)
      .single();
    isSaved = !!data;
  }

  const languages = country.languages ? Object.values(country.languages) : [];
  const currencyList = country.currencies ? Object.values(country.currencies) : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero ── */}
      <section className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        {heroPhoto ? (
          <Image
            src={heroPhoto.srcLarge}
            alt={heroPhoto.alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-accent/80 to-accent-dark" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        <Link
          href="/explore"
          className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/60 sm:left-6 sm:top-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Explore
        </Link>

        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8 sm:pb-10">
          <div className="mx-auto max-w-5xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
              <Image src={country.flags.svg} alt="" width={22} height={14} className="rounded-[2px] object-cover shadow-sm" />
              <span className="text-xs font-medium uppercase tracking-widest text-white/90">
                {country.region}{country.subregion ? ` · ${country.subregion}` : ""}
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {country.name.common}
            </h1>
            <p className="mt-1 text-base text-white/70 sm:text-lg">{country.name.official}</p>
          </div>
        </div>

        {heroPhoto && (
          <a href={heroPhoto.photographerUrl} target="_blank" rel="noopener noreferrer"
            className="absolute bottom-2 right-3 text-[10px] text-white/50 hover:text-white/80 sm:bottom-3 sm:right-4">
            Photo by {heroPhoto.photographer} on Pexels
          </a>
        )}
      </section>

      {/* ── Content ── */}
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* Quick Stats Bar */}
        <section className="relative z-10 -mt-8 mb-10">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lg sm:grid-cols-3 md:flex md:divide-x md:divide-border md:rounded-2xl md:p-0 md:shadow-xl">
            <StatCard icon={<PeopleIcon />} label="Population" value={formatPopulation(country.population)} />
            {country.area != null && <StatCard icon={<MapIcon />} label="Area" value={formatArea(country.area)} />}
            {capitalName && <StatCard icon={<BuildingIcon />} label="Capital" value={capitalName} />}
            {languages.length > 0 && (
              <StatCard icon={<ChatIcon />} label="Languages" value={languages.slice(0, 2).join(", ") + (languages.length > 2 ? ` +${languages.length - 2}` : "")} />
            )}
            {country.car?.side && (
              <StatCard icon={<CarIcon />} label="Driving Side" value={country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)} />
            )}
          </div>
        </section>

        {/* Add to Bucket List CTA */}
        <section className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold">Ready to visit {country.name.common}?</h2>
            <p className="mt-0.5 text-sm text-foreground/60">Save it to your bucket list and track your travel plans.</p>
          </div>
          {userId ? (
            <AddToBucketList countryCode={country.cca3} countryName={country.name.common} flagUrl={country.flags.svg} region={country.region} isSaved={isSaved} />
          ) : (
            <Link href="/sign-in" className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add to Bucket List
            </Link>
          )}
        </section>

        {/* DEFERRED SECTIONS — stream in after initial render */}
        <Suspense fallback={<SectionSkeleton title="Travel Advisory" />}>
          <SafetySection cca2={country.cca2} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton title="Top Attractions" />}>
          <AttractionsSection latlng={country.latlng} />
        </Suspense>

        <Suspense fallback={<SectionSkeleton title="Quality of Life" />}>
          <CostOfLivingSection capitalName={capitalName} />
        </Suspense>

        {/* Country Details — instant, no API calls */}
        <section className="mb-10">
          <h2 className="mb-4 font-display text-2xl font-semibold">Country Details</h2>
          <div className="grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
            {currencyList.length > 0 && (
              <DetailItem label="Currencies">
                <div className="flex flex-wrap gap-2">
                  {currencyList.map((c) => (
                    <span key={c.name} className="rounded-lg border border-border bg-surface-dim px-2.5 py-1 text-sm">{c.symbol} {c.name}</span>
                  ))}
                </div>
              </DetailItem>
            )}
            {country.timezones && country.timezones.length > 0 && (
              <DetailItem label="Timezones">
                <div className="flex flex-wrap gap-1.5">
                  {country.timezones.map((tz) => (
                    <span key={tz} className="rounded-md border border-border bg-surface-dim px-2 py-0.5 text-xs font-mono">{tz}</span>
                  ))}
                </div>
              </DetailItem>
            )}
            {country.borders && country.borders.length > 0 && (
              <DetailItem label="Bordering Countries" className="sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {country.borders.map((b) => (
                    <Link key={b} href={`/country/${b}`} className="rounded-lg border border-border bg-surface-dim px-3 py-1 text-sm font-medium hover:border-accent hover:bg-accent-light hover:text-accent">{b}</Link>
                  ))}
                </div>
              </DetailItem>
            )}
            {country.maps && (
              <DetailItem label="Maps" className="sm:col-span-2">
                <div className="flex flex-wrap gap-3">
                  <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-dim px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent">Google Maps</a>
                  <a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-dim px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent">OpenStreetMap</a>
                </div>
              </DetailItem>
            )}
            {country.coatOfArms?.svg && (
              <DetailItem label="Coat of Arms">
                <Image src={country.coatOfArms.svg} alt={`Coat of arms of ${country.name.common}`} width={80} height={80} className="object-contain" />
              </DetailItem>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Shared sub-components ── */

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-2xl font-semibold">{title}</h2>
      <div className="h-32 animate-pulse rounded-2xl bg-surface-dim" />
    </section>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 text-center md:flex-1 md:py-4">
      <span className="text-accent">{icon}</span>
      <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">{label}</span>
      <span className="text-sm font-semibold sm:text-base">{value}</span>
    </div>
  );
}

function DetailItem({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-foreground/50">{label}</p>
      {children}
    </div>
  );
}

function PeopleIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
}
function MapIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>;
}
function BuildingIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>;
}
function ChatIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>;
}
function CarIcon() {
  return <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>;
}

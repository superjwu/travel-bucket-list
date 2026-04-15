import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCountryByCode, formatPopulation, formatArea } from "@/lib/countries";
import { getCountryPhotos } from "@/lib/pexels";
import { getTravelAdvisories, getCountrySafety, getSafetyColor } from "@/lib/safety";
import { getAttractions, getAttractionDetail } from "@/lib/attractions";
import { getCityScores } from "@/lib/teleport";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { auth } from "@clerk/nextjs/server";
import { AddToBucketList } from "@/components/AddToBucketList";

export async function generateMetadata(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const country = await getCountryByCode(code);
  if (!country) return { title: "Country Not Found" };
  return {
    title: `${country.name.common} | Travel Bucket List`,
    description: `Explore ${country.name.common} — attractions, safety advisories, cost of living, and more. Plan your trip today.`,
    openGraph: {
      title: `${country.name.common} | Travel Bucket List`,
      images: [country.flags.svg],
    },
  };
}

export default async function CountryPage(props: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await props.params;
  const country = await getCountryByCode(code);
  if (!country) notFound();

  const [lat, lon] = country.latlng ?? [];
  const capitalName = country.capital?.[0];

  // Fetch all data in parallel
  const [photos, advisoriesMap, safetyDetail, attractionsList, cityScores, authResult] =
    await Promise.all([
      getCountryPhotos(country.name.common, 1),
      getTravelAdvisories(),
      getCountrySafety(country.cca2),
      lat != null && lon != null ? getAttractions(lat, lon, 6) : Promise.resolve([]),
      capitalName ? getCityScores(capitalName) : Promise.resolve(null),
      auth(),
    ]);

  const heroPhoto = photos[0] ?? null;
  const advisory = advisoriesMap.get(country.cca2.toUpperCase()) ?? null;

  // Fetch attraction details in parallel
  const attractionDetails = await Promise.all(
    attractionsList.map((a) => getAttractionDetail(a.xid))
  );

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
  const currencyList = country.currencies
    ? Object.values(country.currencies)
    : [];
  const topCategories = cityScores?.categories?.slice(0, 8) ?? [];

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

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

        {/* Back button */}
        <Link
          href="/explore"
          className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/60 sm:left-6 sm:top-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Explore
        </Link>

        {/* Country name + flag */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 sm:px-8 sm:pb-10">
          <div className="mx-auto max-w-5xl">
            {/* Flag badge */}
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 backdrop-blur-sm">
              <Image
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                width={22}
                height={14}
                className="rounded-[2px] object-cover shadow-sm"
              />
              <span className="text-xs font-medium uppercase tracking-widest text-white/90">
                {country.region}
                {country.subregion ? ` · ${country.subregion}` : ""}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              {country.name.common}
            </h1>
            <p className="mt-1 text-base text-white/70 sm:text-lg">
              {country.name.official}
            </p>
          </div>
        </div>

        {/* Pexels attribution */}
        {heroPhoto && (
          <a
            href={heroPhoto.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-2 right-3 text-[10px] text-white/50 hover:text-white/80 sm:bottom-3 sm:right-4"
          >
            Photo by {heroPhoto.photographer} on Pexels
          </a>
        )}
      </section>

      {/* ── Content ── */}
      <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        {/* ── Quick Stats Bar ── */}
        <section className="relative z-10 -mt-8 mb-10">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border bg-surface p-4 shadow-lg sm:grid-cols-3 md:flex md:divide-x md:divide-border md:rounded-2xl md:p-0 md:shadow-xl">
            <StatCard
              icon={
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              }
              label="Population"
              value={formatPopulation(country.population)}
            />
            {country.area != null && (
              <StatCard
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                  </svg>
                }
                label="Area"
                value={formatArea(country.area)}
              />
            )}
            {capitalName && (
              <StatCard
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                }
                label="Capital"
                value={capitalName}
              />
            )}
            {languages.length > 0 && (
              <StatCard
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                }
                label="Languages"
                value={languages.slice(0, 2).join(", ") + (languages.length > 2 ? ` +${languages.length - 2}` : "")}
              />
            )}
            {country.car?.side && (
              <StatCard
                icon={
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                  </svg>
                }
                label="Driving Side"
                value={country.car.side.charAt(0).toUpperCase() + country.car.side.slice(1)}
              />
            )}
          </div>
        </section>

        {/* ── Add to Bucket List CTA ── */}
        <section className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Ready to visit {country.name.common}?
            </h2>
            <p className="mt-0.5 text-sm text-foreground/60">
              Save it to your bucket list and track your travel plans.
            </p>
          </div>
          {userId ? (
            <AddToBucketList
              countryCode={country.cca3}
              countryName={country.name.common}
              flagUrl={country.flags.svg}
              region={country.region}
              isSaved={isSaved}
            />
          ) : (
            <Link
              href="/sign-in"
              className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add to Bucket List
            </Link>
          )}
        </section>

        {/* ── Safety Advisory ── */}
        {advisory && (
          <section className="mb-10">
            <SectionHeading>Travel Advisory</SectionHeading>
            <div className={`rounded-2xl border p-5 ${getSafetyColor(advisory.level)}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-bold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-current/20 text-xs font-extrabold">
                    {advisory.level}
                  </span>
                  Level {advisory.level}
                </span>
                <span className="font-semibold">{advisory.levelDescription}</span>
              </div>

              {safetyDetail?.safetyAndSecurity && (
                <ExpandableText
                  text={safetyDetail.safetyAndSecurity}
                  limit={300}
                  className="mt-3 text-sm leading-relaxed"
                />
              )}
            </div>
          </section>
        )}

        {/* ── Top Attractions ── */}
        {attractionDetails.filter(Boolean).length > 0 && (
          <section className="mb-10">
            <SectionHeading>Top Attractions</SectionHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {attractionDetails.map((detail, i) => {
                if (!detail) return null;
                const base = attractionsList[i];
                return (
                  <AttractionCard key={detail.xid} detail={detail} base={base} />
                );
              })}
            </div>
          </section>
        )}

        {/* ── Cost of Living (Teleport) ── */}
        {cityScores && topCategories.length > 0 && (
          <section className="mb-10">
            <SectionHeading>
              Quality of Life
              {capitalName ? ` in ${capitalName}` : ""}
            </SectionHeading>

            <div className="rounded-2xl border border-border bg-surface p-6">
              {/* Overall score */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-foreground/50">
                    Teleport City Score
                  </p>
                  <p className="font-display text-4xl font-bold text-accent">
                    {cityScores.teleportCityScore.toFixed(1)}
                    <span className="ml-1 text-lg font-normal text-foreground/40">/100</span>
                  </p>
                </div>
                {/* Circular ring */}
                <div className="relative h-16 w-16">
                  <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
                    <circle
                      cx="32" cy="32" r="28"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${(cityScores.teleportCityScore / 100) * 175.9} 175.9`}
                      className="text-accent"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">
                    {Math.round(cityScores.teleportCityScore)}
                  </span>
                </div>
              </div>

              {/* Category bars */}
              <div className="space-y-3">
                {topCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm text-foreground/80">{cat.name}</span>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {cat.score.toFixed(1)}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-dim">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(cat.score / 10) * 100}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {cityScores.summary && (
                <p
                  className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-foreground/60"
                  dangerouslySetInnerHTML={{ __html: cityScores.summary }}
                />
              )}
            </div>
          </section>
        )}

        {/* ── Country Details ── */}
        <section className="mb-10">
          <SectionHeading>Country Details</SectionHeading>
          <div className="grid gap-6 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
            {/* Currencies */}
            {currencyList.length > 0 && (
              <DetailItem label="Currencies">
                <div className="flex flex-wrap gap-2">
                  {currencyList.map((c) => (
                    <span
                      key={c.name}
                      className="rounded-lg border border-border bg-surface-dim px-2.5 py-1 text-sm"
                    >
                      {c.symbol} {c.name}
                    </span>
                  ))}
                </div>
              </DetailItem>
            )}

            {/* Timezones */}
            {country.timezones && country.timezones.length > 0 && (
              <DetailItem label="Timezones">
                <div className="flex flex-wrap gap-1.5">
                  {country.timezones.map((tz) => (
                    <span
                      key={tz}
                      className="rounded-md border border-border bg-surface-dim px-2 py-0.5 text-xs font-mono"
                    >
                      {tz}
                    </span>
                  ))}
                </div>
              </DetailItem>
            )}

            {/* Bordering Countries */}
            {country.borders && country.borders.length > 0 && (
              <DetailItem label="Bordering Countries" className="sm:col-span-2">
                <div className="flex flex-wrap gap-2">
                  {country.borders.map((b) => (
                    <Link
                      key={b}
                      href={`/country/${b}`}
                      className="rounded-lg border border-border bg-surface-dim px-3 py-1 text-sm font-medium hover:border-accent hover:bg-accent-light hover:text-accent"
                    >
                      {b}
                    </Link>
                  ))}
                </div>
              </DetailItem>
            )}

            {/* Map Links */}
            {country.maps && (
              <DetailItem label="Maps" className="sm:col-span-2">
                <div className="flex flex-wrap gap-3">
                  <a
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-dim px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    Google Maps
                  </a>
                  <a
                    href={country.maps.openStreetMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-dim px-3 py-1.5 text-sm font-medium hover:border-accent hover:text-accent"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
                    </svg>
                    OpenStreetMap
                  </a>
                </div>
              </DetailItem>
            )}

            {/* Coat of Arms */}
            {country.coatOfArms?.svg && (
              <DetailItem label="Coat of Arms">
                <Image
                  src={country.coatOfArms.svg}
                  alt={`Coat of arms of ${country.name.common}`}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </DetailItem>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 font-display text-2xl font-semibold text-foreground">
      {children}
    </h2>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-3 text-center md:flex-1 md:py-4">
      <span className="text-accent">{icon}</span>
      <span className="text-xs font-medium uppercase tracking-wider text-foreground/50">{label}</span>
      <span className="text-sm font-semibold text-foreground sm:text-base">{value}</span>
    </div>
  );
}

function DetailItem({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-foreground/50">
        {label}
      </p>
      {children}
    </div>
  );
}

import type { AttractionDetail, Attraction } from "@/lib/attractions";

function AttractionCard({
  detail,
  base,
}: {
  detail: AttractionDetail;
  base: Attraction;
}) {
  const stars = Math.min(5, Math.max(0, Math.round((base.rate / 7) * 5)));

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-shadow hover:shadow-md">
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
        <h3 className="font-display text-base font-semibold leading-snug text-foreground line-clamp-2">
          {detail.name || base.name}
        </h3>

        {/* Stars */}
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`h-3.5 w-3.5 ${i < stars ? "text-amber-400" : "text-border"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>

        {detail.description && (
          <p className="flex-1 text-xs leading-relaxed text-foreground/60 line-clamp-3">
            {detail.description}
          </p>
        )}

        {detail.wikipedia && (
          <a
            href={detail.wikipedia}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
          >
            Learn more
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

function ExpandableText({
  text,
  limit,
  className = "",
}: {
  text: string;
  limit: number;
  className?: string;
}) {
  // Server component — static truncation with a "Read more" link hint
  // (full expand requires a client component; we keep it simple here)
  const isLong = text.length > limit;
  const preview = isLong ? text.slice(0, limit).trimEnd() + "…" : text;

  return (
    <details className={className}>
      <summary className="cursor-pointer list-none">
        <span>{preview}</span>
        {isLong && (
          <span className="ml-1 inline-flex cursor-pointer items-center gap-0.5 text-xs font-semibold underline">
            Read more
          </span>
        )}
      </summary>
      {isLong && <p className="mt-1">{text}</p>}
    </details>
  );
}

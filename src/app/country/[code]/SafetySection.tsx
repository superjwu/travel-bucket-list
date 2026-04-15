import { getTravelAdvisories, getCountrySafety, getSafetyColor } from "@/lib/safety";

export async function SafetySection({ cca2 }: { cca2: string }) {
  const [advisoriesMap, safetyDetail] = await Promise.all([
    getTravelAdvisories(),
    getCountrySafety(cca2),
  ]);

  const advisory = advisoriesMap.get(cca2.toUpperCase()) ?? null;
  if (!advisory) return null;

  const safetyText = safetyDetail?.safetyAndSecurity ?? "";
  const isLong = safetyText.length > 300;
  const preview = isLong ? safetyText.slice(0, 300).trimEnd() + "…" : safetyText;

  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-2xl font-semibold">Travel Advisory</h2>
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

        {safetyText && (
          <details className="mt-3 text-sm leading-relaxed">
            <summary className="cursor-pointer list-none">
              <span>{preview}</span>
              {isLong && (
                <span className="ml-1 inline-flex cursor-pointer text-xs font-semibold underline">
                  Read more
                </span>
              )}
            </summary>
            {isLong && <p className="mt-1">{safetyText}</p>}
          </details>
        )}
      </div>
    </section>
  );
}

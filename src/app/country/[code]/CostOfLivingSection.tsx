import { getCityScores } from "@/lib/teleport";

export async function CostOfLivingSection({ capitalName }: { capitalName?: string }) {
  if (!capitalName) return null;

  const cityScores = await getCityScores(capitalName);
  if (!cityScores) return null;

  const topCategories = cityScores.categories.slice(0, 8);
  if (topCategories.length === 0) return null;

  return (
    <section className="mb-10">
      <h2 className="mb-4 font-display text-2xl font-semibold">
        Quality of Life in {capitalName}
      </h2>

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
          <div className="relative h-16 w-16">
            <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                strokeDasharray={`${(cityScores.teleportCityScore / 100) * 175.9} 175.9`} className="text-accent" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
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
                <span className="text-sm font-semibold tabular-nums">{cat.score.toFixed(1)}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-dim">
                <div className="h-full rounded-full" style={{ width: `${(cat.score / 10) * 100}%`, backgroundColor: cat.color }} />
              </div>
            </div>
          ))}
        </div>

        {cityScores.summary && (
          <p className="mt-5 border-t border-border pt-4 text-sm leading-relaxed text-foreground/60"
            dangerouslySetInnerHTML={{ __html: cityScores.summary }} />
        )}
      </div>
    </section>
  );
}

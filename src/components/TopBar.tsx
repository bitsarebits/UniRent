import { Search, SlidersHorizontal, X } from 'lucide-react';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
}

// Sticky mobile top bar with UniRent wordmark, instant city/hub search, and filter trigger.
export function TopBar({
  searchQuery,
  onSearchChange,
  activeFilterCount,
  onOpenFilters,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 px-4 pt-3 pb-3 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          Uni<span className="text-indigo-600">Rent</span>
        </span>

        <div className="flex flex-1 items-center gap-2 min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Città, zona o polo..."
              aria-label="Cerca per città o polo universitario"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Cancella ricerca"
                className="absolute right-0.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenFilters}
            aria-label={`Apri filtri${activeFilterCount > 0 ? ` (${activeFilterCount} attivi)` : ''}`}
            className={`relative flex h-11 min-w-[44px] shrink-0 items-center justify-center gap-1.5 rounded-xl border px-3 text-sm font-semibold transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeFilterCount > 0
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="whitespace-nowrap">Filtri</span>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white tabular-nums">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

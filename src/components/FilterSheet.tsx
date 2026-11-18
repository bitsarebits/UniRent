import { Check, RotateCcw, X } from 'lucide-react';
import { DEFAULT_FILTERS } from '../data/listings';
import { City, FilterState, ListingSource, RoomType } from '../types/unirent';

interface FilterSheetProps {
  isOpen: boolean;
  filters: FilterState;
  resultCount: number;
  onUpdateFilters: (next: FilterState) => void;
  onClose: () => void;
}

const CITIES: Array<'Tutte' | City> = ['Tutte', 'Bologna', 'Padova'];
const ROOM_TYPES: RoomType[] = ['Singola', 'Doppia', 'Monolocale'];
const LISTING_SOURCES: Array<'Tutti' | ListingSource> = [
  'Tutti',
  'Subentro da studente',
  'Proprietario diretto',
];
const AVAILABILITY_OPTIONS: Array<{
  key: FilterState['availableMonth'];
  label: string;
}> = [
  { key: 'tutte', label: 'Qualsiasi' },
  { key: 'subito', label: 'Subito' },
  { key: 'dicembre', label: 'Dicembre' },
  { key: 'gennaio', label: 'Gennaio' },
];

// Bottom sheet drawer for extended filtering: city, price, typology, source, bills, and availability.
export function FilterSheet({
  isOpen,
  filters,
  resultCount,
  onUpdateFilters,
  onClose,
}: FilterSheetProps) {
  if (!isOpen) return null;

  const toggleRoomType = (type: RoomType) => {
    const exists = filters.roomTypes.includes(type);
    const nextTypes = exists
      ? filters.roomTypes.filter((t) => t !== type)
      : [...filters.roomTypes, type];
    onUpdateFilters({ ...filters, roomTypes: nextTypes });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filtri-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[88dvh] w-full max-w-[430px] flex-col rounded-t-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-10 rounded-full bg-slate-300" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 pb-3">
          <div>
            <h2
              id="filtri-title"
              className="font-display text-lg font-bold text-slate-900"
            >
              Filtra annunci
            </h2>
            <p className="text-xs text-slate-500">
              Personalizza la ricerca tra Bologna e Padova
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi filtri"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable filter controls */}
        <div className="flex-1 space-y-6 overflow-y-auto px-5 py-4">
          {/* City selection */}
          <section>
            <h3 className="text-xs font-bold tracking-wide text-slate-700">
              Città universitaria
            </h3>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {CITIES.map((city) => {
                const active = filters.city === city;
                return (
                  <button
                    key={city}
                    type="button"
                    onClick={() => onUpdateFilters({ ...filters, city })}
                    className={`min-h-[44px] rounded-xl border px-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                      active
                        ? 'border-indigo-600 bg-indigo-600 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {city}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Max monthly rent slider */}
          <section>
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold tracking-wide text-slate-700">
                Canone mensile massimo
              </h3>
              <span className="font-display text-base font-bold text-indigo-600 tabular-nums">
                fino a {filters.maxPrice} €
              </span>
            </div>
            <input
              type="range"
              min={380}
              max={680}
              step={10}
              value={filters.maxPrice}
              onChange={(e) =>
                onUpdateFilters({
                  ...filters,
                  maxPrice: Number(e.target.value),
                })
              }
              aria-label="Prezzo massimo mensile in euro"
              className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
            />
            <div className="mt-1.5 flex justify-between text-[11px] font-medium text-slate-400 tabular-nums">
              <span>380 €</span>
              <span>530 €</span>
              <span>680 €</span>
            </div>
          </section>

          {/* Room type multi-select */}
          <section>
            <h3 className="text-xs font-bold tracking-wide text-slate-700">
              Tipologia di sistemazione
            </h3>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {ROOM_TYPES.map((type) => {
                const active = filters.roomTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleRoomType(type)}
                    className={`flex min-h-[44px] items-center justify-center gap-1 rounded-xl border px-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5 shrink-0" />}
                    {type}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Listing source (Subentro vs Proprietario) */}
          <section>
            <h3 className="text-xs font-bold tracking-wide text-slate-700">
              Modalità contratto
            </h3>
            <div className="mt-2.5 flex flex-col gap-2">
              {LISTING_SOURCES.map((source) => {
                const active = filters.listingSource === source;
                return (
                  <button
                    key={source}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({ ...filters, listingSource: source })
                    }
                    className={`flex min-h-[44px] items-center justify-between rounded-xl border px-3.5 text-sm font-semibold transition-colors ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{source}</span>
                    {active && <Check className="h-4 w-4 text-indigo-600" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Bills included toggle */}
          <section className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="pr-3">
              <p className="text-sm font-semibold text-slate-900">
                Solo con spese incluse
              </p>
              <p className="text-xs text-slate-500">
                Mostra stanze con condominio o utenze comprese
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={filters.billsIncludedOnly}
              aria-label="Filtra solo annunci con spese incluse"
              onClick={() =>
                onUpdateFilters({
                  ...filters,
                  billsIncludedOnly: !filters.billsIncludedOnly,
                })
              }
              className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filters.billsIncludedOnly ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 rounded-full bg-white shadow-xs transition-transform ${
                  filters.billsIncludedOnly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </section>

          {/* Availability month */}
          <section>
            <h3 className="text-xs font-bold tracking-wide text-slate-700">
              Disponibilità ingresso
            </h3>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {AVAILABILITY_OPTIONS.map((opt) => {
                const active = filters.availableMonth === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() =>
                      onUpdateFilters({ ...filters, availableMonth: opt.key })
                    }
                    className={`min-h-[44px] rounded-xl border px-3 text-sm font-semibold transition-colors ${
                      active
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Pinned bottom action bar */}
        <div className="flex items-center gap-3 border-t border-slate-200 bg-white px-5 py-3.5">
          <button
            type="button"
            onClick={() =>
              onUpdateFilters({
                ...DEFAULT_FILTERS,
                searchQuery: filters.searchQuery,
              })
            }
            className="flex min-h-[48px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Azzera
          </button>

          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98] tabular-nums"
          >
            Mostra {resultCount}{' '}
            {resultCount === 1 ? 'annuncio' : 'annunci'}
          </button>
        </div>
      </div>
    </div>
  );
}

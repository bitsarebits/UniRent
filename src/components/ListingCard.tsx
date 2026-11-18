import { useState } from 'react';
import {
  BadgeCheck,
  Building2,
  Heart,
  Home,
  MapPin,
  Users,
} from 'lucide-react';
import { Listing } from '../types/unirent';

interface ListingCardProps {
  listing: Listing;
  isFavorite: boolean;
  hasApplied?: boolean;
  onToggleFavorite: (listingId: string) => void;
  onSelect: (listing: Listing) => void;
}

// Mobile-first rental card showing source badge, verified badge, distance, typology, and price.
export function ListingCard({
  listing,
  isFavorite,
  hasApplied = false,
  onToggleFavorite,
  onSelect,
}: ListingCardProps) {
  const [imageError, setImageError] = useState(false);

  const isSubentro = listing.listingSource === 'Subentro da studente';

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-shadow hover:shadow-md">
      {/* Media frame with overlaid trust badges and 44x44px favorite button */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {!imageError ? (
          <img
            src={listing.imageUrl}
            alt={`${listing.title} — ${listing.neighborhood}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            onClick={() => onSelect(listing)}
            className="h-full w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <button
            type="button"
            onClick={() => onSelect(listing)}
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 via-indigo-50/60 to-slate-200 p-4 text-center text-slate-600"
          >
            <Home className="h-8 w-8 text-indigo-500" aria-hidden="true" />
            <span className="text-sm font-semibold text-slate-800">
              {listing.title}
            </span>
          </button>
        )}

        {/* Scrim for top badge legibility */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-slate-950/55 via-slate-950/20 to-transparent"
          aria-hidden="true"
        />

        {/* Top-left prominent badges: Subentro/Proprietario + Verificato */}
        <div className="pointer-events-none absolute left-3 top-3 right-14 flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-xs whitespace-nowrap ${
              isSubentro
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-900 text-white'
            }`}
          >
            {isSubentro ? (
              <Users className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            {listing.listingSource}
          </span>

          {listing.verified && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white shadow-xs whitespace-nowrap">
              <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Verificato
            </span>
          )}
        </div>

        {/* Top-right 44x44px favorite toggle button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(listing.id);
          }}
          aria-label={
            isFavorite
              ? `Rimuovi ${listing.title} dai preferiti`
              : `Salva ${listing.title} nei preferiti`
          }
          aria-pressed={isFavorite}
          className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm backdrop-blur-xs transition-transform active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isFavorite
                ? 'fill-rose-500 text-rose-500'
                : 'text-slate-700 hover:text-rose-500'
            }`}
            aria-hidden="true"
          />
        </button>

        {/* Bottom-left availability status chip over subtle scrim */}
        <div className="pointer-events-none absolute bottom-2.5 left-3 flex items-center gap-2">
          <span className="rounded-md bg-slate-950/75 px-2 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
            {listing.availableFrom}
          </span>
          {hasApplied && (
            <span className="rounded-md bg-emerald-600/95 px-2 py-0.5 text-[11px] font-semibold text-white">
              Candidatura inviata
            </span>
          )}
        </div>
      </div>

      {/* Card body clickable to open detail sheet */}
      <button
        type="button"
        onClick={() => onSelect(listing)}
        className="block w-full p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500"
      >
        {/* City & neighborhood */}
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-slate-500">
          <span className="truncate">{listing.neighborhood}</span>
          <span className="shrink-0 font-semibold text-slate-700">
            {listing.city}
          </span>
        </div>

        {/* Listing headline */}
        <h3 className="mt-1 font-display text-[17px] font-bold leading-snug text-slate-900">
          {listing.title}
        </h3>

        {/* Distance from faculty & room typology as clean unboxed metadata */}
        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600">
          <span className="font-semibold text-indigo-700">
            {listing.roomType}
          </span>
          <span aria-hidden="true" className="text-slate-300">
            ·
          </span>
          <span className="inline-flex items-center gap-1">
            <MapPin
              className="h-3.5 w-3.5 shrink-0 text-emerald-600"
              aria-hidden="true"
            />
            {listing.distanceToFaculty}
          </span>
        </div>

        {/* Price footer & quick action cue */}
        <div className="mt-3.5 flex items-end justify-between border-t border-slate-100 pt-3">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 tabular-nums">
                {listing.priceMonthly} €
              </span>
              <span className="text-xs font-medium text-slate-500">/ mese</span>
            </div>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              {listing.billsIncluded ? (
                <span className="text-emerald-700">Spese incluse</span>
              ) : (
                listing.billsEstimate
              )}
            </p>
          </div>

          <span className="inline-flex min-h-[36px] items-center rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-indigo-600">
            Dettagli
          </span>
        </div>
      </button>
    </article>
  );
}

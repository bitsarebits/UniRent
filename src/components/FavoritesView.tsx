import { Compass, Heart } from 'lucide-react';
import { Listing } from '../types/unirent';
import { ListingCard } from './ListingCard';

interface FavoritesViewProps {
  favoriteListings: Listing[];
  appliedListingIds: Set<string>;
  onToggleFavorite: (listingId: string) => void;
  onSelectListing: (listing: Listing) => void;
  onExploreClick: () => void;
}

// Saved rooms tab synchronized with localStorage.
export function FavoritesView({
  favoriteListings,
  appliedListingIds,
  onToggleFavorite,
  onSelectListing,
  onExploreClick,
}: FavoritesViewProps) {
  return (
    <div className="space-y-4 px-4 py-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-xl font-extrabold text-slate-900">
            I tuoi preferiti
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Stanze salvate sul dispositivo per confrontarle rapidamente
          </p>
        </div>
        <span className="text-xs font-bold text-indigo-600 tabular-nums">
          {favoriteListings.length}{' '}
          {favoriteListings.length === 1 ? 'stanza' : 'stanze'}
        </span>
      </div>

      {favoriteListings.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Heart className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-bold text-slate-900">
            Nessuna stanza salvata
          </h2>
          <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-slate-500">
            Tocca l’icona del cuore su qualsiasi annuncio tra Bologna e Padova
            per ritrovarlo qui in ogni momento.
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700 active:scale-[0.98]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Esplora gli annunci
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {favoriteListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              isFavorite={true}
              hasApplied={appliedListingIds.has(listing.id)}
              onToggleFavorite={onToggleFavorite}
              onSelect={onSelectListing}
            />
          ))}
        </div>
      )}
    </div>
  );
}

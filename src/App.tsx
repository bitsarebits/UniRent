import { useMemo, useState } from 'react';
import { RotateCcw, SearchX } from 'lucide-react';
import { ApplicationsView } from './components/ApplicationsView';
import { BottomNav } from './components/BottomNav';
import { FavoritesView } from './components/FavoritesView';
import { FilterSheet } from './components/FilterSheet';
import { ListingCard } from './components/ListingCard';
import { ListingDetailSheet } from './components/ListingDetailSheet';
import { ProfileView } from './components/ProfileView';
import { TopBar } from './components/TopBar';
import {
  DEFAULT_FILTERS,
  DEFAULT_STUDENT_PROFILE,
  MOCK_LISTINGS,
} from './data/listings';
import { useLocalStorage } from './hooks/useLocalStorage';
import {
  ApplicationRecord,
  ApplicationStatus,
  FilterState,
  Listing,
  StudentProfile,
  TabKey,
} from './types/unirent';

const STATUS_PROGRESSION: Record<ApplicationStatus, ApplicationStatus> = {
  Inviata: 'In valutazione',
  'In valutazione': 'Colloquio fissato',
  'Colloquio fissato': 'Colloquio fissato',
  Ritirata: 'Ritirata',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>('esplora');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persisted client state synchronized with localStorage
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>(
    'unirent_favorites',
    ['bo-irnerio-01']
  );
  const [applications, setApplications] = useLocalStorage<ApplicationRecord[]>(
    'unirent_applications',
    []
  );
  const [studentProfile, setStudentProfile] = useLocalStorage<StudentProfile>(
    'unirent_profile',
    DEFAULT_STUDENT_PROFILE
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2600);
  };

  // Count active filters excluding the quick search input for the Filtri badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.city !== 'Tutte') count += 1;
    if (filters.maxPrice < 680) count += 1;
    if (filters.roomTypes.length > 0) count += 1;
    if (filters.listingSource !== 'Tutti') count += 1;
    if (filters.billsIncludedOnly) count += 1;
    if (filters.availableMonth !== 'tutte') count += 1;
    return count;
  }, [filters]);

  // Filter listings by search query and extended filter drawer criteria
  const filteredListings = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();

    return MOCK_LISTINGS.filter((item) => {
      if (q) {
        const haystack =
          `${item.title} ${item.city} ${item.neighborhood} ${item.universityHub} ${item.roomType} ${item.listingSource}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.city !== 'Tutte' && item.city !== filters.city) {
        return false;
      }
      if (item.priceMonthly > filters.maxPrice) {
        return false;
      }
      if (
        filters.roomTypes.length > 0 &&
        !filters.roomTypes.includes(item.roomType)
      ) {
        return false;
      }
      if (
        filters.listingSource !== 'Tutti' &&
        item.listingSource !== filters.listingSource
      ) {
        return false;
      }
      if (filters.billsIncludedOnly && !item.billsIncluded) {
        return false;
      }
      if (
        filters.availableMonth !== 'tutte' &&
        item.availableMonthKey !== filters.availableMonth
      ) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const listingsById = useMemo(() => {
    return MOCK_LISTINGS.reduce<Record<string, Listing>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, []);

  const favoriteListings = useMemo(() => {
    return MOCK_LISTINGS.filter((item) => favoriteIds.includes(item.id));
  }, [favoriteIds]);

  const appliedListingIds = useMemo(() => {
    return new Set(
      applications
        .filter((app) => app.status !== 'Ritirata')
        .map((app) => app.listingId)
    );
  }, [applications]);

  const activeApplicationsCount = appliedListingIds.size;

  const handleToggleFavorite = (listingId: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(listingId);
      const next = exists
        ? prev.filter((id) => id !== listingId)
        : [...prev, listingId];
      showToast(
        exists
          ? 'Rimossa dai preferiti'
          : 'Stanza salvata nei preferiti'
      );
      return next;
    });
  };

  const handleSubmitApplication = (payload: {
    listingId: string;
    message: string;
    moveInPreference: string;
    callSlot: string;
  }) => {
    const newRecord: ApplicationRecord = {
      id: `app-${Date.now()}`,
      listingId: payload.listingId,
      submittedAt: new Date().toISOString(),
      status: 'Inviata',
      message: payload.message,
      moveInPreference: payload.moveInPreference,
      callSlot: payload.callSlot,
    };

    setApplications((prev) => [
      newRecord,
      ...prev.filter(
        (item) =>
          item.listingId !== payload.listingId || item.status === 'Ritirata'
      ),
    ]);
    setSelectedListing(null);
    setActiveTab('candidature');
    showToast('Candidatura inviata con fascia call!');
  };

  const handleAdvanceStatus = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? { ...app, status: STATUS_PROGRESSION[app.status] }
          : app
      )
    );
    showToast('Stato candidatura aggiornato');
  };

  const handleWithdrawApplication = (applicationId: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: 'Ritirata' } : app
      )
    );
    showToast('Candidatura ritirata');
  };

  const handleRemoveApplication = (applicationId: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== applicationId));
    showToast('Candidatura rimossa dallo storico');
  };

  const existingAppForSelected = selectedListing
    ? applications.find(
        (app) =>
          app.listingId === selectedListing.id && app.status !== 'Ritirata'
      )
    : undefined;

  return (
    <div className="flex min-h-dvh w-full justify-center bg-slate-200 sm:py-4">
      {/* Mobile-first device shell centered on desktop viewports */}
      <div className="relative flex min-h-dvh w-full max-w-[430px] flex-col bg-slate-50 shadow-2xl sm:min-h-[calc(100dvh-2rem)] sm:overflow-hidden sm:rounded-[32px] sm:border sm:border-slate-300/80">
        {/* Top bar shown on Esplora for fast city/hub search and extended filters */}
        {activeTab === 'esplora' ? (
          <TopBar
            searchQuery={filters.searchQuery}
            onSearchChange={(value) =>
              setFilters((prev) => ({ ...prev, searchQuery: value }))
            }
            activeFilterCount={activeFilterCount}
            onOpenFilters={() => setIsFilterOpen(true)}
          />
        ) : (
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md">
            <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
              Uni<span className="text-indigo-600">Rent</span>
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Bologna · Padova
            </span>
          </header>
        )}

        {/* Main scrollable viewport */}
        <main className="flex-1 overflow-y-auto pb-4">
          {activeTab === 'esplora' && (
            <div className="space-y-4 px-4 pt-3.5 pb-4">
              {/* Interactive quick city/subentro segmented chips */}
              <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      city: 'Tutte',
                      listingSource: 'Tutti',
                    }))
                  }
                  className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    filters.city === 'Tutte' &&
                    filters.listingSource === 'Tutti'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Tutti ({MOCK_LISTINGS.length})
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      city: prev.city === 'Bologna' ? 'Tutte' : 'Bologna',
                    }))
                  }
                  className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    filters.city === 'Bologna'
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Bologna
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      city: prev.city === 'Padova' ? 'Tutte' : 'Padova',
                    }))
                  }
                  className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    filters.city === 'Padova'
                      ? 'border-indigo-600 bg-indigo-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Padova
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      listingSource:
                        prev.listingSource === 'Subentro da studente'
                          ? 'Tutti'
                          : 'Subentro da studente',
                    }))
                  }
                  className={`min-h-[44px] shrink-0 rounded-xl border px-3.5 text-xs font-bold transition-colors whitespace-nowrap ${
                    filters.listingSource === 'Subentro da studente'
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Solo Subentri P2P
                </button>
              </div>

              {/* Feed headline & live result count */}
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <h1 className="font-display text-lg font-extrabold text-slate-900">
                    Stanze e subentri verificati
                  </h1>
                  <p className="text-xs text-slate-500">
                    Affitti diretti tra studenti, zero commissioni d’agenzia
                  </p>
                </div>
                <span className="shrink-0 text-xs font-bold text-slate-700 tabular-nums">
                  {filteredListings.length}{' '}
                  {filteredListings.length === 1 ? 'risultato' : 'risultati'}
                </span>
              </div>

              {/* Filtered listings feed or empty state */}
              {filteredListings.length > 0 ? (
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      isFavorite={favoriteIds.includes(listing.id)}
                      hasApplied={appliedListingIds.has(listing.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelect={setSelectedListing}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <SearchX className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h2 className="mt-4 font-display text-base font-bold text-slate-900">
                    Nessun annuncio trovato
                  </h2>
                  <p className="mt-1.5 max-w-[260px] text-xs leading-relaxed text-slate-500">
                    Prova a modificare la fascia di prezzo o a rimuovere alcuni
                    filtri attivi.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFilters(DEFAULT_FILTERS)}
                    className="mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Azzera ricerca e filtri
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferiti' && (
            <FavoritesView
              favoriteListings={favoriteListings}
              appliedListingIds={appliedListingIds}
              onToggleFavorite={handleToggleFavorite}
              onSelectListing={setSelectedListing}
              onExploreClick={() => setActiveTab('esplora')}
            />
          )}

          {activeTab === 'candidature' && (
            <ApplicationsView
              applications={applications}
              listingsById={listingsById}
              onAdvanceStatus={handleAdvanceStatus}
              onWithdrawApplication={handleWithdrawApplication}
              onRemoveApplication={handleRemoveApplication}
              onOpenListing={setSelectedListing}
              onExploreClick={() => setActiveTab('esplora')}
            />
          )}

          {activeTab === 'profilo' && (
            <ProfileView
              profile={studentProfile}
              favoritesCount={favoriteIds.length}
              applicationsCount={activeApplicationsCount}
              onSaveProfile={(next) => {
                setStudentProfile(next);
                showToast('Profilo studente salvato');
              }}
            />
          )}
        </main>

        {/* Inline transient feedback toast */}
        {toastMessage && (
          <div
            role="status"
            aria-live="polite"
            className="pointer-events-none fixed bottom-20 left-1/2 z-40 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white shadow-lg"
          >
            {toastMessage}
          </div>
        )}

        {/* Fixed bottom navigation bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          favoritesCount={favoriteIds.length}
          activeApplicationsCount={activeApplicationsCount}
        />

        {/* Extended Filters Bottom Sheet */}
        <FilterSheet
          isOpen={isFilterOpen}
          filters={filters}
          resultCount={filteredListings.length}
          onUpdateFilters={setFilters}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Room Detail & Application Bottom Sheet */}
        <ListingDetailSheet
          listing={selectedListing}
          isFavorite={
            selectedListing ? favoriteIds.includes(selectedListing.id) : false
          }
          existingApplication={existingAppForSelected}
          studentProfile={studentProfile}
          onToggleFavorite={handleToggleFavorite}
          onSubmitApplication={handleSubmitApplication}
          onGoToApplications={() => {
            setSelectedListing(null);
            setActiveTab('candidature');
          }}
          onClose={() => setSelectedListing(null)}
        />
      </div>
    </div>
  );
}

import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  RefreshCw,
  Trash2,
  Video,
  XCircle,
} from 'lucide-react';
import {
  ApplicationRecord,
  ApplicationStatus,
  Listing,
} from '../types/unirent';

interface ApplicationsViewProps {
  applications: ApplicationRecord[];
  listingsById: Record<string, Listing>;
  onAdvanceStatus: (applicationId: string) => void;
  onWithdrawApplication: (applicationId: string) => void;
  onRemoveApplication: (applicationId: string) => void;
  onOpenListing: (listing: Listing) => void;
  onExploreClick: () => void;
}

function getStatusBadge(status: ApplicationStatus) {
  switch (status) {
    case 'Inviata':
      return {
        label: 'Inviata',
        classes: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        Icon: Clock,
      };
    case 'In valutazione':
      return {
        label: 'In valutazione',
        classes: 'bg-amber-50 text-amber-800 border-amber-200',
        Icon: RefreshCw,
      };
    case 'Colloquio fissato':
      return {
        label: 'Colloquio fissato',
        classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        Icon: CheckCircle2,
      };
    case 'Ritirata':
      return {
        label: 'Ritirata',
        classes: 'bg-slate-100 text-slate-600 border-slate-200',
        Icon: XCircle,
      };
  }
}

// Interactive applications tracker showing submitted P2P room applications, call slots, and status actions.
export function ApplicationsView({
  applications,
  listingsById,
  onAdvanceStatus,
  onWithdrawApplication,
  onRemoveApplication,
  onOpenListing,
  onExploreClick,
}: ApplicationsViewProps) {
  const activeCount = applications.filter(
    (app) => app.status !== 'Ritirata'
  ).length;

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="font-display text-xl font-extrabold text-slate-900">
            Le tue candidature
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            Stato delle richieste di subentro e videochiamate
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 tabular-nums">
          {activeCount} {activeCount === 1 ? 'attiva' : 'attive'}
        </span>
      </div>

      {applications.length === 0 ? (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <FileCheck2 className="h-7 w-7" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-base font-bold text-slate-900">
            Nessuna candidatura inviata
          </h2>
          <p className="mt-1.5 max-w-[270px] text-xs leading-relaxed text-slate-500">
            Apri un annuncio, scegli la fascia per la videochiamata conoscitiva
            e invia il tuo profilo allo studente uscente.
          </p>
          <button
            type="button"
            onClick={onExploreClick}
            className="mt-5 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white hover:bg-indigo-700 active:scale-[0.98]"
          >
            <Compass className="h-4 w-4" aria-hidden="true" />
            Trova una stanza
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {applications.map((app) => {
            const listing = listingsById[app.listingId];
            if (!listing) return null;

            const badge = getStatusBadge(app.status);
            const StatusIcon = badge.Icon;
            const formattedDate = new Date(app.submittedAt).toLocaleDateString(
              'it-IT',
              { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
            );

            return (
              <article
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
              >
                {/* Header row with status */}
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${badge.classes}`}
                  >
                    <StatusIcon className="h-3.5 w-3.5 shrink-0" />
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 tabular-nums">
                    {formattedDate}
                  </span>
                </div>

                {/* Listing preview */}
                <button
                  type="button"
                  onClick={() => onOpenListing(listing)}
                  className="mt-3 flex w-full items-center gap-3 rounded-xl bg-slate-50 p-2.5 text-left transition-colors hover:bg-slate-100"
                >
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    referrerPolicy="no-referrer"
                    className="h-16 w-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-sm font-bold text-slate-900">
                      {listing.title}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {listing.city} · {listing.roomType}
                    </p>
                    <p className="mt-1 font-display text-sm font-extrabold text-indigo-600 tabular-nums">
                      {listing.priceMonthly} €/mese
                    </p>
                  </div>
                  <ArrowRight
                    className="h-4 w-4 shrink-0 text-slate-400"
                    aria-hidden="true"
                  />
                </button>

                {/* Call slot & move-in metadata */}
                <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Video
                      className="h-3.5 w-3.5 shrink-0 text-indigo-600"
                      aria-hidden="true"
                    />
                    <span>
                      Videochiamata:{' '}
                      <strong className="font-semibold text-slate-800">
                        {app.callSlot}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar
                      className="h-3.5 w-3.5 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    <span>
                      Ingresso richiesto:{' '}
                      <strong className="font-semibold text-slate-800">
                        {app.moveInPreference}
                      </strong>
                    </span>
                  </div>
                </div>

                <p className="mt-2.5 line-clamp-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2 text-xs italic text-slate-600">
                  “{app.message}”
                </p>

                {/* Interactive status controls */}
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  {app.status !== 'Ritirata' &&
                    app.status !== 'Colloquio fissato' && (
                      <button
                        type="button"
                        onClick={() => onAdvanceStatus(app.id)}
                        className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-50 px-3 text-xs font-bold text-indigo-700 hover:bg-indigo-100 active:scale-[0.98]"
                      >
                        <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                        Aggiorna stato
                      </button>
                    )}

                  {app.status !== 'Ritirata' ? (
                    <button
                      type="button"
                      onClick={() => onWithdrawApplication(app.id)}
                      className="flex min-h-[44px] items-center justify-center rounded-xl border border-slate-200 px-3.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 active:scale-[0.98]"
                    >
                      Ritira
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRemoveApplication(app.id)}
                      className="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Rimuovi dallo storico
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

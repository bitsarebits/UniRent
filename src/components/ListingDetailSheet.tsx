import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Heart,
  Home,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  X,
} from 'lucide-react';
import { CALL_SLOT_OPTIONS, MOVE_IN_OPTIONS } from '../data/listings';
import {
  ApplicationRecord,
  Listing,
  StudentProfile,
} from '../types/unirent';

interface ListingDetailSheetProps {
  listing: Listing | null;
  isFavorite: boolean;
  existingApplication?: ApplicationRecord;
  studentProfile: StudentProfile;
  onToggleFavorite: (listingId: string) => void;
  onSubmitApplication: (payload: {
    listingId: string;
    message: string;
    moveInPreference: string;
    callSlot: string;
  }) => void;
  onGoToApplications: () => void;
  onClose: () => void;
}

// Slide-up detail sheet displaying full room specs, deposit, vibe tags, roommates, and application form.
export function ListingDetailSheet({
  listing,
  isFavorite,
  existingApplication,
  studentProfile,
  onToggleFavorite,
  onSubmitApplication,
  onGoToApplications,
  onClose,
}: ListingDetailSheetProps) {
  const [imageError, setImageError] = useState(false);
  const [moveInPreference, setMoveInPreference] = useState(
    MOVE_IN_OPTIONS[0]
  );
  const [callSlot, setCallSlot] = useState(CALL_SLOT_OPTIONS[0]);
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');

  // Reset form defaults and pre-fill introduction using the saved StudentProfile when a listing opens.
  useEffect(() => {
    if (!listing) return;
    setImageError(false);
    setFormError('');
    setMoveInPreference(
      listing.availableMonthKey === 'subito'
        ? MOVE_IN_OPTIONS[0]
        : listing.availableMonthKey === 'dicembre'
        ? MOVE_IN_OPTIONS[1]
        : MOVE_IN_OPTIONS[3]
    );
    setCallSlot(CALL_SLOT_OPTIONS[0]);

    const intro = `Ciao ${listing.hostName.split(' ')[0]}! Sono ${
      studentProfile.fullName
    }, studio ${studentProfile.faculty} (${studentProfile.studyYear}) presso ${
      studentProfile.university
    }. ${studentProfile.bio} Mi piacerebbe candidarmi per questa stanza.`;
    setMessage(intro);
  }, [listing, studentProfile]);

  if (!listing) return null;

  const isSubentro = listing.listingSource === 'Subentro da studente';
  const hasActiveApplication =
    existingApplication && existingApplication.status !== 'Ritirata';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim().length < 20) {
      setFormError(
        'Scrivi una breve presentazione di almeno 20 caratteri per il coinquilino o proprietario.'
      );
      return;
    }
    setFormError('');
    onSubmitApplication({
      listingId: listing.id,
      message: message.trim(),
      moveInPreference,
      callSlot,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-sheet-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92dvh] w-full max-w-[430px] flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar inside sheet */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <button
            type="button"
            onClick={() => onToggleFavorite(listing.id)}
            aria-label={
              isFavorite ? 'Rimuovi dai preferiti' : 'Salva nei preferiti'
            }
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl px-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 active:scale-95"
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
              }`}
              aria-hidden="true"
            />
            <span>{isFavorite ? 'Salvata' : 'Salva'}</span>
          </button>

          <div className="h-1.5 w-10 rounded-full bg-slate-300" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Chiudi dettaglio stanza"
            className="flex h-11 w-11 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable detail content */}
        <div className="flex-1 overflow-y-auto pb-8">
          {/* Room photo */}
          <div className="relative aspect-[4/3] w-full bg-slate-100">
            {!imageError ? (
              <img
                src={listing.imageUrl}
                alt={listing.title}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-indigo-50 p-6 text-slate-600">
                <Home className="h-10 w-10 text-indigo-500" />
                <span className="text-sm font-semibold">{listing.title}</span>
              </div>
            )}

            <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-xs ${
                  isSubentro
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {isSubentro ? (
                  <Users className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {listing.listingSource}
              </span>
              {listing.verified && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-xs">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Verificato
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6 px-5 pt-5">
            {/* Title & faculty proximity */}
            <div>
              <p className="text-xs font-semibold text-indigo-600">
                {listing.city} · {listing.neighborhood}
              </p>
              <h2
                id="detail-sheet-title"
                className="mt-1 font-display text-xl font-extrabold leading-snug text-slate-900"
              >
                {listing.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">
                  {listing.roomType}
                </span>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {listing.distanceToFaculty}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Polo di riferimento: {listing.universityHub}
              </p>
            </div>

            {/* Financial breakdown including monthly rent and depositAmount */}
            <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
              <div>
                <p className="text-[11px] font-medium text-slate-500">
                  Canone mensile
                </p>
                <p className="mt-0.5 font-display text-lg font-extrabold text-slate-900 tabular-nums">
                  {listing.priceMonthly} €
                  <span className="text-xs font-medium text-slate-500">
                    /mese
                  </span>
                </p>
                <p className="mt-0.5 text-[11px] text-slate-600">
                  {listing.billsIncluded ? (
                    <span className="font-semibold text-emerald-700">
                      Spese incluse
                    </span>
                  ) : (
                    listing.billsEstimate
                  )}
                </p>
              </div>

              <div className="border-l border-slate-200 pl-3">
                <p className="text-[11px] font-medium text-slate-500">
                  Deposito cauzionale
                </p>
                <p className="mt-0.5 font-display text-lg font-extrabold text-slate-900 tabular-nums">
                  {listing.depositAmount} €
                </p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-slate-600">
                  <Calendar className="h-3 w-3 shrink-0" aria-hidden="true" />
                  {listing.availableFrom}
                </p>
              </div>
            </div>

            {/* Description & highlights */}
            <div>
              <h3 className="font-display text-sm font-bold text-slate-900">
                Dettagli dell’alloggio
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {listing.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-700">
                {listing.highlights.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 font-medium"
                  >
                    <ShieldCheck
                      className="h-3.5 w-3.5 text-emerald-600"
                      aria-hidden="true"
                    />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Vibe tags */}
            <div>
              <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-slate-900">
                <Sparkles className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                Atmosfera della casa
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {listing.vibeTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Current roommates section */}
            <div>
              <h3 className="flex items-center gap-1.5 font-display text-sm font-bold text-slate-900">
                <Users className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                Coinquilini attuali
              </h3>
              {listing.roommates.length > 0 ? (
                <div className="mt-2.5 space-y-2.5">
                  {listing.roommates.map((mate) => {
                    const initials = mate.name.slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={mate.name}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-slate-900">
                              {mate.name}
                            </p>
                            <span className="text-xs text-slate-500 tabular-nums">
                              · {mate.age} anni
                            </span>
                          </div>
                          <p className="truncate text-xs text-slate-600">
                            {mate.faculty}
                          </p>
                          <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
                            {mate.habitBadge}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
                  Appartamento indipendente: nessun coinquilino presente.
                </p>
              )}
            </div>

            {/* Outgoing student or direct landlord info */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5">
              <p className="text-[11px] font-semibold text-slate-500">
                Inserzionista verificato
              </p>
              <p className="mt-0.5 font-display text-sm font-bold text-slate-900">
                {listing.hostName}
              </p>
              <p className="text-xs text-slate-600">{listing.hostRole}</p>
            </div>

            {/* Application Form or Existing Application Status */}
            <section className="border-t border-slate-200 pt-5">
              {hasActiveApplication ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                      aria-hidden="true"
                    />
                    <div className="flex-1">
                      <p className="font-display text-sm font-bold text-emerald-950">
                        Candidatura già inviata ({existingApplication.status})
                      </p>
                      <p className="mt-1 text-xs text-emerald-900">
                        Videochiamata scelta:{' '}
                        <span className="font-semibold">
                          {existingApplication.callSlot}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={onGoToApplications}
                        className="mt-3 flex min-h-[44px] w-full items-center justify-center rounded-xl bg-emerald-700 px-4 text-sm font-semibold text-white hover:bg-emerald-800"
                      >
                        Gestisci in Candidature
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {isSubentro
                        ? 'Candidati al subentro'
                        : 'Contatta il proprietario'}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      I dati del tuo profilo studente verranno allegati alla
                      richiesta.
                    </p>
                  </div>

                  {/* Move-in date preference */}
                  <div>
                    <label
                      htmlFor="move-in-select"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Data di ingresso preferita
                    </label>
                    <select
                      id="move-in-select"
                      value={moveInPreference}
                      onChange={(e) => setMoveInPreference(e.target.value)}
                      className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {MOVE_IN_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Video call slot selector (callSlot) */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Video
                        className="h-3.5 w-3.5 text-indigo-600"
                        aria-hidden="true"
                      />
                      Fascia per videochiamata conoscitiva
                    </label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {CALL_SLOT_OPTIONS.map((slot) => {
                        const selected = callSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setCallSlot(slot)}
                            className={`min-h-[44px] rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-colors tabular-nums ${
                              selected
                                ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Introduction message */}
                  <div>
                    <label
                      htmlFor="application-message"
                      className="block text-xs font-bold text-slate-700"
                    >
                      Messaggio di presentazione
                    </label>
                    <textarea
                      id="application-message"
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm leading-relaxed text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                    {formError && (
                      <p className="mt-1 text-xs font-medium text-rose-600">
                        {formError}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center rounded-xl bg-indigo-600 px-4 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-700 active:scale-[0.98]"
                  >
                    Invia candidatura e proponi call
                  </button>
                </form>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

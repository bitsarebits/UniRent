import { useEffect, useState } from 'react';
import {
  BadgeCheck,
  Check,
  GraduationCap,
  Save,
  UserRound,
} from 'lucide-react';
import { StudentProfile } from '../types/unirent';

interface ProfileViewProps {
  profile: StudentProfile;
  favoritesCount: number;
  applicationsCount: number;
  onSaveProfile: (next: StudentProfile) => void;
}

const UNIVERSITIES = [
  'Alma Mater Studiorum — Bologna',
  'Università degli Studi di Padova',
  'Accademia di Belle Arti di Bologna',
  'Conservatorio Cesare Pollini — Padova',
];

// Editable Italian university student profile synced to localStorage.
export function ProfileView({
  profile,
  favoritesCount,
  applicationsCount,
  onSaveProfile,
}: ProfileViewProps) {
  const [draft, setDraft] = useState<StudentProfile>(profile);
  const [savedFeedback, setSavedFeedback] = useState(false);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const initials = draft.fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'ST';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...draft,
      fullName: draft.fullName.trim() || 'Studente Universitario',
      faculty: draft.faculty.trim() || 'Corso di Laurea',
    });
    setSavedFeedback(true);
    window.setTimeout(() => setSavedFeedback(false), 2400);
  };

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="font-display text-xl font-extrabold text-slate-900">
          Profilo studente
        </h1>
        <p className="mt-0.5 text-xs text-slate-500">
          Compila i tuoi dati per accelerare le candidature ai subentri
        </p>
      </div>

      {/* Identity summary card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 font-display text-lg font-extrabold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h2 className="truncate font-display text-base font-bold text-slate-900">
                {draft.fullName}
              </h2>
              {draft.verifiedStudent && (
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Badge Ateneo
                </span>
              )}
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-600">
              {draft.university}
            </p>
            <p className="truncate text-xs font-medium text-indigo-600">
              {draft.faculty}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-center">
          <div>
            <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
              {favoritesCount}
            </p>
            <p className="text-[11px] font-medium text-slate-500">Preferiti</p>
          </div>
          <div className="border-x border-slate-100">
            <p className="font-display text-base font-extrabold text-slate-900 tabular-nums">
              {applicationsCount}
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Candidature
            </p>
          </div>
          <div>
            <p className="font-display text-base font-extrabold text-indigo-600 tabular-nums">
              {draft.maxBudget} €
            </p>
            <p className="text-[11px] font-medium text-slate-500">
              Budget max
            </p>
          </div>
        </div>
      </div>

      {/* Editable profile form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs"
      >
        <div>
          <label
            htmlFor="profile-name"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700"
          >
            <UserRound className="h-3.5 w-3.5 text-indigo-600" />
            Nome e Cognome
          </label>
          <input
            id="profile-name"
            type="text"
            value={draft.fullName}
            onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
            className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="profile-university"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-700"
          >
            <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
            Università
          </label>
          <select
            id="profile-university"
            value={draft.university}
            onChange={(e) => setDraft({ ...draft, university: e.target.value })}
            className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {UNIVERSITIES.map((uni) => (
              <option key={uni} value={uni}>
                {uni}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="profile-faculty"
              className="block text-xs font-bold text-slate-700"
            >
              Facoltà / Corso
            </label>
            <input
              id="profile-faculty"
              type="text"
              value={draft.faculty}
              onChange={(e) => setDraft({ ...draft, faculty: e.target.value })}
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label
              htmlFor="profile-year"
              className="block text-xs font-bold text-slate-700"
            >
              Anno di corso
            </label>
            <select
              id="profile-year"
              value={draft.studyYear}
              onChange={(e) =>
                setDraft({ ...draft, studyYear: e.target.value })
              }
              className="mt-1.5 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="1° Anno Triennale">1° Anno Triennale</option>
              <option value="2° Anno Triennale">2° Anno Triennale</option>
              <option value="3° Anno Triennale">3° Anno Triennale</option>
              <option value="1° Anno Magistrale">1° Anno Magistrale</option>
              <option value="2° Anno Magistrale">2° Anno Magistrale</option>
              <option value="Dottorato / Erasmus">Dottorato / Erasmus</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="profile-budget"
              className="text-xs font-bold text-slate-700"
            >
              Budget massimo mensile
            </label>
            <span className="font-display text-sm font-bold text-indigo-600 tabular-nums">
              {draft.maxBudget} €/mese
            </span>
          </div>
          <input
            id="profile-budget"
            type="range"
            min={350}
            max={750}
            step={10}
            value={draft.maxBudget}
            onChange={(e) =>
              setDraft({ ...draft, maxBudget: Number(e.target.value) })
            }
            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="profile-bio"
            className="block text-xs font-bold text-slate-700"
          >
            Presentazione per i coinquilini
          </label>
          <textarea
            id="profile-bio"
            rows={3}
            value={draft.bio}
            onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold text-white shadow-xs transition-colors active:scale-[0.98] ${
            savedFeedback
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {savedFeedback ? (
            <>
              <Check className="h-4 w-4" aria-hidden="true" />
              Profilo salvato su questo dispositivo
            </>
          ) : (
            <>
              <Save className="h-4 w-4" aria-hidden="true" />
              Salva profilo
            </>
          )}
        </button>
      </form>
    </div>
  );
}

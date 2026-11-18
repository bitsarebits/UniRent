import { Compass, FileCheck2, Heart, UserRound } from 'lucide-react';
import { TabKey } from '../types/unirent';

interface BottomNavProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  favoritesCount: number;
  activeApplicationsCount: number;
}

// Fixed bottom navigation bar with >= 44x44px touch targets for thumb ergonomics.
export function BottomNav({
  activeTab,
  onSelectTab,
  favoritesCount,
  activeApplicationsCount,
}: BottomNavProps) {
  const items: Array<{
    key: TabKey;
    label: string;
    icon: typeof Compass;
    badge?: number;
  }> = [
    { key: 'esplora', label: 'Esplora', icon: Compass },
    {
      key: 'preferiti',
      label: 'Preferiti',
      icon: Heart,
      badge: favoritesCount,
    },
    {
      key: 'candidature',
      label: 'Candidature',
      icon: FileCheck2,
      badge: activeApplicationsCount,
    },
    { key: 'profilo', label: 'Profilo', icon: UserRound },
  ];

  return (
    <nav
      aria-label="Navigazione principale"
      className="sticky bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur-md"
    >
      <div className="grid grid-cols-4 items-center px-2 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectTab(item.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex min-h-[48px] min-w-[44px] flex-col items-center justify-center rounded-xl px-1 py-1.5 transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                isActive
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`h-[22px] w-[22px] transition-transform ${
                    isActive ? 'stroke-[2.3]' : 'stroke-[1.9]'
                  }`}
                  aria-hidden="true"
                />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span
                    aria-label={`${item.badge} elementi`}
                    className={`absolute -right-2.5 -top-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold leading-none text-white tabular-nums ${
                      item.key === 'preferiti'
                        ? 'bg-indigo-600'
                        : 'bg-emerald-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[11px] leading-none tracking-tight whitespace-nowrap ${
                  isActive ? 'font-bold text-indigo-600' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

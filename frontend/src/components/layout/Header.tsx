'use client';

import { usePathname } from 'next/navigation';
import { WalletConnect } from '@/components/common/WalletConnect';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/did': 'DIDs',
  '/assets': 'Assets',
  '/access': 'Access',
  '/anomaly': 'Anomaly',
  '/settings': 'Settings',
};

export function Header() {
  const pathname = usePathname();
  const currentPage = pageTitles[pathname] || 'DecentraID';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined w-8 text-primary md:hidden">hub</span>
        <h2
          className="text-base text-foreground"
          style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
        >
          {currentPage}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-surface-container px-3 md:flex">
          <span className="material-symbols-outlined text-[18px] text-muted-foreground">search</span>
          <input
            type="text"
            placeholder="Search resources..."
            className="h-9 w-48 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <WalletConnect compact />
      </div>
    </header>
  );
}

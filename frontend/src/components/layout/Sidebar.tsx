'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useDecentraID } from '@/hooks/useDecentraID';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: 'space_dashboard' },
  { href: '/did', label: 'DIDs', icon: 'badge' },
  { href: '/assets', label: 'Assets', icon: 'token' },
  { href: '/access', label: 'Access', icon: 'gavel' },
  { href: '/anomaly', label: 'Anomaly', icon: 'monitoring' },
  { href: '/settings', label: 'Settings', icon: 'settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        aria-label="Toggle navigation"
        className="fixed left-4 top-4 z-50 rounded-lg p-2 text-foreground transition-colors hover:bg-muted md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-full w-60 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        {/* Brand */}
        <div className="flex h-20 items-center gap-2 border-b border-sidebar-border px-5">
          <span className="material-symbols-outlined text-primary">hub</span>
          <span
            className="text-lg font-bold text-sidebar-foreground"
            style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
          >
            DecentraID
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                )}
                onClick={() => setMobileOpen(false)}
              >
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
                  />
                )}
                <span className={cn('material-symbols-outlined text-[20px]', isActive ? 'text-primary' : '')}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <SignOutButton />
        </div>
      </aside>
    </>
  );
}

function SignOutButton() {
  const router = useRouter();
  const { connected, disconnectWallet } = useDecentraID();

  if (!connected) return null;

  return (
    <button
      onClick={() => {
        disconnectWallet();
        router.push('/');
        router.refresh();
      }}
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
    >
      <span className="material-symbols-outlined text-[20px]">logout</span>
      Sign Out
    </button>
  );
}

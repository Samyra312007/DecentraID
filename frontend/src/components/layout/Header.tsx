'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/did', label: 'DIDs' },
  { href: '/assets', label: 'Assets' },
  { href: '/access', label: 'Access' },
  { href: '/anomaly', label: 'Anomaly' },
  { href: '/settings', label: 'Settings' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage = navItems.find(item => item.href === pathname)?.label || 'DecentraID';

  return (
    <header className="h-14 border-b border-border bg-background flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <span className="md:hidden w-8" />
        <h1 className="text-sm font-semibold text-foreground">{currentPage}</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 h-8 rounded-lg bg-muted text-muted-foreground text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </button>
      </div>
    </header>
  );
}

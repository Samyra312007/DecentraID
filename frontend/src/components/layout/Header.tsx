'use client';

import { useDecentraID } from '@/hooks/useDecentraID';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { address, connected, connectWallet, disconnectWallet } = useDecentraID();

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-8 border-b border-[var(--color-border)] bg-[var(--color-bg-deep)]">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.04] transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Search */}
        <div className="relative w-full max-w-xs hidden sm:block">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="input h-9 pl-9 text-[13px] rounded-lg"
          />
        </div>
      </div>

      {/* Right: notifications + wallet */}
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.04] transition-colors">
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-danger)]" />
        </button>

        {/* Wallet */}
        {connected ? (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-[var(--color-border)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
              <span className="text-[13px] font-medium text-[var(--color-text-primary)] font-mono">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-primary h-9 text-[13px] px-4">
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}

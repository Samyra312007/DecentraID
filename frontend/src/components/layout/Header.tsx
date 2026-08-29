'use client';

import { useDecentraID } from '@/hooks/useDecentraID';

export function Header() {
  const { address, connected, connectWallet, disconnectWallet } = useDecentraID();

  return (
    <header
      className="h-16 flex items-center justify-between px-8"
      style={{
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(3, 7, 18, 0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Search */}
      <div className="relative w-72">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          style={{ color: 'var(--color-text-muted)' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search..."
          className="input pl-11"
          style={{ height: 40, borderRadius: 10 }}
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl transition-colors"
          style={{ background: 'var(--color-bg-glass)' }}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: 'var(--color-text-secondary)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--color-danger)' }}
          />
        </button>

        {/* Wallet */}
        {connected ? (
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)' }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--color-success)' }} />
              <span className="text-sm font-medium text-white">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-sm font-medium px-4 py-2 rounded-xl transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="btn-primary" style={{ height: 40, padding: '8px 20px' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position: 'relative', zIndex: 1 }}>
              <path d="M21 12V7H5a2 2 0 010-4h14v4" />
              <path d="M3 5v14a2 2 0 002 2h16v-5" />
              <path d="M18 12a2 2 0 000 4h4v-4z" />
            </svg>
            <span style={{ position: 'relative', zIndex: 1 }}>Connect Wallet</span>
          </button>
        )}
      </div>
    </header>
  );
}

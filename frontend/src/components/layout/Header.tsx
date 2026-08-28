'use client';

import { useDecentraID } from '@/hooks/useDecentraID';

export function Header() {
  const { address, connected, connectWallet, disconnectWallet } = useDecentraID();

  return (
    <header className="h-16 border-b flex items-center justify-between px-8" style={{ borderColor: 'var(--color-hairline)', backgroundColor: 'var(--color-canvas)' }}>
      {/* Left side - page title area */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-64 h-10 rounded-full px-5 text-sm border-none outline-none"
            style={{ backgroundColor: 'var(--color-surface-strong)', color: 'var(--color-ink)' }}
          />
        </div>
      </div>

      {/* Right side - wallet + notifications */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <span className="text-lg">🔔</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-semantic-down)' }} />
        </button>

        {/* Wallet Connection */}
        {connected ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: 'var(--color-surface-strong)' }}>
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-semantic-up)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-sm font-medium px-4 py-2 rounded-full transition-colors"
              style={{ color: 'var(--color-body)' }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="btn-primary"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}

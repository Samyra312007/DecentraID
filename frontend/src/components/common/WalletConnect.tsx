'use client';

import { useDecentraID } from '@/hooks/useDecentraID';

interface WalletConnectProps {
  variant?: 'full' | 'compact';
}

export function WalletConnect({ variant = 'full' }: WalletConnectProps) {
  const { address, connected, connectWallet, disconnectWallet, chainId, isCorrectNetwork } = useDecentraID();

  if (connected && variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
        <span className="text-[13px] font-medium text-[var(--color-text-primary)] font-mono">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Connected Wallet</h3>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            <span className="text-[13px] text-[var(--color-success)]">Connected</span>
          </div>
        </div>
        <div className="space-y-0">
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
            <span className="text-[13px] text-[var(--color-text-muted)]">Address</span>
            <span className="text-[13px] font-mono font-medium text-[var(--color-text-primary)]">
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-[var(--color-border)]">
            <span className="text-[13px] text-[var(--color-text-muted)]">Network</span>
            <span className="text-[13px] font-medium text-[var(--color-text-primary)]">
              {isCorrectNetwork ? 'Polygon Amoy' : `Chain ${chainId}`}
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <span className="text-[13px] text-[var(--color-text-muted)]">Status</span>
            <span className={`badge ${isCorrectNetwork ? 'badge-success' : 'badge-danger'}`}>
              {isCorrectNetwork ? 'Correct Network' : 'Wrong Network'}
            </span>
          </div>
        </div>
        <button onClick={disconnectWallet} className="btn-secondary w-full mt-5">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="card text-center">
      <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
        <svg className="w-7 h-7 text-[var(--color-primary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 010-4h14v4" />
          <path d="M3 5v14a2 2 0 002 2h16v-5" />
          <path d="M18 12a2 2 0 000 4h4v-4z" />
        </svg>
      </div>
      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1.5">Connect Your Wallet</h3>
      <p className="text-[13px] text-[var(--color-text-muted)] mb-5">
        Connect your MetaMask wallet to interact with DecentraID
      </p>
      <button onClick={connectWallet} className="btn-primary w-full">
        Connect MetaMask
      </button>
    </div>
  );
}

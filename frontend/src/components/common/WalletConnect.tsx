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
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-semantic-up)' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>Connected Wallet</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-semantic-up)' }} />
            <span className="text-sm" style={{ color: 'var(--color-semantic-up)' }}>Connected</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--color-hairline-soft)' }}>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Address</span>
            <span className="text-sm font-mono font-medium" style={{ color: 'var(--color-ink)' }}>
              {address?.slice(0, 10)}...{address?.slice(-8)}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--color-hairline-soft)' }}>
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Network</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>
              {isCorrectNetwork ? 'Polygon Amoy' : `Chain ${chainId}`}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm" style={{ color: 'var(--color-muted)' }}>Status</span>
            <span className="text-sm font-medium" style={{ color: isCorrectNetwork ? 'var(--color-semantic-up)' : 'var(--color-semantic-down)' }}>
              {isCorrectNetwork ? 'Correct Network' : 'Wrong Network'}
            </span>
          </div>
        </div>

        <button
          onClick={disconnectWallet}
          className="w-full mt-4 btn-secondary"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="card text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-surface-strong)' }}>
        <span className="text-3xl">🦊</span>
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>Connect Your Wallet</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
        Connect your MetaMask wallet to interact with DecentraID
      </p>
      <button
        onClick={connectWallet}
        className="btn-primary w-full"
      >
        Connect MetaMask
      </button>
    </div>
  );
}

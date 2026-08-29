'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import { motion } from 'framer-motion';

interface WalletConnectProps {
  variant?: 'full' | 'compact';
}

export function WalletConnect({ variant = 'full' }: WalletConnectProps) {
  const { address, connected, connectWallet, disconnectWallet, chainId, isCorrectNetwork } = useDecentraID();

  if (connected && variant === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
        <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{address?.slice(0, 6)}...{address?.slice(-4)}</span>
      </div>
    );
  }

  if (connected) {
    return (
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>Connected Wallet</h3>
          <span className="badge badge-success">Connected</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Address</span>
            <span className="text-sm font-mono font-medium" style={{ color: 'var(--color-text-primary)' }}>{address?.slice(0, 10)}...{address?.slice(-8)}</span>
          </div>
          <div className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Network</span>
            <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{isCorrectNetwork ? 'Polygon Amoy' : `Chain ${chainId}`}</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Status</span>
            <span className={`badge ${isCorrectNetwork ? 'badge-success' : 'badge-danger'}`}>{isCorrectNetwork ? 'Correct Network' : 'Wrong Network'}</span>
          </div>
        </div>
        <button onClick={disconnectWallet} className="w-full mt-4 btn-secondary"><span>Disconnect</span></button>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 text-center">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} style={{ color: '#F59E0B' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 000 4h4v-4z" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text-primary)' }}>Connect Your Wallet</h3>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>Connect your MetaMask wallet to interact with DecentraID</p>
      <button onClick={connectWallet} className="btn-primary w-full">
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ position: 'relative', zIndex: 1 }}>
          <path d="M21 12V7H5a2 2 0 010-4h14v4" />
          <path d="M3 5v14a2 2 0 002 2h16v-5" />
          <path d="M18 12a2 2 0 000 4h4v-4z" />
        </svg>
        <span style={{ position: 'relative', zIndex: 1 }}>Connect MetaMask</span>
      </button>
    </motion.div>
  );
}

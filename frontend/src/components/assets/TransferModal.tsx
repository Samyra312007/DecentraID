'use client';

import { useState } from 'react';
import type { Asset } from '@/types/did';

interface TransferModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onTransfer?: (toAddress: string) => Promise<void>;
}

export function TransferModal({ asset, isOpen, onClose, onTransfer }: TransferModalProps) {
  const [toAddress, setToAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onTransfer?.(toAddress);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Transfer failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="card w-full max-w-md mx-4 relative z-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)]">Transfer Asset</h2>
          <button onClick={onClose} className="p-1.5 -mr-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.04] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 rounded-lg bg-white/[0.03] mb-5">
          <p className="text-[12px] text-[var(--color-text-muted)] mb-1">Transferring</p>
          <p className="text-[14px] font-medium text-[var(--color-text-primary)]">{asset.name}</p>
          <p className="text-[12px] font-mono text-[var(--color-text-muted)]">Token #{asset.token_id}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Recipient Address</label>
            <input
              type="text"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="input font-mono"
              placeholder="0x..."
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg text-[13px] bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1" disabled={loading || !toAddress}>
              {loading ? 'Transferring...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

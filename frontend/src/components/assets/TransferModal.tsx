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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="card w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>Transfer Asset</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl">✕</button>
        </div>

        <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Transferring</p>
          <p className="font-semibold" style={{ color: 'var(--color-ink)' }}>{asset.name}</p>
          <p className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>Token #{asset.token_id}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Recipient Address</label>
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
            <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-semantic-down)' }}>
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
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

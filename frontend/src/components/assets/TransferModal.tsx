'use client';

import { useState } from 'react';
import type { Asset } from '@/types/did';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Asset</DialogTitle>
        </DialogHeader>

        <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-surface-container p-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <span className="material-symbols-outlined text-primary">token</span>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{asset.name}</p>
            <p className="font-mono text-xs text-muted-foreground">Token #{asset.token_id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="transfer-address" className="text-sm font-semibold text-foreground">Recipient Address</label>
            <Input
              id="transfer-address"
              className="h-10 font-mono"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              placeholder="0x..."
              required
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger" role="alert">
              <span className="material-symbols-outlined text-base leading-5">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 rounded border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !toAddress}
              className="flex-1 rounded bg-primary-container py-2.5 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Transferring...' : 'Transfer'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

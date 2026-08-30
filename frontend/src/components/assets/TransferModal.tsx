'use client';

import { useState } from 'react';
import type { Asset } from '@/types/did';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

        <div className="p-4 rounded-lg bg-muted mb-4">
          <p className="text-xs text-muted-foreground mb-1">Transferring</p>
          <p className="text-sm font-medium text-foreground">{asset.name}</p>
          <p className="text-xs font-mono text-muted-foreground">Token #{asset.token_id}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Recipient Address</Label>
            <Input
              id="address"
              value={toAddress}
              onChange={(e) => setToAddress(e.target.value)}
              className="font-mono"
              placeholder="0x..."
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !toAddress} className="flex-1">
              {loading ? 'Transferring...' : 'Transfer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client';

import { useState } from 'react';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { AssetMintRequest } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MintFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function MintForm({ onSuccess, onCancel }: MintFormProps) {
  const { address, connected } = useDecentraID();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    assetType: 'credential',
    file: null as File | null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !address) return;

    setLoading(true);
    setError(null);

    try {
      const request: AssetMintRequest = {
        name: formData.name,
        description: formData.description,
        asset_type: formData.assetType,
        metadata: { description: formData.description, image: '' },
        issuer_address: address,
        owner_address: address,
      };

      console.log('Minting asset:', request);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint asset');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">Please connect your wallet to mint assets</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="inner-glow">
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="mint-name" className="text-sm font-semibold text-foreground">Name</label>
            <Input
              id="mint-name"
              className="h-10"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Asset name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="mint-desc" className="text-sm font-semibold text-foreground">Description</label>
            <Textarea
              id="mint-desc"
              className="min-h-[88px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe your asset"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="mint-type" className="text-sm font-semibold text-foreground">Asset Type</label>
            <select
              id="mint-type"
              value={formData.assetType}
              onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <option value="credential">Credential</option>
              <option value="certificate">Certificate</option>
              <option value="license">License</option>
              <option value="document">Document</option>
            </select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-semibold text-foreground">File (Optional)</span>
            <div
              className="cursor-pointer rounded-lg border border-dashed border-border p-8 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              />
              {formData.file ? (
                <p className="flex items-center justify-center gap-2 text-sm text-foreground">
                  <span className="material-symbols-outlined text-base text-primary">description</span>
                  {formData.file.name}
                </p>
              ) : (
                <>
                  <span className="material-symbols-outlined mx-auto mb-2 block text-3xl text-muted-foreground">
                    upload_file
                  </span>
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger" role="alert">
              <span className="material-symbols-outlined text-base leading-5">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded border border-border py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded bg-primary-container py-2.5 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Minting...' : 'Mint Asset'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { AssetMintRequest } from '@/types/did';

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
        metadata: {
          description: formData.description,
          image: '',
        },
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
      <div className="card text-center py-8">
        <p className="text-[13px] text-[var(--color-text-muted)]">Please connect your wallet to mint assets</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-5">Mint New Asset</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="Asset name"
            required
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input resize-none"
            rows={3}
            placeholder="Describe your asset"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Asset Type</label>
          <select
            value={formData.assetType}
            onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
            className="input"
          >
            <option value="credential">Credential</option>
            <option value="certificate">Certificate</option>
            <option value="license">License</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">File (Optional)</label>
          <div
            className="border border-dashed border-[var(--color-border-strong)] rounded-lg p-8 text-center cursor-pointer hover:border-[var(--color-primary)] transition-colors"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
            />
            {formData.file ? (
              <p className="text-[13px] text-[var(--color-text-primary)]">{formData.file.name}</p>
            ) : (
              <>
                <svg className="w-8 h-8 mx-auto mb-2 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <path d="M17 8l-5-5-5 5" />
                  <path d="M12 3v12" />
                </svg>
                <p className="text-[13px] text-[var(--color-text-muted)]">Click to upload or drag and drop</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-[13px] bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Minting...' : 'Mint Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}

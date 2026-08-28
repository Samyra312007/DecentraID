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
          image: '', // Would be IPFS CID after upload
        },
        issuer_address: address,
        owner_address: address,
      };

      // In production, this would upload to IPFS then mint
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
      <div className="card text-center">
        <p style={{ color: 'var(--color-muted)' }}>Please connect your wallet to mint assets</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-ink)' }}>Mint New Asset</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Name</label>
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
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input h-24 resize-none"
            placeholder="Describe your asset"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Asset Type</label>
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
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>File (Optional)</label>
          <div 
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            style={{ borderColor: 'var(--color-hairline)' }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
            />
            {formData.file ? (
              <p className="text-sm" style={{ color: 'var(--color-ink)' }}>{formData.file.name}</p>
            ) : (
              <>
                <span className="text-3xl block mb-2">📎</span>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Click to upload or drag and drop</p>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-semantic-down)' }}>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary flex-1"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary flex-1"
            disabled={loading}
          >
            {loading ? 'Minting...' : 'Mint Asset'}
          </button>
        </div>
      </form>
    </div>
  );
}

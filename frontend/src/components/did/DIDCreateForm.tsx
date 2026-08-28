'use client';

import { useState } from 'react';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { DIDCreateRequest } from '@/types/did';

interface DIDCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function DIDCreateForm({ onSuccess, onCancel }: DIDCreateFormProps) {
  const { address, connected } = useDecentraID();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceEndpoint: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !address) return;

    setLoading(true);
    setError(null);

    try {
      const request: DIDCreateRequest = {
        controller: address,
        name: formData.name,
        did: `did:decentraid:${address}`, // Will be generated properly
        document: {
          '@context': ['https://www.w3.org/ns/did/v1'],
          id: `did:decentraid:${address}`,
          controller: address,
          authentication: [{ type: 'EcdsaSecp256k1VerificationKey2019', publicKeyHex: address }],
          service: formData.serviceEndpoint ? [{
            id: '#service-1',
            type: 'DIDCommMessaging',
            serviceEndpoint: formData.serviceEndpoint,
          }] : [],
        },
        verification_methods: [address],
        services: formData.serviceEndpoint ? [{
          id: '#service-1',
          type: 'DIDCommMessaging',
          service_endpoint: formData.serviceEndpoint,
        }] : [],
      };

      // In production, this would call the API
      console.log('Creating DID:', request);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create DID');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="card text-center">
        <p style={{ color: 'var(--color-muted)' }}>Please connect your wallet to create a DID</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-ink)' }}>Create New DID</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="My DID"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input h-24 resize-none"
            placeholder="Optional description for your DID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Service Endpoint</label>
          <input
            type="url"
            value={formData.serviceEndpoint}
            onChange={(e) => setFormData({ ...formData, serviceEndpoint: e.target.value })}
            className="input"
            placeholder="https://example.com/service"
          />
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
            {loading ? 'Creating...' : 'Create DID'}
          </button>
        </div>
      </form>
    </div>
  );
}

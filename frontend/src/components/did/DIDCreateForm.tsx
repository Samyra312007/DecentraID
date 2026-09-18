'use client';

import { useState } from 'react';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { DIDCreateRequest } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageHeader } from '@/components/layout/PageHeader';

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
        did: `did:decentraid:${address}`,
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
      <Card>
        <CardContent className="py-8 text-center">
          <p className="text-sm text-muted-foreground">Please connect your wallet to create a DID</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="inner-glow">
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="did-name" className="text-sm font-semibold text-foreground">Name</label>
            <Input
              id="did-name"
              className="h-10"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My DID"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="did-desc" className="text-sm font-semibold text-foreground">Description</label>
            <Textarea
              id="did-desc"
              className="min-h-[88px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Optional description for your DID"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="did-endpoint" className="text-sm font-semibold text-foreground">Service Endpoint</label>
            <Input
              id="did-endpoint"
              className="h-10"
              type="url"
              value={formData.serviceEndpoint}
              onChange={(e) => setFormData({ ...formData, serviceEndpoint: e.target.value })}
              placeholder="https://example.com/service"
            />
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
              {loading ? 'Creating...' : 'Create DID'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function DIDCreateFormHeader() {
  return (
    <PageHeader
      eyebrow="Identity"
      title="Create New DID"
      subtitle="Set up a new decentralized identity"
    />
  );
}

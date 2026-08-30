'use client';

import { useState } from 'react';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { DIDCreateRequest } from '@/types/did';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
        <CardContent className="text-center py-8">
          <p className="text-sm text-muted-foreground">Please connect your wallet to create a DID</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New DID</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="My DID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Optional description for your DID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endpoint">Service Endpoint</Label>
            <Input
              id="endpoint"
              type="url"
              value={formData.serviceEndpoint}
              onChange={(e) => setFormData({ ...formData, serviceEndpoint: e.target.value })}
              placeholder="https://example.com/service"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm bg-destructive/10 text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Creating...' : 'Create DID'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

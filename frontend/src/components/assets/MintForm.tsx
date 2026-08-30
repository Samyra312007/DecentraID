'use client';

import { useState } from 'react';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { AssetMintRequest } from '@/types/did';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';

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
        <CardContent className="text-center py-8">
          <p className="text-sm text-muted-foreground">Please connect your wallet to mint assets</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mint New Asset</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Asset name"
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
              placeholder="Describe your asset"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Asset Type</Label>
            <select
              id="type"
              value={formData.assetType}
              onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="credential">Credential</option>
              <option value="certificate">Certificate</option>
              <option value="license">License</option>
              <option value="document">Document</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>File (Optional)</Label>
            <div
              className="border border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <input
                id="file-input"
                type="file"
                className="hidden"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
              />
              {formData.file ? (
                <p className="text-sm text-foreground">{formData.file.name}</p>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                </>
              )}
            </div>
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
              {loading ? 'Minting...' : 'Mint Asset'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

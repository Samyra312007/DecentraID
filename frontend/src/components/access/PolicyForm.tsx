'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PolicyFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PolicyForm({ onSuccess, onCancel }: PolicyFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resourceType: '',
    allowedActions: [] as string[],
    requiredRole: '',
  });

  const availableActions = ['read', 'write', 'delete', 'share', 'admin'];

  const toggleAction = (action: string) => {
    setFormData(prev => ({
      ...prev,
      allowedActions: prev.allowedActions.includes(action)
        ? prev.allowedActions.filter(a => a !== action)
        : [...prev.allowedActions, action],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Creating policy:', formData);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Access Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="policy-name">Policy Name</Label>
            <Input
              id="policy-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Document Access Policy"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="policy-desc">Description</Label>
            <Textarea
              id="policy-desc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Describe this policy"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-type">Resource Type</Label>
            <select
              id="resource-type"
              value={formData.resourceType}
              onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              required
            >
              <option value="">Select resource type</option>
              <option value="did">DID</option>
              <option value="asset">Asset</option>
              <option value="document">Document</option>
              <option value="all">All Resources</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Allowed Actions</Label>
            <div className="flex flex-wrap gap-2">
              {availableActions.map(action => (
                <Button
                  key={action}
                  type="button"
                  variant={formData.allowedActions.includes(action) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => toggleAction(action)}
                >
                  {action}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="required-role">Required Role</Label>
            <select
              id="required-role"
              value={formData.requiredRole}
              onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">No role required</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
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
              {loading ? 'Creating...' : 'Create Policy'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

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
    <Card className="inner-glow">
      <CardContent className="pt-2">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="policy-name" className="text-sm font-semibold text-foreground">Policy Name</label>
            <Input
              id="policy-name"
              className="h-10"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Document Access Policy"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="policy-desc" className="text-sm font-semibold text-foreground">Description</label>
            <Textarea
              id="policy-desc"
              className="min-h-[72px]"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              placeholder="Describe this policy"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="resource-type" className="text-sm font-semibold text-foreground">Resource Type</label>
            <select
              id="resource-type"
              value={formData.resourceType}
              onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
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
            <span className="text-sm font-semibold text-foreground">Allowed Actions</span>
            <div className="flex flex-wrap gap-2">
              {availableActions.map(action => (
                <button
                  key={action}
                  type="button"
                  onClick={() => toggleAction(action)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors',
                    formData.allowedActions.includes(action)
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  {action}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="required-role" className="text-sm font-semibold text-foreground">Required Role</label>
            <select
              id="required-role"
              value={formData.requiredRole}
              onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
              className="flex h-10 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <option value="">No role required</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
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
              {loading ? 'Creating...' : 'Create Policy'}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

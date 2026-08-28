'use client';

import { useState } from 'react';

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
      // In production, this would call the API
      console.log('Creating policy:', formData);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create policy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-ink)' }}>Create Access Policy</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Policy Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            placeholder="e.g., Document Access Policy"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input h-20 resize-none"
            placeholder="Describe this policy"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Resource Type</label>
          <select
            value={formData.resourceType}
            onChange={(e) => setFormData({ ...formData, resourceType: e.target.value })}
            className="input"
            required
          >
            <option value="">Select resource type</option>
            <option value="did">DID</option>
            <option value="asset">Asset</option>
            <option value="document">Document</option>
            <option value="all">All Resources</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Allowed Actions</label>
          <div className="flex flex-wrap gap-2">
            {availableActions.map(action => (
              <button
                key={action}
                type="button"
                onClick={() => toggleAction(action)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  formData.allowedActions.includes(action)
                    ? 'text-white'
                    : ''
                }`}
                style={{
                  backgroundColor: formData.allowedActions.includes(action)
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-strong)',
                  color: formData.allowedActions.includes(action)
                    ? 'var(--color-on-primary)'
                    : 'var(--color-ink)',
                }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Required Role</label>
          <select
            value={formData.requiredRole}
            onChange={(e) => setFormData({ ...formData, requiredRole: e.target.value })}
            className="input"
          >
            <option value="">No role required</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>

        {error && (
          <div className="p-3 rounded-xl text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-semantic-down)' }}>
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1" disabled={loading}>
            {loading ? 'Creating...' : 'Create Policy'}
          </button>
        </div>
      </form>
    </div>
  );
}

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
      <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-5">Create Access Policy</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Policy Name</label>
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
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input resize-none"
            rows={2}
            placeholder="Describe this policy"
          />
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Resource Type</label>
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
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Allowed Actions</label>
          <div className="flex flex-wrap gap-2">
            {availableActions.map(action => (
              <button
                key={action}
                type="button"
                onClick={() => toggleAction(action)}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium border transition-colors ${
                  formData.allowedActions.includes(action)
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-transparent text-[var(--color-text-primary)] border-[var(--color-border-strong)] hover:border-[var(--color-text-muted)]'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Required Role</label>
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
          <div className="p-3 rounded-lg text-[13px] bg-[var(--color-danger)]/10 text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="flex gap-3 pt-2">
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

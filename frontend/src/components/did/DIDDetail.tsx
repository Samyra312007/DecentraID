'use client';

import type { DIDDocument } from '@/types/did';

interface DIDDetailProps {
  did: DIDDocument;
  onBack?: () => void;
}

export function DIDDetail({ did, onBack }: DIDDetailProps) {
  const statusColors = {
    active: 'var(--color-semantic-up)',
    suspended: 'var(--color-accent-yellow)',
    deactivated: 'var(--color-semantic-down)',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold" style={{ color: 'var(--color-ink)' }}>{did.name || 'DID Details'}</h1>
          <p className="text-sm font-mono mt-1" style={{ color: 'var(--color-muted)' }}>{did.did}</p>
        </div>
        <span 
          className="badge text-sm"
          style={{ 
            backgroundColor: `${statusColors[did.status]}20`,
            color: statusColors[did.status]
          }}
        >
          {did.status}
        </span>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Basic Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-hairline-soft)' }}>
              <span style={{ color: 'var(--color-muted)' }}>Controller</span>
              <span className="font-mono text-sm" style={{ color: 'var(--color-ink)' }}>{did.controller}</span>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-hairline-soft)' }}>
              <span style={{ color: 'var(--color-muted)' }}>Created</span>
              <span style={{ color: 'var(--color-ink)' }}>{new Date(did.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b" style={{ borderColor: 'var(--color-hairline-soft)' }}>
              <span style={{ color: 'var(--color-muted)' }}>Updated</span>
              <span style={{ color: 'var(--color-ink)' }}>{new Date(did.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Verification Methods</h2>
          <div className="space-y-2">
            {did.verification_methods.map((method, index) => (
              <div key={index} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
                <p className="text-sm font-mono" style={{ color: 'var(--color-ink)' }}>{method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      {did.services && did.services.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Services</h2>
          <div className="space-y-3">
            {did.services.map((service, index) => (
              <div key={index} className="p-4 rounded-xl border" style={{ borderColor: 'var(--color-hairline)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: 'var(--color-ink)' }}>{service.id}</span>
                  <span className="badge">{service.type}</span>
                </div>
                <p className="text-sm font-mono" style={{ color: 'var(--color-muted)' }}>{service.serviceEndpoint}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Actions</h2>
        <div className="flex gap-3">
          <button className="btn-secondary">Update DID</button>
          <button className="btn-secondary">Add Service</button>
          {did.status === 'active' && (
            <button className="btn-secondary" style={{ color: 'var(--color-accent-yellow)' }}>Suspend DID</button>
          )}
        </div>
      </div>
    </div>
  );
}

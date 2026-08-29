'use client';

import type { DIDDocument } from '@/types/did';

interface DIDDetailProps {
  did: DIDDocument;
  onBack?: () => void;
}

const statusStyles = {
  active: 'badge-success',
  suspended: 'badge-warning',
  deactivated: 'badge-danger',
};

export function DIDDetail({ did, onBack }: DIDDetailProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-white/[0.04] transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold text-[var(--color-text-primary)] truncate">{did.name || 'DID Details'}</h1>
          <p className="text-[13px] font-mono text-[var(--color-text-muted)] mt-0.5 truncate">{did.did}</p>
        </div>
        <span className={`badge ${statusStyles[did.status] || 'badge-neutral'}`}>
          {did.status}
        </span>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Basic Information</h2>
          <div className="space-y-0">
            <div className="flex justify-between py-3 border-b border-[var(--color-border)]">
              <span className="text-[13px] text-[var(--color-text-muted)]">Controller</span>
              <span className="text-[13px] font-mono text-[var(--color-text-primary)]">{did.controller}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-[var(--color-border)]">
              <span className="text-[13px] text-[var(--color-text-muted)]">Created</span>
              <span className="text-[13px] text-[var(--color-text-primary)]">{new Date(did.created_at).toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-[13px] text-[var(--color-text-muted)]">Updated</span>
              <span className="text-[13px] text-[var(--color-text-primary)]">{new Date(did.updated_at).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Verification Methods</h2>
          <div className="space-y-2">
            {did.verification_methods.map((method, index) => (
              <div key={index} className="p-3 rounded-lg bg-white/[0.03]">
                <p className="text-[13px] font-mono text-[var(--color-text-primary)]">{method}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      {did.services && did.services.length > 0 && (
        <div className="card">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Services</h2>
          <div className="space-y-3">
            {did.services.map((service, index) => (
              <div key={index} className="p-4 rounded-lg border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{service.id}</span>
                  <span className="badge badge-neutral">{service.type}</span>
                </div>
                <p className="text-[13px] font-mono text-[var(--color-text-muted)]">{service.serviceEndpoint}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="card">
        <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn-secondary">Update DID</button>
          <button className="btn-secondary">Add Service</button>
          {did.status === 'active' && (
            <button className="btn-secondary text-[var(--color-warning)]">Suspend DID</button>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import type { DIDDocument } from '@/types/did';

interface DIDCardProps {
  did: DIDDocument;
  onSelect?: (did: DIDDocument) => void;
}

export function DIDCard({ did, onSelect }: DIDCardProps) {
  const statusColors = {
    active: { bg: '#D1FAE5', text: '#059669' },
    suspended: { bg: '#FEF3C7', text: '#D97706' },
    deactivated: { bg: '#FEE2E2', text: '#DC2626' },
  };

  const status = statusColors[did.status] || statusColors.active;

  return (
    <div className="card cursor-pointer p-6 group" onClick={() => onSelect?.(did)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>DID</div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>{did.name || 'Unnamed DID'}</h3>
            <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>{did.did.slice(0, 20)}...</p>
          </div>
        </div>
        <span className="badge" style={{ background: status.bg, color: status.text }}>{did.status}</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-text-muted)' }}>Controller</span>
          <span className="font-mono" style={{ color: 'var(--color-text-primary)' }}>{did.controller.slice(0, 8)}...{did.controller.slice(-6)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-text-muted)' }}>Created</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{new Date(did.created_at).toLocaleDateString()}</span>
        </div>
        {did.services && did.services.length > 0 && (
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-text-muted)' }}>Services</span>
            <span style={{ color: 'var(--color-text-primary)' }}>{did.services.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

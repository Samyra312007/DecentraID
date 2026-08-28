'use client';

import type { DIDDocument } from '@/types/did';

interface DIDCardProps {
  did: DIDDocument;
  onSelect?: (did: DIDDocument) => void;
}

export function DIDCard({ did, onSelect }: DIDCardProps) {
  const statusColors = {
    active: 'var(--color-semantic-up)',
    suspended: 'var(--color-accent-yellow)',
    deactivated: 'var(--color-semantic-down)',
  };

  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onSelect?.(did)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: 'var(--color-primary)' }}>
            DID
          </div>
          <div>
            <h3 className="font-semibold" style={{ color: 'var(--color-ink)' }}>{did.name || 'Unnamed DID'}</h3>
            <p className="text-xs font-mono" style={{ color: 'var(--color-muted)' }}>
              {did.did.slice(0, 20)}...
            </p>
          </div>
        </div>
        <span 
          className="badge"
          style={{ 
            backgroundColor: `${statusColors[did.status]}20`,
            color: statusColors[did.status]
          }}
        >
          {did.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-muted)' }}>Controller</span>
          <span className="font-mono" style={{ color: 'var(--color-ink)' }}>
            {did.controller.slice(0, 8)}...{did.controller.slice(-6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-muted)' }}>Created</span>
          <span style={{ color: 'var(--color-ink)' }}>
            {new Date(did.created_at).toLocaleDateString()}
          </span>
        </div>
        {did.services && did.services.length > 0 && (
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-muted)' }}>Services</span>
            <span style={{ color: 'var(--color-ink)' }}>{did.services.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

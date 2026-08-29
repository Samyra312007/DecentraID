'use client';

import type { DIDDocument } from '@/types/did';

interface DIDCardProps {
  did: DIDDocument;
  onSelect?: (did: DIDDocument) => void;
}

export function DIDCard({ did, onSelect }: DIDCardProps) {
  const statusColors = {
    active: { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399' },
    suspended: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24' },
    deactivated: { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171' },
  };

  const status = statusColors[did.status] || statusColors.active;

  return (
    <div
      className="glass cursor-pointer p-6 group"
      onClick={() => onSelect?.(did)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xs"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            DID
          </div>
          <div>
            <h3 className="font-semibold text-white">{did.name || 'Unnamed DID'}</h3>
            <p className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              {did.did.slice(0, 20)}...
            </p>
          </div>
        </div>
        <span className="badge" style={{ background: status.bg, color: status.text }}>
          {did.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-text-muted)' }}>Controller</span>
          <span className="font-mono text-white">{did.controller.slice(0, 8)}...{did.controller.slice(-6)}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-text-muted)' }}>Created</span>
          <span className="text-white">{new Date(did.created_at).toLocaleDateString()}</span>
        </div>
        {did.services && did.services.length > 0 && (
          <div className="flex justify-between">
            <span style={{ color: 'var(--color-text-muted)' }}>Services</span>
            <span className="text-white">{did.services.length}</span>
          </div>
        )}
      </div>

      <div className="mt-4 h-px w-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)' }} />
    </div>
  );
}

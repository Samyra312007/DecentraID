'use client';

import type { DIDDocument } from '@/types/did';

interface DIDCardProps {
  did: DIDDocument;
  onSelect?: (did: DIDDocument) => void;
}

const statusStyles = {
  active: 'badge-success',
  suspended: 'badge-warning',
  deactivated: 'badge-danger',
};

export function DIDCard({ did, onSelect }: DIDCardProps) {
  return (
    <div
      className="card cursor-pointer hover:bg-[var(--color-bg-card-hover)] transition-colors"
      onClick={() => onSelect?.(did)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)] truncate">{did.name || 'Unnamed DID'}</h3>
            <p className="text-[12px] font-mono text-[var(--color-text-muted)] truncate">
              {did.did.slice(0, 20)}...
            </p>
          </div>
        </div>
        <span className={`badge ${statusStyles[did.status] || 'badge-neutral'}`}>
          {did.status}
        </span>
      </div>

      <div className="space-y-2 text-[13px]">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Controller</span>
          <span className="font-mono text-[var(--color-text-primary)]">{did.controller.slice(0, 8)}...{did.controller.slice(-6)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Created</span>
          <span className="text-[var(--color-text-primary)]">{new Date(did.created_at).toLocaleDateString()}</span>
        </div>
        {did.services && did.services.length > 0 && (
          <div className="flex justify-between">
            <span className="text-[var(--color-text-muted)]">Services</span>
            <span className="text-[var(--color-text-primary)]">{did.services.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

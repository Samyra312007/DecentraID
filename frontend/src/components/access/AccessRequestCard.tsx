'use client';

import type { AccessRequest } from '@/types/did';

interface AccessRequestCardProps {
  request: AccessRequest;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
}

const statusBadge = {
  pending: 'badge-warning',
  approved: 'badge-success',
  denied: 'badge-danger',
};

export function AccessRequestCard({ request, onApprove, onDeny }: AccessRequestCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">{request.resource_type}</h3>
          <p className="text-[12px] text-[var(--color-text-muted)]">Resource: {request.resource_id}</p>
        </div>
        <span className={`badge ${statusBadge[request.status] || 'badge-neutral'}`}>
          {request.status}
        </span>
      </div>

      <div className="space-y-2 text-[13px] mb-4">
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Requester</span>
          <span className="font-mono text-[var(--color-text-primary)]">
            {request.requester_address.slice(0, 8)}...{request.requester_address.slice(-6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Action</span>
          <span className="text-[var(--color-text-primary)]">{request.requested_action}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--color-text-muted)]">Created</span>
          <span className="text-[var(--color-text-primary)]">
            {new Date(request.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="flex gap-3 pt-3 border-t border-[var(--color-border)]">
          <button onClick={() => onDeny?.(request.id)} className="btn-secondary flex-1">
            Deny
          </button>
          <button onClick={() => onApprove?.(request.id)} className="btn-primary flex-1">
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

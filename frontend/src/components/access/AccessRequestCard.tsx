'use client';

import type { AccessRequest } from '@/types/did';

interface AccessRequestCardProps {
  request: AccessRequest;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
}

export function AccessRequestCard({ request, onApprove, onDeny }: AccessRequestCardProps) {
  const statusColors = {
    pending: 'var(--color-accent-yellow)',
    approved: 'var(--color-semantic-up)',
    denied: 'var(--color-semantic-down)',
  };

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--color-ink)' }}>{request.resource_type}</h3>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Resource: {request.resource_id}</p>
        </div>
        <span 
          className="badge"
          style={{ 
            backgroundColor: `${statusColors[request.status]}20`,
            color: statusColors[request.status]
          }}
        >
          {request.status}
        </span>
      </div>

      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-muted)' }}>Requester</span>
          <span className="font-mono" style={{ color: 'var(--color-ink)' }}>
            {request.requester_address.slice(0, 8)}...{request.requester_address.slice(-6)}
          </span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-muted)' }}>Action</span>
          <span style={{ color: 'var(--color-ink)' }}>{request.requested_action}</span>
        </div>
        <div className="flex justify-between">
          <span style={{ color: 'var(--color-muted)' }}>Created</span>
          <span style={{ color: 'var(--color-ink)' }}>
            {new Date(request.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {request.status === 'pending' && (
        <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-hairline-soft)' }}>
          <button
            onClick={() => onDeny?.(request.id)}
            className="btn-secondary flex-1"
          >
            Deny
          </button>
          <button
            onClick={() => onApprove?.(request.id)}
            className="btn-primary flex-1"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import type { AccessRequest } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AccessRequestCardProps {
  request: AccessRequest;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
}

const statusVariant = {
  pending: 'secondary' as const,
  approved: 'default' as const,
  denied: 'destructive' as const,
};

const statusIcon = {
  pending: { icon: 'hourglass_top', className: 'bg-warning/10 text-warning' },
  approved: { icon: 'check_circle', className: 'bg-success/10 text-success' },
  denied: { icon: 'cancel', className: 'bg-danger/10 text-danger' },
};

export function AccessRequestCard({ request, onApprove, onDeny }: AccessRequestCardProps) {
  const icon = statusIcon[request.status] || statusIcon.pending;

  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${icon.className}`}>
              <span className="material-symbols-outlined text-[20px]">{icon.icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">{request.resource_type}</h3>
              <p className="font-mono text-xs text-muted-foreground">{request.resource_id}</p>
            </div>
          </div>
          <Badge variant={statusVariant[request.status] || 'secondary'}>
            {request.status}
          </Badge>
        </div>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Requester</span>
            <span className="font-mono text-foreground">
              {request.requester_address.slice(0, 8)}...{request.requester_address.slice(-6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Action</span>
            <span className="capitalize text-foreground">{request.requested_action}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground">
              {new Date(request.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-3 border-t border-border pt-3">
            <button
              onClick={() => onDeny?.(request.id)}
              className="flex-1 rounded border border-border py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Deny
            </button>
            <button
              onClick={() => onApprove?.(request.id)}
              className="flex-1 rounded bg-primary-container py-2 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90"
            >
              Approve
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

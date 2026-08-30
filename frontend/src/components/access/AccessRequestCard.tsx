'use client';

import type { AccessRequest } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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

export function AccessRequestCard({ request, onApprove, onDeny }: AccessRequestCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{request.resource_type}</h3>
            <p className="text-xs text-muted-foreground">Resource: {request.resource_id}</p>
          </div>
          <Badge variant={statusVariant[request.status] || 'secondary'}>
            {request.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Requester</span>
            <span className="font-mono text-foreground">
              {request.requester_address.slice(0, 8)}...{request.requester_address.slice(-6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Action</span>
            <span className="text-foreground">{request.requested_action}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground">
              {new Date(request.created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {request.status === 'pending' && (
          <div className="flex gap-3 pt-3 border-t border-border">
            <Button variant="outline" onClick={() => onDeny?.(request.id)} className="flex-1">
              Deny
            </Button>
            <Button onClick={() => onApprove?.(request.id)} className="flex-1">
              Approve
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

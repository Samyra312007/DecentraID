'use client';

import type { DIDDocument } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DIDCardProps {
  did: DIDDocument;
  onSelect?: (did: DIDDocument) => void;
}

const statusVariant = {
  active: 'default' as const,
  suspended: 'secondary' as const,
  deactivated: 'destructive' as const,
};

const statusColor = {
  active: 'text-success',
  suspended: 'text-warning',
  deactivated: 'text-danger',
};

export function DIDCard({ did, onSelect }: DIDCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onSelect?.(did)}
    >
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-foreground truncate">{did.name || 'Unnamed DID'}</h3>
              <p className="text-xs font-mono text-muted-foreground truncate">
                {did.did.slice(0, 20)}...
              </p>
            </div>
          </div>
          <Badge variant={statusVariant[did.status] || 'secondary'}>
            {did.status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Controller</span>
            <span className="font-mono text-foreground">{did.controller.slice(0, 8)}...{did.controller.slice(-6)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created</span>
            <span className="text-foreground">{new Date(did.created_at).toLocaleDateString()}</span>
          </div>
          {did.services && did.services.length > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Services</span>
              <span className="text-foreground">{did.services.length}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

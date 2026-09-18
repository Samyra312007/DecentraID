'use client';

import type { DIDDocument } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

export function DIDCard({ did, onSelect }: DIDCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all hover:border-primary/40"
      onClick={() => onSelect?.(did)}
    >
      <CardContent>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surface-container transition-colors group-hover:bg-primary/10">
              <span className="material-symbols-outlined text-primary">badge</span>
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-foreground">{did.name || 'Unnamed DID'}</h3>
              <p className="truncate font-mono text-xs text-muted-foreground">
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

        <div
          aria-hidden
          className={cn(
            'pointer-events-none mt-4 h-0.5 w-full origin-left rounded-full bg-primary/60 transition-transform duration-200',
            'scale-x-0 group-hover:scale-x-100'
          )}
        />
      </CardContent>
    </Card>
  );
}

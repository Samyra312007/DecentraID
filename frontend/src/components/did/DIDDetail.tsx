'use client';

import type { DIDDocument } from '@/types/did';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DIDDetailProps {
  did: DIDDocument;
  onBack?: () => void;
}

const statusVariant = {
  active: 'default' as const,
  suspended: 'secondary' as const,
  deactivated: 'destructive' as const,
};

export function DIDDetail({ did, onBack }: DIDDetailProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          aria-label="Back to identities"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>
        <div className="min-w-0 flex-1">
          <h1
            className="truncate text-lg text-foreground"
            style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
          >
            {did.name || 'DID Details'}
          </h1>
          <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{did.did}</p>
        </div>
        <Badge variant={statusVariant[did.status] || 'secondary'}>
          {did.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="inner-glow">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="flex justify-between gap-4 border-b border-border py-3">
                <span className="text-sm text-muted-foreground">Controller</span>
                <span className="truncate font-mono text-sm text-foreground">{did.controller}</span>
              </div>
              <div className="flex justify-between border-b border-border py-3">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="text-sm text-foreground">{new Date(did.created_at).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-sm text-muted-foreground">Updated</span>
                <span className="text-sm text-foreground">{new Date(did.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="inner-glow">
          <CardHeader>
            <CardTitle>Verification Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {did.verification_methods.map((method, index) => (
                <div key={index} className="flex items-center gap-2 rounded-lg border border-border bg-surface-container p-3">
                  <span className="material-symbols-outlined text-[18px] text-primary">key</span>
                  <p className="truncate font-mono text-sm text-foreground">{method}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {did.services && did.services.length > 0 && (
        <Card className="inner-glow">
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {did.services.map((service, index) => (
                <div key={index} className="rounded-lg border border-border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{service.id}</span>
                    <Badge variant="outline">{service.type}</Badge>
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">{service.serviceEndpoint}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <span className="material-symbols-outlined text-base">edit</span>
              Update DID
            </button>
            <button className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
              <span className="material-symbols-outlined text-base">add_link</span>
              Add Service
            </button>
            {did.status === 'active' && (
              <button className="inline-flex items-center gap-2 rounded border border-danger/30 bg-danger/5 px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10">
                <span className="material-symbols-outlined text-base">pause_circle</span>
                Suspend DID
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

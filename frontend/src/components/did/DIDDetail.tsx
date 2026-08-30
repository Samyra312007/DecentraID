'use client';

import type { DIDDocument } from '@/types/did';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-semibold text-foreground truncate">{did.name || 'DID Details'}</h1>
          <p className="text-xs font-mono text-muted-foreground mt-0.5 truncate">{did.did}</p>
        </div>
        <Badge variant={statusVariant[did.status] || 'secondary'}>
          {did.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              <div className="flex justify-between py-3 border-b border-border">
                <span className="text-sm text-muted-foreground">Controller</span>
                <span className="text-sm font-mono text-foreground">{did.controller}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-border">
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

        <Card>
          <CardHeader>
            <CardTitle>Verification Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {did.verification_methods.map((method, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted">
                  <p className="text-sm font-mono text-foreground">{method}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {did.services && did.services.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {did.services.map((service, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{service.id}</span>
                    <Badge variant="outline">{service.type}</Badge>
                  </div>
                  <p className="text-xs font-mono text-muted-foreground">{service.serviceEndpoint}</p>
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
            <Button variant="outline">Update DID</Button>
            <Button variant="outline">Add Service</Button>
            {did.status === 'active' && (
              <Button variant="destructive">Suspend DID</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

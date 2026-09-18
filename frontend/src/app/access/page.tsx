'use client';

import { useState } from 'react';
import { AccessRequestCard } from '@/components/access/AccessRequestCard';
import { PolicyForm } from '@/components/access/PolicyForm';
import { RoleManager } from '@/components/access/RoleManager';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { AccessRequest } from '@/types/did';
import { PageHeader } from '@/components/layout/PageHeader';

const mockRequests: AccessRequest[] = [
  { id: '1', requester_address: '0x1234567890abcdef1234567890abcdef12345678', resource_id: 'did:decentraid:0xabcdef', resource_type: 'DID', requested_action: 'read', status: 'pending', created_at: '2024-01-20T14:22:00Z', updated_at: '2024-01-20T14:22:00Z' },
  { id: '2', requester_address: '0xabcdef1234567890abcdef1234567890abcdef12', resource_id: 'asset:1', resource_type: 'Asset', requested_action: 'share', status: 'approved', created_at: '2024-01-19T10:15:00Z', updated_at: '2024-01-19T11:30:00Z' },
];

export default function AccessPage() {
  const { connected } = useDecentraID();
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  if (!connected) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Access"
          title="Access Control"
          subtitle="Manage access requests, policies, and roles"
        />
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Access"
        title="Access Control"
        subtitle="Manage access requests, policies, and roles"
      />

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-4 space-y-3">
          {mockRequests.map((request) => (
            <AccessRequestCard key={request.id} request={request} onApprove={(id) => console.log('Approve:', id)} onDeny={(id) => console.log('Deny:', id)} />
          ))}
        </TabsContent>

        <TabsContent value="policies" className="mt-4 space-y-4">
          {showPolicyForm ? (
            <PolicyForm onSuccess={() => setShowPolicyForm(false)} onCancel={() => setShowPolicyForm(false)} />
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPolicyForm(true)}
                  className="inline-flex items-center gap-2 rounded bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Create Policy
                </button>
              </div>
              <Card className="inner-glow">
                <CardContent className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <span className="material-symbols-outlined text-2xl text-primary">policy</span>
                  </div>
                  <h3
                    className="mb-1 text-lg text-foreground"
                    style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
                  >
                    No Policies
                  </h3>
                  <p className="text-sm text-muted-foreground">Create your first access policy</p>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="roles" className="mt-4">
          <RoleManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

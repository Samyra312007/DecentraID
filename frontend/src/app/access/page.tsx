'use client';

import { useState } from 'react';
import { AccessRequestCard } from '@/components/access/AccessRequestCard';
import { PolicyForm } from '@/components/access/PolicyForm';
import { RoleManager } from '@/components/access/RoleManager';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText } from 'lucide-react';
import type { AccessRequest } from '@/types/did';

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
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Access Control</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage access requests, policies, and roles</p>
        </div>
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Access Control</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage access requests, policies, and roles</p>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Requests</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-3 mt-4">
          {mockRequests.map((request) => (
            <AccessRequestCard key={request.id} request={request} onApprove={(id) => console.log('Approve:', id)} onDeny={(id) => console.log('Deny:', id)} />
          ))}
        </TabsContent>

        <TabsContent value="policies" className="space-y-4 mt-4">
          {showPolicyForm ? (
            <PolicyForm onSuccess={() => setShowPolicyForm(false)} onCancel={() => setShowPolicyForm(false)} />
          ) : (
            <>
              <div className="flex justify-end">
                <Button onClick={() => setShowPolicyForm(true)}>+ Create Policy</Button>
              </div>
              <Card>
                <CardContent className="text-center py-12">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1">No Policies</h3>
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

'use client';

import { useState } from 'react';
import { AccessRequestCard } from '@/components/access/AccessRequestCard';
import { PolicyForm } from '@/components/access/PolicyForm';
import { RoleManager } from '@/components/access/RoleManager';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { AccessRequest } from '@/types/did';

// Mock data for demonstration
const mockRequests: AccessRequest[] = [
  {
    id: '1',
    requester_address: '0x1234567890abcdef1234567890abcdef12345678',
    resource_id: 'did:decentraid:0xabcdef',
    resource_type: 'DID',
    requested_action: 'read',
    status: 'pending',
    created_at: '2024-01-20T14:22:00Z',
    updated_at: '2024-01-20T14:22:00Z',
  },
  {
    id: '2',
    requester_address: '0xabcdef1234567890abcdef1234567890abcdef12',
    resource_id: 'asset:1',
    resource_type: 'Asset',
    requested_action: 'share',
    status: 'approved',
    created_at: '2024-01-19T10:15:00Z',
    updated_at: '2024-01-19T11:30:00Z',
  },
];

export default function AccessPage() {
  const { connected } = useDecentraID();
  const [activeTab, setActiveTab] = useState<'requests' | 'policies' | 'roles'>('requests');
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  if (!connected) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-ink)' }}>Access Control</h1>
          <p className="mt-1" style={{ color: 'var(--color-muted)' }}>Manage access requests, policies, and roles</p>
        </div>
        <div className="max-w-md">
          <WalletConnect />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-ink)' }}>Access Control</h1>
        <p className="mt-1" style={{ color: 'var(--color-muted)' }}>Manage access requests, policies, and roles</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b" style={{ borderColor: 'var(--color-hairline)' }}>
        {(['requests', 'policies', 'roles'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'border-b-2' : ''
            }`}
            style={{
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-muted)',
              borderColor: activeTab === tab ? 'var(--color-primary)' : 'transparent',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {mockRequests.map((request) => (
            <AccessRequestCard
              key={request.id}
              request={request}
              onApprove={(id) => console.log('Approve:', id)}
              onDeny={(id) => console.log('Deny:', id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="space-y-4">
          {showPolicyForm ? (
            <PolicyForm
              onSuccess={() => setShowPolicyForm(false)}
              onCancel={() => setShowPolicyForm(false)}
            />
          ) : (
            <>
              <div className="flex justify-end">
                <button onClick={() => setShowPolicyForm(true)} className="btn-primary">
                  + Create Policy
                </button>
              </div>
              <div className="card text-center py-12">
                <span className="text-4xl mb-4 block">📋</span>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>No Policies</h3>
                <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
                  Create your first access policy
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'roles' && (
        <RoleManager />
      )}
    </div>
  );
}

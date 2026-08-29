'use client';

import { useState } from 'react';
import { AccessRequestCard } from '@/components/access/AccessRequestCard';
import { PolicyForm } from '@/components/access/PolicyForm';
import { RoleManager } from '@/components/access/RoleManager';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { AccessRequest } from '@/types/did';

const mockRequests: AccessRequest[] = [
  { id: '1', requester_address: '0x1234567890abcdef1234567890abcdef12345678', resource_id: 'did:decentraid:0xabcdef', resource_type: 'DID', requested_action: 'read', status: 'pending', created_at: '2024-01-20T14:22:00Z', updated_at: '2024-01-20T14:22:00Z' },
  { id: '2', requester_address: '0xabcdef1234567890abcdef1234567890abcdef12', resource_id: 'asset:1', resource_type: 'Asset', requested_action: 'share', status: 'approved', created_at: '2024-01-19T10:15:00Z', updated_at: '2024-01-19T11:30:00Z' },
];

export default function AccessPage() {
  const { connected } = useDecentraID();
  const [activeTab, setActiveTab] = useState<'requests' | 'policies' | 'roles'>('requests');
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  if (!connected) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)]">Access Control</h1>
          <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Manage access requests, policies, and roles</p>
        </div>
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)]">Access Control</h1>
        <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Manage access requests, policies, and roles</p>
      </div>

      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-[var(--color-border)]">
        {(['requests', 'policies', 'roles'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-[13px] font-medium rounded transition-colors ${
              activeTab === tab
                ? 'bg-[var(--color-primary)]/15 text-[var(--color-primary)]'
                : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'requests' && (
        <div className="space-y-3">
          {mockRequests.map((request) => (
            <AccessRequestCard key={request.id} request={request} onApprove={(id) => console.log('Approve:', id)} onDeny={(id) => console.log('Deny:', id)} />
          ))}
        </div>
      )}

      {activeTab === 'policies' && (
        <div className="space-y-4">
          {showPolicyForm ? (
            <PolicyForm onSuccess={() => setShowPolicyForm(false)} onCancel={() => setShowPolicyForm(false)} />
          ) : (
            <>
              <div className="flex justify-end">
                <button onClick={() => setShowPolicyForm(true)} className="btn-primary">+ Create Policy</button>
              </div>
              <div className="card text-center py-12">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">No Policies</h3>
                <p className="text-[13px] text-[var(--color-text-muted)]">Create your first access policy</p>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'roles' && <RoleManager />}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
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
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">Access Control</h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Manage access requests, policies, and roles</p>
        </motion.div>
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Access Control</h1>
        <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Manage access requests, policies, and roles</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)' }}>
        {(['requests', 'policies', 'roles'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all"
            style={{
              background: activeTab === tab ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
              color: activeTab === tab ? '#818cf8' : 'var(--color-text-muted)',
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
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
                <button onClick={() => setShowPolicyForm(true)} className="btn-primary"><span>+ Create Policy</span></button>
              </div>
              <div className="glass text-center py-12">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1} style={{ color: 'var(--color-text-muted)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-white mb-2">No Policies</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Create your first access policy</p>
              </div>
            </>
          )}
        </div>
      )}

      {activeTab === 'roles' && <RoleManager />}
    </div>
  );
}

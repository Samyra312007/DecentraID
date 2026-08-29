'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DIDCard } from '@/components/did/DIDCard';
import { DIDCreateForm } from '@/components/did/DIDCreateForm';
import { DIDDetail } from '@/components/did/DIDDetail';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { DIDDocument } from '@/types/did';

const mockDIDs: DIDDocument[] = [
  {
    id: '1',
    did: 'did:decentraid:0x1234567890abcdef1234567890abcdef12345678',
    name: 'Personal Identity',
    controller: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'active',
    verification_methods: ['0x1234567890abcdef1234567890abcdef12345678'],
    services: [{ id: '#service-1', type: 'DIDCommMessaging', serviceEndpoint: 'https://example.com/messaging' }],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:22:00Z',
  },
  {
    id: '2',
    did: 'did:decentraid:0xabcdef1234567890abcdef1234567890abcdef12',
    name: 'Business Identity',
    controller: '0x1234567890abcdef1234567890abcdef12345678',
    status: 'active',
    verification_methods: ['0xabcdef1234567890abcdef1234567890abcdef12'],
    services: [],
    created_at: '2024-01-10T08:15:00Z',
    updated_at: '2024-01-18T11:45:00Z',
  },
];

export default function DIDPage() {
  const { connected } = useDecentraID();
  const [view, setView] = useState<'list' | 'create' | 'detail'>('list');
  const [selectedDID, setSelectedDID] = useState<DIDDocument | null>(null);

  if (!connected) {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">Decentralized Identifiers</h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Manage your DIDs on Polygon blockchain</p>
        </motion.div>
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  if (view === 'create') {
    return (
      <div className="space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">Create New DID</h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Set up a new decentralized identity</p>
        </motion.div>
        <div className="max-w-2xl"><DIDCreateForm onSuccess={() => setView('list')} onCancel={() => setView('list')} /></div>
      </div>
    );
  }

  if (view === 'detail' && selectedDID) {
    return (
      <div className="space-y-8">
        <DIDDetail did={selectedDID} onBack={() => { setView('list'); setSelectedDID(null); }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Decentralized Identifiers</h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Manage your DIDs on Polygon blockchain</p>
        </div>
        <button onClick={() => setView('create')} className="btn-primary"><span>+ Create DID</span></button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockDIDs.map((did, i) => (
          <motion.div key={did.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <DIDCard did={did} onSelect={(d) => { setSelectedDID(d); setView('detail'); }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

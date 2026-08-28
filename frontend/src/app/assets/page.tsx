'use client';

import { useState } from 'react';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { MintForm } from '@/components/assets/MintForm';
import { TransferModal } from '@/components/assets/TransferModal';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { Asset } from '@/types/did';

// Mock data for demonstration
const mockAssets: Asset[] = [
  {
    token_id: '1',
    name: 'Driver License',
    asset_type: 'credential',
    issuer_address: '0x1234567890abcdef1234567890abcdef12345678',
    owner_address: '0x1234567890abcdef1234567890abcdef12345678',
    metadata: { description: 'Valid driver license credential' },
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  },
  {
    token_id: '2',
    name: 'University Degree',
    asset_type: 'certificate',
    issuer_address: '0xabcdef1234567890abcdef1234567890abcdef12',
    owner_address: '0x1234567890abcdef1234567890abcdef12345678',
    metadata: { description: 'Bachelor of Science in Computer Science' },
    created_at: '2024-01-10T08:15:00Z',
    updated_at: '2024-01-10T08:15:00Z',
  },
  {
    token_id: '3',
    name: 'Professional License',
    asset_type: 'license',
    issuer_address: '0x1234567890abcdef1234567890abcdef12345678',
    owner_address: '0x1234567890abcdef1234567890abcdef12345678',
    metadata: { description: 'Software Development License' },
    created_at: '2024-01-08T14:22:00Z',
    updated_at: '2024-01-08T14:22:00Z',
  },
];

export default function AssetsPage() {
  const { connected } = useDecentraID();
  const [view, setView] = useState<'grid' | 'mint'>('grid');
  const [transferAsset, setTransferAsset] = useState<Asset | null>(null);

  if (!connected) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-ink)' }}>Assets</h1>
          <p className="mt-1" style={{ color: 'var(--color-muted)' }}>Manage your NFT credentials and documents</p>
        </div>
        <div className="max-w-md">
          <WalletConnect />
        </div>
      </div>
    );
  }

  if (view === 'mint') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-ink)' }}>Mint New Asset</h1>
          <p className="mt-1" style={{ color: 'var(--color-muted)' }}>Create a new NFT credential</p>
        </div>
        <div className="max-w-2xl">
          <MintForm 
            onSuccess={() => setView('grid')} 
            onCancel={() => setView('grid')} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-ink)' }}>Assets</h1>
          <p className="mt-1" style={{ color: 'var(--color-muted)' }}>Manage your NFT credentials and documents</p>
        </div>
        <button 
          onClick={() => setView('mint')}
          className="btn-primary"
        >
          + Mint Asset
        </button>
      </div>

      {/* Asset Grid */}
      <AssetGrid 
        assets={mockAssets} 
        onSelectAsset={(asset) => setTransferAsset(asset)}
      />

      {/* Transfer Modal */}
      {transferAsset && (
        <TransferModal
          asset={transferAsset}
          isOpen={!!transferAsset}
          onClose={() => setTransferAsset(null)}
          onTransfer={async (toAddress) => {
            console.log('Transferring to:', toAddress);
            setTransferAsset(null);
          }}
        />
      )}
    </div>
  );
}

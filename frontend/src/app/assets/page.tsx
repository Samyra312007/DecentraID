'use client';

import { useState } from 'react';
import { AssetGrid } from '@/components/assets/AssetGrid';
import { MintForm } from '@/components/assets/MintForm';
import { TransferModal } from '@/components/assets/TransferModal';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import type { Asset } from '@/types/did';
import { PageHeader } from '@/components/layout/PageHeader';

const mockAssets: Asset[] = [
  { token_id: '1', name: 'Driver License', asset_type: 'credential', issuer_address: '0x1234567890abcdef1234567890abcdef12345678', owner_address: '0x1234567890abcdef1234567890abcdef12345678', metadata: { description: 'Valid driver license credential' }, created_at: '2024-01-15T10:30:00Z', updated_at: '2024-01-15T10:30:00Z' },
  { token_id: '2', name: 'University Degree', asset_type: 'certificate', issuer_address: '0xabcdef1234567890abcdef1234567890abcdef12', owner_address: '0x1234567890abcdef1234567890abcdef12345678', metadata: { description: 'Bachelor of Science in Computer Science' }, created_at: '2024-01-10T08:15:00Z', updated_at: '2024-01-10T08:15:00Z' },
  { token_id: '3', name: 'Professional License', asset_type: 'license', issuer_address: '0x1234567890abcdef1234567890abcdef12345678', owner_address: '0x1234567890abcdef1234567890abcdef12345678', metadata: { description: 'Software Development License' }, created_at: '2024-01-08T14:22:00Z', updated_at: '2024-01-08T14:22:00Z' },
];

export default function AssetsPage() {
  const { connected } = useDecentraID();
  const [view, setView] = useState<'grid' | 'mint'>('grid');
  const [transferAsset, setTransferAsset] = useState<Asset | null>(null);

  if (!connected) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Assets"
          title="Digital Assets"
          subtitle="Manage your NFT credentials and documents"
        />
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  if (view === 'mint') {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Assets"
          title="Mint New Asset"
          subtitle="Create a new NFT credential"
        />
        <div className="max-w-2xl"><MintForm onSuccess={() => setView('grid')} onCancel={() => setView('grid')} /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Assets"
        title="Digital Assets"
        subtitle="Manage your NFT credentials and documents"
        actions={
          <button
            onClick={() => setView('mint')}
            className="inline-flex items-center gap-2 rounded bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Mint Asset
          </button>
        }
      />

      <AssetGrid assets={mockAssets} onSelectAsset={(asset) => setTransferAsset(asset)} />

      {transferAsset && (
        <TransferModal
          asset={transferAsset}
          isOpen={!!transferAsset}
          onClose={() => setTransferAsset(null)}
          onTransfer={async (toAddress) => { console.log('Transferring to:', toAddress); setTransferAsset(null); }}
        />
      )}
    </div>
  );
}

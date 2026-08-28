'use client';

import { AssetCard } from './AssetCard';
import type { Asset } from '@/types/did';

interface AssetGridProps {
  assets: Asset[];
  onSelectAsset?: (asset: Asset) => void;
}

export function AssetGrid({ assets, onSelectAsset }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="card text-center py-12">
        <span className="text-4xl mb-4 block">💎</span>
        <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>No Assets Yet</h3>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Mint your first asset to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <AssetCard
          key={asset.token_id}
          asset={asset}
          onSelect={onSelectAsset}
        />
      ))}
    </div>
  );
}

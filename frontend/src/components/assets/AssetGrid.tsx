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
      <div className="card text-center py-16">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">No Assets Yet</h3>
        <p className="text-[13px] text-[var(--color-text-muted)]">
          Mint your first asset to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

'use client';

import type { Asset } from '@/types/did';

interface AssetCardProps {
  asset: Asset;
  onSelect?: (asset: Asset) => void;
}

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  return (
    <div 
      className="card cursor-pointer hover:shadow-lg transition-all"
      onClick={() => onSelect?.(asset)}
    >
      {/* Asset Image Placeholder */}
      <div 
        className="w-full h-48 rounded-xl mb-4 flex items-center justify-center"
        style={{ backgroundColor: 'var(--color-surface-soft)' }}
      >
        <span className="text-4xl">📄</span>
      </div>

      {/* Asset Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold" style={{ color: 'var(--color-ink)' }}>{asset.name}</h3>
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{asset.asset_type}</p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--color-muted)' }}>Token ID</span>
          <span className="font-mono" style={{ color: 'var(--color-ink)' }}>#{asset.token_id}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span style={{ color: 'var(--color-muted)' }}>Owner</span>
          <span className="font-mono" style={{ color: 'var(--color-ink)' }}>
            {asset.owner_address.slice(0, 6)}...{asset.owner_address.slice(-4)}
          </span>
        </div>

        {asset.metadata && (
          <div className="pt-3 border-t" style={{ borderColor: 'var(--color-hairline-soft)' }}>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
              {asset.metadata.description || 'No description'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

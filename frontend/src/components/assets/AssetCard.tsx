'use client';

import type { Asset } from '@/types/did';

interface AssetCardProps {
  asset: Asset;
  onSelect?: (asset: Asset) => void;
}

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  return (
    <div
      className="card cursor-pointer hover:bg-[var(--color-bg-card-hover)] transition-colors"
      onClick={() => onSelect?.(asset)}
    >
      <div className="w-full h-40 rounded-lg mb-4 flex items-center justify-center bg-white/[0.03]">
        <svg className="w-10 h-10 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M16 13H8" />
          <path d="M16 17H8" />
          <path d="M10 9H8" />
        </svg>
      </div>

      <div className="space-y-2.5">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">{asset.name}</h3>
          <p className="text-[12px] text-[var(--color-text-muted)] capitalize">{asset.asset_type}</p>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[var(--color-text-muted)]">Token ID</span>
          <span className="font-mono text-[var(--color-text-primary)]">#{asset.token_id}</span>
        </div>

        <div className="flex items-center justify-between text-[13px]">
          <span className="text-[var(--color-text-muted)]">Owner</span>
          <span className="font-mono text-[var(--color-text-primary)]">
            {asset.owner_address.slice(0, 6)}...{asset.owner_address.slice(-4)}
          </span>
        </div>

        {asset.metadata && (
          <div className="pt-2.5 border-t border-[var(--color-border)]">
            <p className="text-[12px] text-[var(--color-text-muted)]">
              {asset.metadata.description || 'No description'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

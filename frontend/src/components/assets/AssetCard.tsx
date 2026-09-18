'use client';

import type { Asset } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: Asset;
  onSelect?: (asset: Asset) => void;
}

const typeIcon: Record<string, string> = {
  credential: 'verified',
  certificate: 'workspace_premium',
  license: 'gavel',
  document: 'description',
};

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  return (
    <Card
      className="group cursor-pointer transition-all hover:border-primary/40"
      onClick={() => onSelect?.(asset)}
    >
      <CardContent>
        <div className="mb-4 flex h-40 w-full items-center justify-center rounded-lg border border-border bg-gradient-to-br from-surface-container to-surface-container-lowest transition-colors group-hover:border-primary/20">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-transform duration-200 group-hover:scale-105">
            <span className="material-symbols-outlined text-3xl text-primary">
              {typeIcon[asset.asset_type] || 'description'}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{asset.name}</h3>
            <p className="text-xs capitalize text-muted-foreground">{asset.asset_type}</p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Token ID</span>
            <span className="font-mono text-foreground">#{asset.token_id}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Owner</span>
            <span className="font-mono text-foreground">
              {asset.owner_address.slice(0, 6)}...{asset.owner_address.slice(-4)}
            </span>
          </div>

          {asset.metadata && (
            <div className="border-t border-border pt-2.5">
              <p className="text-xs text-muted-foreground">
                {asset.metadata.description || 'No description'}
              </p>
            </div>
          )}
        </div>

        <div
          aria-hidden
          className={cn(
            'pointer-events-none mt-4 h-0.5 w-full origin-left rounded-full bg-primary/60 transition-transform duration-200',
            'scale-x-0 group-hover:scale-x-100'
          )}
        />
      </CardContent>
    </Card>
  );
}

'use client';

import { AssetCard } from './AssetCard';
import type { Asset } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';

interface AssetGridProps {
  assets: Asset[];
  onSelectAsset?: (asset: Asset) => void;
}

export function AssetGrid({ assets, onSelectAsset }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <Card className="inner-glow">
        <CardContent className="py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <span className="material-symbols-outlined text-2xl text-primary">token</span>
          </div>
          <h3
            className="mb-1 text-lg text-foreground"
            style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
          >
            No Assets Yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Mint your first asset to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
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

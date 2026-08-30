'use client';

import { AssetCard } from './AssetCard';
import type { Asset } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { Gem } from 'lucide-react';

interface AssetGridProps {
  assets: Asset[];
  onSelectAsset?: (asset: Asset) => void;
}

export function AssetGrid({ assets, onSelectAsset }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-16">
          <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
            <Gem className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">No Assets Yet</h3>
          <p className="text-sm text-muted-foreground">
            Mint your first asset to get started
          </p>
        </CardContent>
      </Card>
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

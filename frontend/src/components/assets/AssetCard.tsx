'use client';

import type { Asset } from '@/types/did';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface AssetCardProps {
  asset: Asset;
  onSelect?: (asset: Asset) => void;
}

export function AssetCard({ asset, onSelect }: AssetCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onSelect?.(asset)}
    >
      <CardContent>
        <div className="w-full h-40 rounded-lg mb-4 flex items-center justify-center bg-muted">
          <FileText className="w-10 h-10 text-muted-foreground" />
        </div>

        <div className="space-y-2.5">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{asset.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{asset.asset_type}</p>
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
            <div className="pt-2.5 border-t border-border">
              <p className="text-xs text-muted-foreground">
                {asset.metadata.description || 'No description'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

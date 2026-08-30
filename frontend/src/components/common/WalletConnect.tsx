'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

export function WalletConnect() {
  const { address, connected, loading, connectWallet, disconnectWallet } = useDecentraID();

  if (connected && address) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
              <Wallet className="w-4.5 h-4.5 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Connected</p>
              <p className="text-xs font-mono text-muted-foreground">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={disconnectWallet}>
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary/10 flex items-center justify-center">
          <Wallet className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5">Connect Your Wallet</h3>
        <p className="text-sm text-muted-foreground mb-5">
          Connect your MetaMask wallet to interact with DecentraID
        </p>
        <Button onClick={connectWallet} disabled={loading} className="w-full">
          {loading ? 'Connecting...' : 'Connect MetaMask'}
        </Button>
      </CardContent>
    </Card>
  );
}

'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

export function WalletConnect({ compact = false }: { compact?: boolean }) {
  const { address, connected, loading, connectWallet, disconnectWallet } = useDecentraID();

  // Compact chip for the app header
  if (compact) {
    if (connected && address) {
      return (
        <button
          onClick={disconnectWallet}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-container px-3 py-1.5 transition-colors hover:border-primary/40"
          title="Disconnect wallet"
        >
          <span className="h-2 w-2 rounded-full bg-success" />
          <span className="font-mono text-xs text-foreground">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <span className="material-symbols-outlined text-[16px] text-muted-foreground">logout</span>
        </button>
      );
    }
    return (
      <button
        onClick={connectWallet}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-primary-container px-3 py-1.5 text-xs font-semibold text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        <span className="material-symbols-outlined text-[16px]">account_balance_wallet</span>
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </button>
    );
  }

  // Full card for pages (dashboard connect prompt, settings, etc.)
  if (connected && address) {
    return (
      <Card>
        <CardContent className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
              <Wallet className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Connected</p>
              <p className="font-mono text-xs text-muted-foreground">
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
    <Card className="inner-glow">
      <CardContent className="py-10 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          <span className="material-symbols-outlined text-2xl text-primary">account_balance_wallet</span>
        </div>
        <h3
          className="mb-1.5 text-lg text-foreground"
          style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
        >
          Connect Your Wallet
        </h3>
        <p className="mb-5 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
          Connect your MetaMask wallet to interact with DecentraID
        </p>
        <button
          onClick={connectWallet}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">account_balance_wallet</span>
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      </CardContent>
    </Card>
  );
}

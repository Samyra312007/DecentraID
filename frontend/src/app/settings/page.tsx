'use client';

import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import Link from 'next/link';

export default function SettingsPage() {
  const { connected, chainId } = useDecentraID();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your DecentraID preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Connection</CardTitle>
            </CardHeader>
            <CardContent>
              <WalletConnect />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <select
                  id="network"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="amoy">Polygon Amoy (Testnet)</option>
                  <option value="mainnet">Polygon Mainnet</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input id="api-endpoint" defaultValue="http://localhost:8000" placeholder="API endpoint URL" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ipfs-gateway">IPFS Gateway</Label>
                <Input id="ipfs-gateway" defaultValue="https://ipfs.io" placeholder="IPFS gateway URL" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {[
                  { label: 'Email notifications', description: 'Receive email alerts for important events' },
                  { label: 'Push notifications', description: 'Browser push notifications for real-time alerts' },
                  { label: 'Access request alerts', description: 'Get notified when someone requests access' },
                  { label: 'Anomaly alerts', description: 'Receive alerts for suspicious activity' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="flex justify-between py-2.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between py-2.5 border-b border-border">
                  <span className="text-sm text-muted-foreground">Chain ID</span>
                  <span className="text-sm font-mono text-foreground">{chainId || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="default">Connected</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {[
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Manage DIDs', href: '/did' },
                  { label: 'View Assets', href: '/assets' },
                  { label: 'Anomaly Dashboard', href: '/anomaly' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="block text-sm py-2 text-primary hover:text-primary/80 transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

'use client';

import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { PageHeader } from '@/components/layout/PageHeader';
import Link from 'next/link';

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-input/30 px-3 py-1 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40';

export default function SettingsPage() {
  const { connected, chainId } = useDecentraID();

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Preferences"
        title="Settings"
        subtitle="Configure your DecentraID preferences"
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-primary">account_balance_wallet</span>
                Wallet Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WalletConnect />
            </CardContent>
          </Card>

          <Card className="inner-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-primary">lan</span>
                Network Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="network" className="text-sm font-semibold text-foreground">Network</label>
                <select id="network" defaultValue="amoy" className={selectClass}>
                  <option value="amoy">Polygon Amoy (Testnet)</option>
                  <option value="mainnet">Polygon Mainnet</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="api-endpoint" className="text-sm font-semibold text-foreground">API Endpoint</label>
                <Input id="api-endpoint" className="h-10" defaultValue="http://localhost:8000" placeholder="API endpoint URL" />
              </div>
              <div className="space-y-2">
                <label htmlFor="ipfs-gateway" className="text-sm font-semibold text-foreground">IPFS Gateway</label>
                <Input id="ipfs-gateway" className="h-10" defaultValue="https://ipfs.io" placeholder="IPFS gateway URL" />
              </div>
            </CardContent>
          </Card>

          <Card className="inner-glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-primary">notifications</span>
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {[
                  { label: 'Email notifications', description: 'Receive email alerts for important events' },
                  { label: 'Push notifications', description: 'Browser push notifications for real-time alerts' },
                  { label: 'Access request alerts', description: 'Get notified when someone requests access' },
                  { label: 'Anomaly alerts', description: 'Receive alerts for suspicious activity' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-border py-3 last:border-0">
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
              <CardTitle className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-primary">info</span>
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                <div className="flex justify-between border-b border-border py-2.5">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <span className="text-sm text-foreground">1.0.0</span>
                </div>
                <div className="flex justify-between border-b border-border py-2.5">
                  <span className="text-sm text-muted-foreground">Chain ID</span>
                  <span className="font-mono text-sm text-foreground">{chainId || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-2.5">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant={connected ? 'default' : 'secondary'}>{connected ? 'Connected' : 'Offline'}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[20px] text-primary">link</span>
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0.5">
                {[
                  { label: 'Dashboard', href: '/dashboard', icon: 'space_dashboard' },
                  { label: 'Manage DIDs', href: '/did', icon: 'badge' },
                  { label: 'View Assets', href: '/assets', icon: 'token' },
                  { label: 'Anomaly Dashboard', href: '/anomaly', icon: 'monitoring' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2.5 rounded-md px-2 py-2 text-sm text-primary transition-colors hover:bg-primary/5"
                  >
                    <span className="material-symbols-outlined text-[18px]">{link.icon}</span>
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

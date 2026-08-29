'use client';

import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';

export default function SettingsPage() {
  const { connected, chainId } = useDecentraID();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)]">Settings</h1>
        <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Configure your DecentraID preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="card">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Wallet Connection</h2>
            <WalletConnect />
          </div>

          <div className="card">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Network Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">Network</label>
                <select className="input">
                  <option value="amoy">Polygon Amoy (Testnet)</option>
                  <option value="mainnet">Polygon Mainnet</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">API Endpoint</label>
                <input type="text" defaultValue="http://localhost:8000" className="input" placeholder="API endpoint URL" />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[var(--color-text-primary)] mb-1.5">IPFS Gateway</label>
                <input type="text" defaultValue="https://ipfs.io" className="input" placeholder="IPFS gateway URL" />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Notifications</h2>
            <div className="space-y-0">
              {[
                { label: 'Email notifications', description: 'Receive email alerts for important events' },
                { label: 'Push notifications', description: 'Browser push notifications for real-time alerts' },
                { label: 'Access request alerts', description: 'Get notified when someone requests access' },
                { label: 'Anomaly alerts', description: 'Receive alerts for suspicious activity' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0">
                  <div>
                    <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{item.label}</p>
                    <p className="text-[12px] text-[var(--color-text-muted)]">{item.description}</p>
                  </div>
                  <button className="relative w-10 h-[22px] rounded-full bg-white/[0.08] transition-colors">
                    <div className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white/40 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">About</h2>
            <div className="space-y-0">
              <div className="flex justify-between py-2.5 border-b border-[var(--color-border)]">
                <span className="text-[13px] text-[var(--color-text-muted)]">Version</span>
                <span className="text-[13px] text-[var(--color-text-primary)]">1.0.0</span>
              </div>
              <div className="flex justify-between py-2.5 border-b border-[var(--color-border)]">
                <span className="text-[13px] text-[var(--color-text-muted)]">Chain ID</span>
                <span className="text-[13px] font-mono text-[var(--color-text-primary)]">{chainId || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-[13px] text-[var(--color-text-muted)]">Status</span>
                <span className="badge badge-success">Connected</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Quick Links</h2>
            <div className="space-y-0">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Manage DIDs', href: '/did' },
                { label: 'View Assets', href: '/assets' },
                { label: 'Anomaly Dashboard', href: '/anomaly' },
              ].map((link) => (
                <a key={link.href} href={link.href} className="block text-[13px] py-2 text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition-colors">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

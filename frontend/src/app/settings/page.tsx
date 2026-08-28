'use client';

import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';

export default function SettingsPage() {
  const { connected, chainId } = useDecentraID();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-ink)' }}>Settings</h1>
        <p className="mt-1" style={{ color: 'var(--color-muted)' }}>Configure your DecentraID preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallet Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Wallet Connection</h2>
            <WalletConnect />
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Network Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>Network</label>
                <select className="input">
                  <option value="amoy">Polygon Amoy (Testnet)</option>
                  <option value="mainnet">Polygon Mainnet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>API Endpoint</label>
                <input
                  type="text"
                  defaultValue="http://localhost:8000"
                  className="input"
                  placeholder="API endpoint URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-ink)' }}>IPFS Gateway</label>
                <input
                  type="text"
                  defaultValue="https://ipfs.io"
                  className="input"
                  placeholder="IPFS gateway URL"
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Notifications</h2>
            <div className="space-y-3">
              {[
                { label: 'Email notifications', description: 'Receive email alerts for important events' },
                { label: 'Push notifications', description: 'Browser push notifications for real-time alerts' },
                { label: 'Access request alerts', description: 'Get notified when someone requests access' },
                { label: 'Anomaly alerts', description: 'Receive alerts for suspicious activity' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b" style={{ borderColor: 'var(--color-hairline-soft)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{item.description}</p>
                  </div>
                  <button
                    className="w-12 h-6 rounded-full p-1 transition-colors"
                    style={{ backgroundColor: 'var(--color-surface-strong)' }}
                  >
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>About</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Version</span>
                <span style={{ color: 'var(--color-ink)' }}>1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Chain ID</span>
                <span className="font-mono" style={{ color: 'var(--color-ink)' }}>{chainId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Status</span>
                <span style={{ color: 'var(--color-semantic-up)' }}>Connected</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Quick Links</h2>
            <div className="space-y-2">
              <a href="/dashboard" className="block text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>Dashboard</a>
              <a href="/did" className="block text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>Manage DIDs</a>
              <a href="/assets" className="block text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>View Assets</a>
              <a href="/anomaly" className="block text-sm hover:underline" style={{ color: 'var(--color-primary)' }}>Anomaly Dashboard</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

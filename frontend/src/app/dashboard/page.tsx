'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import { WalletConnect } from '@/components/common/WalletConnect';

const stats = [
  { label: 'Total DIDs', value: '12', change: '+2 this week', icon: '🔐' },
  { label: 'Assets Minted', value: '48', change: '+5 today', icon: '💎' },
  { label: 'Access Requests', value: '7', change: '3 pending', icon: '🛡️' },
  { label: 'Risk Score', value: '23', change: 'Low risk', icon: '📊', color: 'var(--color-semantic-up)' },
];

const recentActivity = [
  { type: 'DID Created', did: 'did:decentraid:0x1234...5678', time: '2 hours ago', icon: '🔐' },
  { type: 'Asset Minted', name: 'Driver License', time: '5 hours ago', icon: '💎' },
  { type: 'Access Approved', resource: 'Medical Records', time: '1 day ago', icon: '✅' },
  { type: 'Policy Updated', name: 'Document Access', time: '2 days ago', icon: '📝' },
];

export default function DashboardPage() {
  const { connected } = useDecentraID();

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-semibold" style={{ color: 'var(--color-ink)' }}>Dashboard</h1>
        <p className="mt-1" style={{ color: 'var(--color-muted)' }}>
          Welcome to DecentraID. Manage your decentralized identity.
        </p>
      </div>

      {/* Wallet Connection (if not connected) */}
      {!connected && (
        <div className="max-w-md">
          <WalletConnect />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs" style={{ color: stat.color || 'var(--color-muted)' }}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>{stat.value}</div>
            <div className="text-sm" style={{ color: 'var(--color-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-surface-soft)' }}>
                <span className="text-xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>{activity.type}</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
                    {activity.did || activity.name || activity.resource}
                  </p>
                </div>
                <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Quick Actions</h2>
          <div className="space-y-3">
            <a href="/did" className="block p-4 rounded-xl border hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--color-hairline)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🔐</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Create New DID</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Set up a new decentralized identity</p>
                </div>
              </div>
            </a>
            <a href="/assets" className="block p-4 rounded-xl border hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--color-hairline)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">💎</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Mint Asset</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Create a new NFT credential</p>
                </div>
              </div>
            </a>
            <a href="/access" className="block p-4 rounded-xl border hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--color-hairline)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🛡️</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Request Access</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Request access to resources</p>
                </div>
              </div>
            </a>
            <a href="/anomaly" className="block p-4 rounded-xl border hover:border-blue-500 transition-colors" style={{ borderColor: 'var(--color-hairline)' }}>
              <div className="flex items-center gap-3">
                <span className="text-xl">🔍</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>View Anomalies</p>
                  <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Check security alerts</p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

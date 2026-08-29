'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import { WalletConnect } from '@/components/common/WalletConnect';

const stats = [
  { label: 'Total DIDs', value: '12', change: '+2 this week', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { label: 'Assets Minted', value: '48', change: '+5 today', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { label: 'Access Requests', value: '7', change: '3 pending', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { label: 'Risk Score', value: '23', change: 'Low risk', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

const recentActivity = [
  { type: 'DID Created', detail: 'did:decentraid:0x1234...5678', time: '2 hours ago' },
  { type: 'Asset Minted', detail: 'Driver License NFT', time: '5 hours ago' },
  { type: 'Access Approved', detail: 'Medical Records', time: '1 day ago' },
  { type: 'Policy Updated', detail: 'Document Access Policy', time: '2 days ago' },
];

const quickActions = [
  { title: 'Create New DID', desc: 'Set up a new decentralized identity', href: '/did', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { title: 'Mint Asset', desc: 'Create a new NFT credential', href: '/assets', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { title: 'Request Access', desc: 'Request access to resources', href: '/access', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'View Anomalies', desc: 'Check security alerts', href: '/anomaly', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

export default function DashboardPage() {
  const { connected } = useDecentraID();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-normal text-[var(--color-text-primary)]">Dashboard</h1>
        <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
          Manage your decentralized identity.
        </p>
      </div>

      {/* Wallet Connection */}
      {!connected && (
        <div className="max-w-sm">
          <WalletConnect />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center">
                <svg className="w-[18px] h-[18px] text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={stat.icon} />
                </svg>
              </div>
              <span className="badge badge-info">{stat.change}</span>
            </div>
            <div className="text-2xl font-normal text-[var(--color-text-primary)] tabular-nums">{stat.value}</div>
            <div className="text-[13px] text-[var(--color-text-muted)] mt-0.5">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Recent Activity</h2>
          <div className="divide-y divide-[var(--color-border)]">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{activity.type}</p>
                  <p className="text-[12px] text-[var(--color-text-muted)] truncate">{activity.detail}</p>
                </div>
                <span className="text-[12px] text-[var(--color-text-muted)] shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => (
              <a
                key={action.title}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors -mx-1"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center shrink-0">
                  <svg className="w-[18px] h-[18px] text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={action.icon} />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-[var(--color-text-primary)]">{action.title}</p>
                  <p className="text-[12px] text-[var(--color-text-muted)]">{action.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

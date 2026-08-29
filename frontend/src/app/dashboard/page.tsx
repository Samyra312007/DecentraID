'use client';

import { motion } from 'framer-motion';
import { useDecentraID } from '@/hooks/useDecentraID';
import { WalletConnect } from '@/components/common/WalletConnect';

const stats = [
  { label: 'Total DIDs', value: '12', change: '+2 this week', color: '#4F46E5', bg: '#EEF2FF' },
  { label: 'Assets Minted', value: '48', change: '+5 today', color: '#F59E0B', bg: '#FEF3C7' },
  { label: 'Access Requests', value: '7', change: '3 pending', color: '#10B981', bg: '#D1FAE5' },
  { label: 'Risk Score', value: '23', change: 'Low risk', color: '#3B82F6', bg: '#DBEAFE' },
];

const recentActivity = [
  { type: 'DID Created', detail: 'did:decentraid:0x1234...5678', time: '2 hours ago', color: '#4F46E5' },
  { type: 'Asset Minted', detail: 'Driver License NFT', time: '5 hours ago', color: '#F59E0B' },
  { type: 'Access Approved', detail: 'Medical Records', time: '1 day ago', color: '#10B981' },
  { type: 'Policy Updated', detail: 'Document Access Policy', time: '2 days ago', color: '#64748B' },
];

const quickActions = [
  { title: 'Create New DID', desc: 'Set up a new decentralized identity', href: '/did', color: '#4F46E5' },
  { title: 'Mint Asset', desc: 'Create a new NFT credential', href: '/assets', color: '#F59E0B' },
  { title: 'Request Access', desc: 'Request access to resources', href: '/access', color: '#10B981' },
  { title: 'View Anomalies', desc: 'Check security alerts', href: '/anomaly', color: '#EF4444' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

export default function DashboardPage() {
  const { connected } = useDecentraID();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Dashboard</h1>
        <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Welcome to DecentraID. Manage your decentralized identity.</p>
      </motion.div>

      {/* Wallet */}
      {!connected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <WalletConnect />
        </motion.div>
      )}

      {/* Stats */}
      <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={fadeUp} className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                <div className="w-3 h-3 rounded-full" style={{ background: stat.color }} />
              </div>
              <span className="badge badge-info">{stat.change}</span>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--color-text-primary)' }}>{stat.value}</div>
            <div className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity */}
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>Recent Activity</h2>
          <div className="space-y-2">
            {recentActivity.map((activity, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className="activity-row">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${activity.color}10` }}>
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: activity.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{activity.type}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{activity.detail}</p>
                </div>
                <span className="text-xs shrink-0" style={{ color: 'var(--color-text-muted)' }}>{activity.time}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-5" style={{ color: 'var(--color-text-primary)' }}>Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <motion.a key={action.title} href={action.href} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.08 }}
                className="block p-4 rounded-xl transition-all" style={{ border: '1px solid var(--color-border-light)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${action.color}10` }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: action.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{action.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{action.desc}</p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

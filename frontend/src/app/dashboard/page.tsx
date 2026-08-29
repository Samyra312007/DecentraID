'use client';

import { motion } from 'framer-motion';
import { useDecentraID } from '@/hooks/useDecentraID';
import { WalletConnect } from '@/components/common/WalletConnect';

const stats = [
  { label: 'Total DIDs', value: '12', change: '+2 this week', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z', color: '#818cf8' },
  { label: 'Assets Minted', value: '48', change: '+5 today', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', color: '#a855f7' },
  { label: 'Access Requests', value: '7', change: '3 pending', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', color: '#06b6d4' },
  { label: 'Risk Score', value: '23', change: 'Low risk', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', color: '#10b981' },
];

const recentActivity = [
  { type: 'DID Created', detail: 'did:decentraid:0x1234...5678', time: '2 hours ago', color: '#818cf8' },
  { type: 'Asset Minted', detail: 'Driver License NFT', time: '5 hours ago', color: '#a855f7' },
  { type: 'Access Approved', detail: 'Medical Records', time: '1 day ago', color: '#10b981' },
  { type: 'Policy Updated', detail: 'Document Access Policy', time: '2 days ago', color: '#06b6d4' },
];

const quickActions = [
  { title: 'Create New DID', desc: 'Set up a new decentralized identity', href: '/did', icon: 'M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z' },
  { title: 'Mint Asset', desc: 'Create a new NFT credential', href: '/assets', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { title: 'Request Access', desc: 'Request access to resources', href: '/access', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { title: 'View Anomalies', desc: 'Check security alerts', href: '/anomaly', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function DashboardPage() {
  const { connected } = useDecentraID();

  return (
    <div className="space-y-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 right-0 w-[500px] h-[400px] bg-radial opacity-40" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-radial-purple opacity-30" />
      </div>

      <div className="relative" style={{ zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>
            Welcome to DecentraID. Manage your decentralized identity.
          </p>
        </motion.div>

        {/* Wallet Connection */}
        {!connected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mb-8"
          >
            <WalletConnect />
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8"
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={fadeUp} className="stat-card group">
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: stat.color }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                  </svg>
                </div>
                <span className="badge badge-info">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Recent Activity */}
          <div className="lg:col-span-2 glass p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="activity-row"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${activity.color}15` }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: activity.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{activity.type}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>{activity.detail}</p>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--color-text-muted)' }}>{activity.time}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass p-6">
            <h2 className="text-lg font-semibold text-white mb-5">Quick Actions</h2>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.a
                  key={action.title}
                  href={action.href}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="block p-4 rounded-xl transition-all hover:bg-[var(--color-bg-glass-hover)]"
                  style={{ border: '1px solid var(--color-border)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} style={{ color: '#818cf8' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={action.icon} />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{action.title}</p>
                      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{action.desc}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

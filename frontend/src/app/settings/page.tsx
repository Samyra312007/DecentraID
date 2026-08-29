'use client';

import { motion } from 'framer-motion';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';

export default function SettingsPage() {
  const { connected, chainId } = useDecentraID();

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="mt-1" style={{ color: 'var(--color-text-muted)' }}>Configure your DecentraID preferences</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Wallet */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Wallet Connection</h2>
            <WalletConnect />
          </motion.div>

          {/* Network */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Network Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Network</label>
                <select className="input">
                  <option value="amoy">Polygon Amoy (Testnet)</option>
                  <option value="mainnet">Polygon Mainnet</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">API Endpoint</label>
                <input type="text" defaultValue="http://localhost:8000" className="input" placeholder="API endpoint URL" />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">IPFS Gateway</label>
                <input type="text" defaultValue="https://ipfs.io" className="input" placeholder="IPFS gateway URL" />
              </div>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
            <div className="space-y-3">
              {[
                { label: 'Email notifications', description: 'Receive email alerts for important events' },
                { label: 'Push notifications', description: 'Browser push notifications for real-time alerts' },
                { label: 'Access request alerts', description: 'Get notified when someone requests access' },
                { label: 'Anomaly alerts', description: 'Receive alerts for suspicious activity' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3" style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{item.description}</p>
                  </div>
                  <button className="w-12 h-6 rounded-full p-1 transition-colors" style={{ background: 'var(--color-surface-hover)' }}>
                    <div className="w-4 h-4 rounded-full bg-white/40 shadow-sm transform transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar cards */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass p-6">
            <h2 className="text-lg font-semibold text-white mb-4">About</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span style={{ color: 'var(--color-text-muted)' }}>Version</span><span className="text-white">1.0.0</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--color-text-muted)' }}>Chain ID</span><span className="font-mono text-white">{chainId || 'N/A'}</span></div>
              <div className="flex justify-between"><span style={{ color: 'var(--color-text-muted)' }}>Status</span><span className="badge badge-success">Connected</span></div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Links</h2>
            <div className="space-y-2">
              {[
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Manage DIDs', href: '/did' },
                { label: 'View Assets', href: '/assets' },
                { label: 'Anomaly Dashboard', href: '/anomaly' },
              ].map((link) => (
                <a key={link.href} href={link.href} className="block text-sm py-1 transition-colors" style={{ color: 'var(--color-primary)' }}>
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

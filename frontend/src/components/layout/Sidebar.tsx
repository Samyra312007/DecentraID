'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', color: '#4F46E5' },
  { name: 'DIDs', href: '/did', color: '#F59E0B' },
  { name: 'Assets', href: '/assets', color: '#EF4444' },
  { name: 'Access', href: '/access', color: '#10B981' },
  { name: 'Anomaly', href: '/anomaly', color: '#3B82F6' },
  { name: 'Settings', href: '/settings', color: '#64748B' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="w-64 h-screen fixed left-0 top-0 flex flex-col z-40"
      style={{
        background: '#FFFFFF',
        borderRight: '1px solid var(--color-border)',
      }}
    >
      {/* Logo */}
      <div className="p-6" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
          >
            D
          </div>
          <div>
            <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>DecentraID</span>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Decentralized Identity</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link key={item.name} href={item.href} className="relative block">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: `${item.color}10`, border: `1px solid ${item.color}20` }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <div className="relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: isActive ? item.color : '#CBD5E1' }}
                />
                <span style={{ color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Network */}
      <div className="p-4" style={{ borderTop: '1px solid var(--color-border-light)' }}>
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#F8FAFC' }}>
          <div className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
          <div>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Network</p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Polygon Amoy</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'DIDs', href: '/did', icon: '🔐' },
  { name: 'Assets', href: '/assets', icon: '💎' },
  { name: 'Access', href: '/access', icon: '🛡️' },
  { name: 'Anomaly', href: '/anomaly', icon: '🔍' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r flex flex-col" style={{ borderColor: 'var(--color-hairline)', backgroundColor: 'var(--color-canvas)' }}>
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--color-hairline)' }}>
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: 'var(--color-primary)' }}>
            D
          </div>
          <div>
            <span className="text-lg font-semibold" style={{ color: 'var(--color-ink)' }}>DecentraID</span>
            <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Decentralized Identity</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'text-white' : 'hover:bg-gray-50'
              }`}
              style={isActive ? {
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)'
              } : {
                color: 'var(--color-body)'
              }}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'var(--color-hairline)' }}>
        <div className="px-4 py-2">
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Network</p>
          <p className="text-sm font-medium" style={{ color: 'var(--color-ink)' }}>Polygon Amoy</p>
        </div>
      </div>
    </aside>
  );
}

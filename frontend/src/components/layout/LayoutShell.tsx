'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RequireAuth } from '@/components/auth/RequireAuth';

const PROTECTED_ROUTES = [
  '/dashboard',
  '/did',
  '/assets',
  '/access',
  '/anomaly',
  '/settings',
];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/')
  );
  const isChromeless = [
    '/',
    '/signin',
    '/signup',
    '/privacy',
    '/terms',
    '/docs',
  ].includes(pathname);

  if (isChromeless) {
    return <>{children}</>;
  }

  const content = (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="md:ml-60 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );

  if (isProtected) {
    return <RequireAuth>{content}</RequireAuth>;
  }

  return content;
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDecentraID } from '@/hooks/useDecentraID';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

/**
 * Route guard for authenticated pages. While the persisted session is being
 * restored, shows a loading screen. If no session exists, redirects to
 * /signin preserving the intended destination.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { connected, restoring } = useDecentraID();

  useEffect(() => {
    if (!restoring && !connected) {
      router.replace('/signin');
    }
  }, [restoring, connected, router]);

  if (restoring) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)' }}>
          Restoring your session...
        </p>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)' }}>
          Redirecting to sign in...
        </p>
      </div>
    );
  }

  return <>{children}</>;
}

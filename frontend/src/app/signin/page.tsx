'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { useDecentraID } from '@/hooks/useDecentraID';

export default function SignInPage() {
  const router = useRouter();
  const { connectWallet, connected, error: walletError, loading } = useDecentraID();
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleWalletSignIn = async () => {
    setLocalError(null);
    setSubmitting(true);
    try {
      await connectWallet();
      router.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const error = localError ?? walletError;

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to DecentraID"
      subtitle="Authenticate with your self-sovereign wallet. No passwords, no databases to breach — your keys never leave your device."
      footer={
        <p className="text-sm text-muted-foreground">
          New to DecentraID?{' '}
          <Link href="/signup" className="font-semibold text-primary hover:underline underline-offset-4">
            Create an identity
          </Link>
        </p>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleWalletSignIn();
        }}
        className="flex flex-col gap-6"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">Connected Wallet</span>
          <span className="text-xs text-muted-foreground">
            You will be asked to sign a one-time message to prove wallet ownership.
          </span>
        </label>

        {error ? (
          <div className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2.5 text-sm text-danger" role="alert">
            <span className="material-symbols-outlined text-base leading-5">error</span>
            <span>{error}</span>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting || loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">account_balance_wallet</span>
          {submitting || loading ? 'Waiting for signature…' : 'Sign in with Wallet'}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <span className="material-symbols-outlined text-sm text-primary">lock</span>
          Signature request is read-only and grants no transfer permissions.
        </p>
      </form>
    </AuthShell>
  );
}

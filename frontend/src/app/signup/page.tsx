'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthShell } from '@/components/auth/AuthShell';
import { useDecentraID } from '@/hooks/useDecentraID';

const STRENGTH_STEPS = 4;

function passwordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export default function SignUpPage() {
  const router = useRouter();
  const { connectWallet, error: walletError, loading } = useDecentraID();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const validate = (): string | null => {
    if (!displayName.trim()) return 'Please enter a display name.';
    if (!/^\S+@\S+\.\S+$/.test(email)) return 'Please enter a valid email address.';
    if (strength < 3) return 'Password needs at least 8 characters with upper & lower case letters and a number.';
    if (!acceptedTerms) return 'Please accept the Terms of Service and Privacy Policy.';
    return null;
  };

  const handleWalletSignUp = async () => {
    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    setSubmitting(true);
    try {
      await connectWallet();
      router.push('/dashboard');
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Sign up failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const error = localError ?? walletError;
  const busy = submitting || loading;

  return (
    <AuthShell
      eyebrow="Get started"
      title="Create your identity"
      subtitle="Anchor a self-sovereign DID to your wallet in minutes. Identity, access, and assets — all under your control."
      footer={
        <p className="text-sm text-muted-foreground">
          Already have an identity?{' '}
          <Link href="/signin" className="font-semibold text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      }
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleWalletSignUp();
        }}
        className="flex flex-col gap-5"
      >
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">Display Name</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Ada Lovelace"
            autoComplete="name"
            className="h-11 w-full rounded-md border border-input bg-input/30 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            className="h-11 w-full rounded-md border border-input bg-input/30 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <span className="text-xs text-muted-foreground">Used for recovery links and security alerts only.</span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
            autoComplete="new-password"
            className="h-11 w-full rounded-md border border-input bg-input/30 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <div className="flex items-center gap-1.5" aria-hidden>
            {Array.from({ length: STRENGTH_STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i < strength
                    ? strength <= 2
                      ? 'bg-warning'
                      : strength === 3
                        ? 'bg-primary'
                        : 'bg-success'
                    : 'bg-border'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {password
              ? strength <= 2
                ? 'Weak password'
                : strength === 3
                  ? 'Good password'
                  : 'Strong password'
              : 'Min. 8 characters with upper & lower case and a number.'}
          </span>
        </label>

        <label className="flex cursor-pointer items-start gap-2.5">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 accent-[var(--primary)]"
          />
          <span className="text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.5 }}>
            I agree to the{' '}
            <Link href="/terms" className="text-primary hover:underline underline-offset-2">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary hover:underline underline-offset-2">Privacy Policy</Link>.
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
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded bg-primary-container px-6 py-3 text-sm font-semibold text-on-primary-container transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">account_balance_wallet</span>
          {busy ? 'Waiting for wallet…' : 'Create Identity with Wallet'}
        </button>

        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <span className="material-symbols-outlined text-sm text-primary">lock</span>
          Your keys stay on your device. We never see them.
        </p>
      </form>
    </AuthShell>
  );
}

'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

const HIGHLIGHTS = [
  {
    icon: 'badge',
    title: 'Self-Sovereign Identity',
    description: 'User-owned, W3C standard DID with no single point of failure.',
  },
  {
    icon: 'gavel',
    title: 'Smart Contract Guardrails',
    description: 'RBAC & ABAC policies enforced on-chain via immutable contracts.',
  },
  {
    icon: 'token',
    title: 'NFT-Based Verification',
    description: 'Immutable, tamper-proof proof of ownership for your assets.',
  },
];

/**
 * Shared layout for the sign in / sign up pages.
 * Left: brand story panel. Right: the auth form itself.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile top bar */}
      <div className="flex items-center justify-between px-6 py-4 lg:hidden">
        <BrandMark />
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-64px)] w-full max-w-[1280px] lg:grid-cols-2">
        {/* ── Brand / value-prop panel ── */}
        <section className="relative hidden overflow-hidden px-8 py-16 lg:flex lg:flex-col lg:justify-between">
          <div
            aria-hidden
            className="pointer-events-none absolute right-0 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/10 blur-[120px]"
          />
          <div className="relative z-10">
            <BrandMark />
          </div>

          <div className="relative z-10 max-w-md">
            <h1
              className="text-4xl leading-tight text-foreground"
              style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.2 }}
            >
              Digital Sovereignty, <br />
              <span className="text-gradient">Decentralized Security.</span>
            </h1>
            <p className="mt-6 text-base text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
              Your Identity. Your Assets. Your Control.
            </p>

            <ul className="mt-10 flex flex-col gap-6">
              {HIGHLIGHTS.map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="material-symbols-outlined shrink-0 text-primary">{item.icon}</span>
                  <div>
                    <p className="font-bold text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-border bg-surface-container px-4 py-1">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            <span className="text-xs font-semibold tracking-wide text-muted-foreground">
              Enterprise Grade Security Protocol v1.0 Live
            </span>
          </div>
        </section>

        {/* ── Form panel ── */}
        <section className="flex items-center justify-center px-4 py-12 sm:px-8">
          <div className="glass-card inner-glow w-full max-w-md border-border/60 p-6 sm:p-10">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</div>
            <h2
              className="text-2xl text-foreground md:text-[32px]"
              style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.3 }}
            >
              {title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
              {subtitle}
            </p>

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-8 border-t border-border pt-6 text-center">{footer}</div> : null}
          </div>
        </section>
      </div>
    </div>
  );
}

export function BrandMark() {
  return (
    <Link href="/" className="flex items-center gap-2 text-lg font-bold text-foreground">
      <span className="material-symbols-outlined text-primary">hub</span>
      DecentraID
    </Link>
  );
}

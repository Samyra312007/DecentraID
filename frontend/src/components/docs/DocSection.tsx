'use client';

import type { ReactNode } from 'react';

export interface DocSectionProps {
  id: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * Shared section block for the Documentation page. Matches the landing
 * design system: glass card, inner glow, Literata heading, primary accent.
 */
export function DocSection({ id, title, description, children }: DocSectionProps) {
  return (
    <section id={id} className="glass-card inner-glow scroll-mt-28">
      <h2
        className="mb-4 text-xl text-foreground md:text-2xl"
        style={{ fontFamily: 'var(--font-literata)', fontWeight: 500, lineHeight: 1.4 }}
      >
        {title}
      </h2>
      {description ? (
        <p className="mb-4 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.7 }}>
          {description}
        </p>
      ) : null}
      {children ? <div className="flex flex-col gap-4">{children}</div> : null}
    </section>
  );
}

export function DocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:underline underline-offset-4"
    >
      <span className="material-symbols-outlined text-base">arrow_outward</span>
      {children}
    </a>
  );
}

export function DocCode({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-surface-container-lowest p-4 text-xs leading-relaxed text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
      <code>{children}</code>
    </pre>
  );
}

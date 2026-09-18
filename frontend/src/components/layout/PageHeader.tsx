'use client';

import type { ReactNode } from 'react';

/**
 * Consistent page header used across the authenticated app,
 * matching the landing page type scale and eyebrow pattern.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        ) : null}
        <h1
          className="text-2xl text-foreground md:text-[32px]"
          style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.3 }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-3">{actions}</div> : null}
    </div>
  );
}

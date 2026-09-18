'use client';

import Link from 'next/link';
import { BrandMark } from '@/components/auth/AuthShell';

export interface LegalSection {
  heading: string;
  body: string[];
  list?: string[];
}

export interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

/**
 * Shared layout for the Privacy Policy and Terms of Service pages.
 * Follows the landing page design system: dark surfaces, glass cards,
 * Literata headings, and primary accents.
 */
export function LegalPage({ eyebrow, title, updated, intro, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 md:px-16">
          <BrandMark />
          <Link
            href="/"
            className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            Back to Home
          </Link>
        </div>
      </header>

      <main className="relative overflow-hidden">
        {/* Ambient glow, same treatment as the hero */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-16 md:px-16 md:py-24">
          {/* Heading block */}
          <div className="mb-12 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-container px-4 py-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">{eyebrow}</span>
            </div>
            <h1
              className="text-3xl text-foreground md:text-[48px]"
              style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.2 }}
            >
              {title}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">Last updated: {updated}</p>
            <p
              className="mt-6 text-lg text-muted-foreground"
              style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}
            >
              {intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
            {/* Table of contents */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="glass-card">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">
                  On this page
                </p>
                <nav className="flex flex-col gap-2">
                  {sections.map((section, i) => (
                    <a
                      key={section.heading}
                      href={`#section-${i + 1}`}
                      className="rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {section.heading}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Sections */}
            <div className="flex flex-col gap-6">
              {sections.map((section, i) => (
                <section
                  key={section.heading}
                  id={`section-${i + 1}`}
                  className="glass-card inner-glow scroll-mt-28"
                >
                  <h2
                    className="mb-4 text-xl text-foreground md:text-2xl"
                    style={{ fontFamily: 'var(--font-literata)', fontWeight: 500, lineHeight: 1.4 }}
                  >
                    <span className="mr-3 text-primary">{String(i + 1).padStart(2, '0')}</span>
                    {section.heading}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {section.body.map((para, j) => (
                      <p
                        key={j}
                        className="text-sm text-muted-foreground"
                        style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.7 }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                  {section.list ? (
                    <ul className="mt-4 flex flex-col gap-3">
                      {section.list.map((item, j) => (
                        <li key={j} className="flex gap-3">
                          <span className="material-symbols-outlined shrink-0 text-base text-primary">
                            check_circle
                          </span>
                          <span
                            className="text-sm text-muted-foreground"
                            style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.7 }}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ))}

              {/* Bottom nav */}
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-surface-container-low px-6 py-5 sm:flex-row sm:items-center">
                <p className="text-sm text-muted-foreground">
                  {title === 'Privacy Policy' ? (
                    <>
                      Continue reading the{' '}
                      <Link href="/terms" className="font-semibold text-primary hover:underline underline-offset-4">
                        Terms of Service
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      Continue reading the{' '}
                      <Link href="/privacy" className="font-semibold text-primary hover:underline underline-offset-4">
                        Privacy Policy
                      </Link>
                      .
                    </>
                  )}
                </p>
                <Link
                  href="/"
                  className="bg-primary-container text-on-primary-container text-sm font-semibold px-6 py-2 rounded hover:opacity-90 transition-opacity"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-container-lowest">
        <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-3 px-4 py-8 text-center md:flex-row md:px-16 md:text-left">
          <p className="text-sm text-slate-400">
            &copy; 2026 DecentraID. Securing the decentralized future.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-slate-400 transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-400 transition-colors hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

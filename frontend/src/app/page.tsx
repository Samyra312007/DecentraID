'use client';

import Link from 'next/link';

const features = [
  {
    title: 'Self-Sovereign Identity',
    description: 'Own your digital identity with cryptographic key pairs. No central authority controls your data.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    title: 'Smart Contract Access',
    description: 'RBAC and ABAC enforced on-chain via Solidity smart contracts. Tamper-proof access policies.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'NFT Asset Management',
    description: 'Digital assets as verifiable ERC-721 NFTs. Provable ownership, transferable credentials.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
  {
    title: 'AI Anomaly Detection',
    description: 'ML-powered behavioral profiling detects unusual access patterns in real time.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    title: 'Polygon Layer 2',
    description: '65,000 TPS with sub-1-rupee gas fees. Ethereum-grade security at a fraction of the cost.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'W3C DID Standard',
    description: 'Interoperable with global decentralized identity standards. Vendor-agnostic by design.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

const stats = [
  { value: '74%', label: 'Breaches from human element' },
  { value: '$4.88M', label: 'Avg cost per breach' },
  { value: '194', label: 'Days to detect a breach' },
  { value: '65K', label: 'TPS on Polygon L2' },
];

const workflow = [
  { step: '01', title: 'Create DID', desc: 'Generate cryptographic keys and register your decentralized identity on-chain.' },
  { step: '02', title: 'Onboard Org', desc: 'Organization deploys smart contracts defining roles and access policies.' },
  { step: '03', title: 'Mint Assets', desc: 'Documents, licenses, and certificates become verifiable NFT credentials.' },
  { step: '04', title: 'Request Access', desc: 'Smart contract verifies DID and checks policies in milliseconds.' },
  { step: '05', title: 'Monitor & Audit', desc: 'AI detects anomalies. Immutable audit trail on blockchain.' },
];

const comparisons = [
  ['Identity Storage', 'Central server', 'Blockchain (decentralized)'],
  ['Access Control', 'Database rules', 'Smart contracts (on-chain)'],
  ['Asset Ownership', 'Spreadsheets', 'NFTs (verifiable)'],
  ['Cross-org Trust', 'Manual verification', 'Cryptographic proof'],
  ['Anomaly Detection', 'None or rule-based', 'AI/ML powered'],
  ['Tamper Evidence', 'Logs (alterable)', 'Blockchain (immutable)'],
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-deep)]">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg-deep)]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[15px] font-semibold text-[var(--color-text-primary)]">DecentraID</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Features</a>
            <a href="#how-it-works" className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">How It Works</a>
            <a href="#comparison" className="text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Compare</a>
            <Link href="/dashboard" className="btn-primary h-9 text-[13px] px-5">Launch App</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-[var(--color-text-primary)] mb-6">
            Your Identity.
            <br />
            Your Assets.
            <br />
            Your Control.
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            A blockchain-based platform where users own their identity, organizations
            control access through smart contracts, and digital assets are verifiable NFTs
            — all without a central authority.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/dashboard" className="btn-primary h-12 text-[15px] px-8">
              Get Started
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <a href="#features" className="btn-secondary h-12 text-[15px] px-8">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section id="stats" className="py-16 px-6 border-y border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-normal text-[var(--color-text-primary)] mb-1 tabular-nums">{stat.value}</div>
              <div className="text-[13px] text-[var(--color-text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal text-[var(--color-text-primary)] mb-4">Why DecentraID?</h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              The first platform to combine decentralized identity, smart contract access control,
              and NFT-based asset management in one integrated system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div key={feature.title} className="card group">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-2">{feature.title}</h3>
                <p className="text-[13px] leading-relaxed text-[var(--color-text-secondary)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-24 px-6 bg-[var(--color-bg-base)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-normal text-[var(--color-text-primary)] mb-4">How It Works</h2>
            <p className="text-[var(--color-text-secondary)]">
              From identity creation to AI-powered monitoring, the complete end-to-end flow.
            </p>
          </div>

          <div className="space-y-4">
            {workflow.map((item) => (
              <div key={item.step} className="card flex items-start gap-5">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[13px] font-mono font-medium text-[var(--color-primary)]">
                  {item.step}
                </div>
                <div className="pt-1">
                  <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-1">{item.title}</h3>
                  <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison ── */}
      <section id="comparison" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-normal text-[var(--color-text-primary)]">Traditional IAM vs DecentraID</h2>
          </div>

          <div className="card overflow-hidden p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left text-[13px] font-semibold text-[var(--color-text-primary)] px-6 py-4">Feature</th>
                  <th className="text-left text-[13px] font-semibold text-[var(--color-text-muted)] px-6 py-4">Traditional IAM</th>
                  <th className="text-left text-[13px] font-semibold text-[var(--color-primary)] px-6 py-4">DecentraID</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map(([feature, trad, decentra]) => (
                  <tr key={feature} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="text-[13px] font-medium text-[var(--color-text-primary)] px-6 py-3.5">{feature}</td>
                    <td className="text-[13px] text-[var(--color-text-muted)] px-6 py-3.5">{trad}</td>
                    <td className="text-[13px] font-medium text-[var(--color-primary)] px-6 py-3.5">{decentra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-[var(--color-bg-base)]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-normal text-[var(--color-text-primary)] mb-4">
            Ready to take control?
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-8 max-w-lg mx-auto">
            Start building your decentralized identity platform today.
            Open source, zero licensing fees, production-ready.
          </p>
          <Link href="/dashboard" className="btn-primary h-12 text-[15px] px-8">
            Launch DecentraID
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-[var(--color-primary)] flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-[13px] font-semibold text-[var(--color-text-primary)]">DecentraID</span>
          </div>
          <p className="text-[12px] text-[var(--color-text-muted)]">
            Built for SIH 2026 — Problem Statement SIH26125 — Bharat Electronics Limited
          </p>
          <a
            href="https://github.com/Samyra312007/DecentraID"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import Link from 'next/link';

export default function LandingPage() {
  const { connected } = useDecentraID();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ── Top Nav ── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex justify-between items-center w-full max-w-[1280px] mx-auto px-4 md:px-16 h-20">
          <a className="text-lg font-bold text-foreground flex items-center gap-2" href="#">
            <span className="material-symbols-outlined text-primary">hub</span>
            DecentraID
          </a>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md hover:bg-muted" href="#products">Products</a>
            <a className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors py-2 px-4 rounded-md hover:bg-muted" href="#solutions">Solutions</a>
            <a className="text-sm font-semibold text-primary font-bold border-b-2 border-primary pb-1" href="#security">Security</a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a className="text-sm font-semibold text-foreground hover:text-primary transition-colors" href="#">Sign In</a>
            <Link href={connected ? '/dashboard' : '#'} className="bg-primary-container text-on-primary-container text-sm font-semibold px-6 py-2 rounded hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
          <button className="md:hidden text-foreground">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </nav>

      <main>
        {/* ── Hero Section ── */}
        <section className="relative pt-32 pb-24 px-4 md:px-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background pointer-events-none" />
          <div className="max-w-[1280px] mx-auto relative z-10 text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-surface-container border border-border mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-muted-foreground tracking-wide">Enterprise Grade Security Protocol v1.0 Live</span>
            </div>
            <h1 className="text-4xl md:text-[64px] leading-tight mb-6 max-w-4xl" style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.2 }}>
              Digital Sovereignty, <br />
              <span className="text-gradient">Decentralized Security.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
              Blockchain-Based Secure Platform for Identity, Access Control &amp; Digital Asset Management. Your Identity. Your Assets. Your Control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={connected ? '/dashboard' : '#'} className="bg-primary-container text-on-primary-container text-sm font-semibold px-8 py-3 rounded hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Get Started
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
              <a href="#products" className="border border-border text-foreground text-sm font-semibold px-8 py-3 rounded hover:bg-muted transition-colors flex items-center justify-center gap-2">
                View Technical Specs
                <span className="material-symbols-outlined text-sm">code</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Value Prop Grid ── */}
        <section id="security" className="py-24 px-4 md:px-16 bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-[32px] mb-4" style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.3 }}>The Identity Crisis</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                Traditional IAM systems create single points of failure. DecentraID reclaims security through decentralization.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Centralized Vulnerabilities */}
              <div className="glass-card border border-danger/20 bg-danger/5">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-danger">warning</span>
                  <h3 className="text-xl" style={{ fontFamily: 'var(--font-literata)', fontWeight: 500, lineHeight: 1.4 }}>Centralized Vulnerabilities</h3>
                </div>
                <ul className="flex flex-col gap-6">
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-danger shrink-0">close</span>
                    <div>
                      <p className="font-bold text-foreground">Single Point of Failure</p>
                      <p className="text-muted-foreground text-sm">One server compromise puts all identities at risk.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-danger shrink-0">close</span>
                    <div>
                      <p className="font-bold text-foreground">Password Databases</p>
                      <p className="text-muted-foreground text-sm">Prime targets for coordinated database breaches.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-danger shrink-0">close</span>
                    <div>
                      <p className="font-bold text-foreground">No Provable Ownership</p>
                      <p className="text-muted-foreground text-sm">Digital assets tracked in untrustworthy silos.</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Right: Decentralized Sovereignty */}
              <div className="glass-card border border-primary/30 bg-primary/5 inner-glow">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">verified_user</span>
                  <h3 className="text-xl" style={{ fontFamily: 'var(--font-literata)', fontWeight: 500, lineHeight: 1.4 }}>Decentralized Sovereignty</h3>
                </div>
                <ul className="flex flex-col gap-6">
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                    <div>
                      <p className="font-bold text-foreground">Self-Sovereign Identity</p>
                      <p className="text-muted-foreground text-sm">Users own their keys, eliminating central targets.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                    <div>
                      <p className="font-bold text-foreground">Smart Contract Guardrails</p>
                      <p className="text-muted-foreground text-sm">RBAC &amp; ABAC policies enforced on-chain.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="material-symbols-outlined text-primary shrink-0">check_circle</span>
                    <div>
                      <p className="font-bold text-foreground">NFT-Based Verification</p>
                      <p className="text-muted-foreground text-sm">Immutable, tamper-proof proof of ownership.</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Product Showcase ── */}
        <section id="products" className="py-32 px-4 md:px-16 relative bg-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-[1280px] mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-[32px] mb-4" style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.3 }}>Unified Security Ecosystem</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                Identity, Access, and Assets secured by blockchain and monitored by AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card inner-glow hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-border flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">badge</span>
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-literata)', fontWeight: 500, lineHeight: 1.4 }}>Self-Sovereign Identity (DID)</h3>
                <p className="text-base text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                  User-owned, W3C standard identity with no single point of failure. Take full control of your digital footprint.
                </p>
              </div>

              <div className="glass-card inner-glow hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-border flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-literata)', fontWeight: 500, lineHeight: 1.4 }}>Smart Contract Access Control</h3>
                <p className="text-base text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                  RBAC and ABAC policies enforced on-chain via immutable Solidity contracts for transparent, automated governance.
                </p>
              </div>

              <div className="glass-card inner-glow hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-lg bg-surface-container border border-border flex items-center justify-center mb-6 group-hover:bg-primary-container/10 transition-colors">
                  <span className="material-symbols-outlined text-primary">token</span>
                </div>
                <h3 className="text-xl mb-3" style={{ fontFamily: 'var(--font-literata)', fontWeight: 500, lineHeight: 1.4 }}>NFT-Based Digital Assets</h3>
                <p className="text-base text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                  Verifiable, tamper-proof ownership for licenses, certificates, and high-value documents using non-fungible technology.
                </p>
              </div>
            </div>

            <div className="mt-16 flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <span className="material-symbols-outlined text-primary animate-pulse">monitoring</span>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Enhanced by AI-powered anomaly detection for proactive threat mitigation.
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA Section ── */}
        <section className="py-24 px-4 md:px-16 border-t border-border bg-surface-container-lowest">
          <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center">
            <div className="flex flex-col items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>hub</span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">Unified Infrastructure</span>
            </div>
            <h2 className="text-2xl md:text-[32px] mb-6" style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.3 }}>Ready to Reclaim Your Digital Sovereignty?</h2>
            <p className="text-base text-muted-foreground max-w-xl mb-10" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
              Move beyond the single point of failure. Join the organizations already using DecentraID to automate access via smart contracts, tokenize digital assets, and protect their infrastructure with AI-driven anomaly detection.
            </p>
            <Link href={connected ? '/dashboard' : '#'} className="bg-primary-container text-on-primary-container text-sm font-semibold px-10 py-4 rounded hover:opacity-90 transition-opacity text-lg">
              Get Started for Free
            </Link>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-surface-container-lowest border-t border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-20 max-w-[1280px] mx-auto px-4 md:px-16">
          <div className="col-span-1">
            <a className="text-lg font-bold text-foreground flex items-center gap-2 mb-4" href="#">
              <span className="material-symbols-outlined text-primary">hub</span>
              DecentraID
            </a>
            <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
              Securing the decentralized future. Institutional grade infrastructure for web3 identities and assets.
            </p>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="flex flex-col gap-3">
              <li><a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Identity Management</a></li>
              <li><a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Access Control</a></li>
              <li><a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Asset Custody</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-foreground mb-4">Resources</h4>
            <ul className="flex flex-col gap-3">
              <li><a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Documentation</a></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <ul className="flex flex-col gap-3">
              <li><a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="text-sm text-slate-400 hover:text-primary transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 px-4 md:px-16 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2026 DecentraID. Securing the decentralized future.
          </p>
        </div>
      </footer>
    </div>
  );
}

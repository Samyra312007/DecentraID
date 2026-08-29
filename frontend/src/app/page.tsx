'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import { ParticleField } from '@/components/landing/ParticleField';

const features = [
  {
    icon: '🔐',
    title: 'Self-Sovereign Identity',
    description: 'Own your digital identity with cryptographic key pairs. No central authority controls your data.',
    gradient: 'from-indigo-500 to-blue-500',
  },
  {
    icon: '🛡️',
    title: 'Smart Contract Access',
    description: 'RBAC and ABAC enforced on-chain via Solidity smart contracts. Tamper-proof access policies.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: '💎',
    title: 'NFT Asset Management',
    description: 'Digital assets as verifiable ERC-721 NFTs. Provable ownership, transferable credentials.',
    gradient: 'from-cyan-500 to-teal-500',
  },
  {
    icon: '🤖',
    title: 'AI Anomaly Detection',
    description: 'ML-powered behavioral profiling detects unusual access patterns in real time.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: '⛓️',
    title: 'Polygon Layer 2',
    description: '65,000 TPS with sub-1-rupee gas fees. Ethereum-grade security at fraction of cost.',
    gradient: 'from-violet-500 to-purple-500',
  },
  {
    icon: '🌐',
    title: 'W3C DID Standard',
    description: 'Interoperable with global decentralized identity standards. Vendor-agnostic by design.',
    gradient: 'from-emerald-500 to-green-500',
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

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-deep)' }}>
      <ParticleField />

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-radial opacity-60" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-radial-purple opacity-40" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-radial-cyan opacity-30" />
      </div>

      {/* ========== NAVIGATION ========== */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                D
              </div>
              <span className="text-lg font-semibold text-white">DecentraID</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">How It Works</a>
              <a href="#stats" className="text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors">Impact</a>
              <Link href="/dashboard" className="btn-primary text-sm" style={{ height: 40, padding: '8px 20px' }}>
                <span>Launch App</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative z-10 min-h-screen flex items-center justify-center px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-indigo-300">Built for SIH 2026 -- Bharat Electronics Limited</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Your Identity.</span>
            <br />
            <span className="gradient-text">Your Assets.</span>
            <br />
            <span className="text-white">Your Control.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            A blockchain-based platform where users own their identity, organizations
            control access through smart contracts, and digital assets are verifiable NFTs
            -- all without a central authority.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/dashboard" className="btn-primary text-base" style={{ height: 56, padding: '12px 32px' }}>
              <span>Get Started</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <a href="#features" className="btn-secondary text-base" style={{ height: 56, padding: '12px 32px' }}>
              Learn More
            </a>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
            >
              <div className="w-1 h-2 rounded-full bg-white/40" />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ========== STATS TICKER ========== */}
      <section id="stats" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="glass text-center py-8 px-4"
              >
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why <span className="gradient-text">DecentraID</span>?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              The first platform to combine decentralized identity, smart contract access control,
              and NFT-based asset management in one integrated system.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                className="glass group p-8"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                  {feature.description}
                </p>
                <div className="mt-6 h-px w-full opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)' }} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              From identity creation to AI-powered monitoring, here is the complete end-to-end flow.
            </p>
          </motion.div>

          <div className="space-y-6">
            {workflow.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass flex items-center gap-6 p-6 md:p-8"
              >
                <div className="shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  {item.step}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMPARISON TABLE ========== */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Traditional IAM vs <span className="gradient-text">DecentraID</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left text-sm font-semibold text-white px-6 py-4">Feature</th>
                    <th className="text-left text-sm font-semibold px-6 py-4" style={{ color: 'var(--color-text-muted)' }}>Traditional IAM</th>
                    <th className="text-left text-sm font-semibold gradient-text px-6 py-4">DecentraID</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Identity Storage', 'Central server', 'Blockchain (decentralized)'],
                    ['Access Control', 'Database rules', 'Smart contracts (on-chain)'],
                    ['Asset Ownership', 'Spreadsheets', 'NFTs (verifiable)'],
                    ['Cross-org Trust', 'Manual verification', 'Cryptographic proof'],
                    ['Anomaly Detection', 'None or rule-based', 'AI/ML powered'],
                    ['Tamper Evidence', 'Logs (alterable)', 'Blockchain (immutable)'],
                  ].map(([feature, trad, decentra]) => (
                    <tr key={feature} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td className="text-sm font-medium text-white px-6 py-4">{feature}</td>
                      <td className="text-sm px-6 py-4" style={{ color: 'var(--color-text-muted)' }}>{trad}</td>
                      <td className="text-sm font-medium px-6 py-4" style={{ color: '#818cf8' }}>{decentra}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="relative z-10 py-24 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass p-12 md:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))' }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to take control?
          </h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Start building your decentralized identity platform today.
            Open source, zero licensing fees, production-ready.
          </p>
          <Link href="/dashboard" className="btn-primary text-base" style={{ height: 56, padding: '12px 32px' }}>
            <span>Launch DecentraID</span>
          </Link>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="relative z-10 py-12 px-6" style={{ borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              D
            </div>
            <span className="font-semibold text-white">DecentraID</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Built for SIH 2026 -- Problem Statement SIH26125 -- Bharat Electronics Limited
          </p>
          <div className="flex items-center gap-4">
            <a href="https://github.com/Samyra312007/DecentraID" target="_blank" rel="noopener noreferrer"
              className="text-sm hover:text-white transition-colors" style={{ color: 'var(--color-text-muted)' }}>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

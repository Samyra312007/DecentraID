'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  { icon: '🔐', title: 'Self-Sovereign Identity', description: 'Own your digital identity with cryptographic key pairs. No central authority controls your data.', color: '#4F46E5' },
  { icon: '🛡️', title: 'Smart Contract Access', description: 'RBAC and ABAC enforced on-chain via Solidity smart contracts. Tamper-proof access policies.', color: '#10B981' },
  { icon: '💎', title: 'NFT Asset Management', description: 'Digital assets as verifiable ERC-721 NFTs. Provable ownership, transferable credentials.', color: '#F59E0B' },
  { icon: '🤖', title: 'AI Anomaly Detection', description: 'ML-powered behavioral profiling detects unusual access patterns in real time.', color: '#EF4444' },
  { icon: '⛓️', title: 'Polygon Layer 2', description: '65,000 TPS with sub-1-rupee gas fees. Ethereum-grade security at fraction of cost.', color: '#8B5CF6' },
  { icon: '🌐', title: 'W3C DID Standard', description: 'Interoperable with global decentralized identity standards. Vendor-agnostic by design.', color: '#06B6D4' },
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: '#F8FAFC' }}>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="glass-strong rounded-2xl px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>D</div>
              <span className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>DecentraID</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Features</a>
              <a href="#how-it-works" className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>How It Works</a>
              <a href="#stats" className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Impact</a>
              <Link href="/dashboard" className="btn-primary text-sm" style={{ height: 40, padding: '8px 20px' }}><span>Launch App</span></Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20 overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FECACA 25%, #E0E7FF 50%, #CCFBF1 75%, #FEF3C7 100%)', opacity: 0.4 }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 60%, #F8FAFC 100%)' }} />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: 'white', border: '1px solid var(--color-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <span className="w-2 h-2 rounded-full" style={{ background: '#10B981' }} />
            <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Built for SIH 2026 -- Bharat Electronics Limited</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6" style={{ color: 'var(--color-text-primary)' }}>
            Your Identity.<br />
            <span className="gradient-text">Your Assets.</span><br />
            Your Control.
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
            A blockchain-based platform where users own their identity, organizations control access through smart contracts, and digital assets are verifiable NFTs -- all without a central authority.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary text-base" style={{ height: 56, padding: '12px 32px' }}>
              <span>Get Started</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'relative', zIndex: 1 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
            <a href="#features" className="btn-secondary text-base" style={{ height: 56, padding: '12px 32px' }}>Learn More</a>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="card text-center py-8 px-4">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Why <span className="gradient-text">DecentraID</span>?</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>The first platform to combine decentralized identity, smart contract access control, and NFT-based asset management.</p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={fadeUp} className="card p-8 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.color}10` }}>
                  <span className="text-2xl">{f.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--color-text-primary)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>{f.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>How It <span className="gradient-text">Works</span></h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>From identity creation to AI-powered monitoring, here is the complete end-to-end flow.</p>
          </motion.div>
          <div className="space-y-6">
            {workflow.map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card flex items-center gap-6 p-6 md:p-8">
                <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>{item.step}</div>
                <div>
                  <h3 className="text-lg font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Traditional IAM vs <span className="gradient-text">DecentraID</span></h2>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <th className="text-left text-sm font-semibold px-6 py-4" style={{ color: 'var(--color-text-primary)' }}>Feature</th>
                    <th className="text-left text-sm font-semibold px-6 py-4" style={{ color: 'var(--color-text-muted)' }}>Traditional IAM</th>
                    <th className="text-left text-sm font-semibold px-6 py-4 gradient-text">DecentraID</th>
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
                  ].map(([f, t, d]) => (
                    <tr key={f} style={{ borderBottom: '1px solid var(--color-border-light)' }}>
                      <td className="text-sm font-medium px-6 py-4" style={{ color: 'var(--color-text-primary)' }}>{f}</td>
                      <td className="text-sm px-6 py-4" style={{ color: 'var(--color-text-muted)' }}>{t}</td>
                      <td className="text-sm font-medium px-6 py-4" style={{ color: '#4F46E5' }}>{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-4xl mx-auto card p-12 md:p-16 text-center"
          style={{ background: 'linear-gradient(135deg, #EEF2FF, #F0F9FF)' }}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text-primary)' }}>Ready to take control?</h2>
          <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>Start building your decentralized identity platform today. Open source, zero licensing fees.</p>
          <Link href="/dashboard" className="btn-primary text-base" style={{ height: 56, padding: '12px 32px' }}><span>Launch DecentraID</span></Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid var(--color-border)', background: '#FFFFFF' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}>D</div>
            <span className="font-semibold" style={{ color: 'var(--color-text-primary)' }}>DecentraID</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Built for SIH 2026 -- Problem Statement SIH26125 -- Bharat Electronics Limited</p>
          <a href="https://github.com/Samyra312007/DecentraID" target="_blank" rel="noopener noreferrer"
            className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>GitHub</a>
        </div>
      </footer>
    </div>
  );
}

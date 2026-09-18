'use client';

import Link from 'next/link';
import { BrandMark } from '@/components/auth/AuthShell';
import { DocSection, DocLink, DocCode } from '@/components/docs/DocSection';

const QUICKSTART_STEPS = [
  {
    title: 'Install prerequisites',
    body: 'Node.js 18+, Python 3.10+, and optionally Docker for one-command orchestration.',
  },
  {
    title: 'Clone and set up',
    body: 'Run the interactive setup script to install dependencies and create your .env file.',
  },
  {
    title: 'Start services',
    body: 'Run the full stack via Docker Compose, or start each service manually in its own terminal.',
  },
  {
    title: 'Open the app',
    body: 'Frontend on port 3000, backend API on 8000, anomaly detection on 8001, Swagger UI at /docs.',
  },
];

const FEATURES = [
  {
    icon: 'badge',
    title: 'Self-Sovereign Identity',
    body: 'W3C-compliant DIDs anchored on Polygon. Users hold their own keys; no central identity store exists to breach.',
  },
  {
    icon: 'gavel',
    title: 'Smart Contract Access Control',
    body: 'RBAC and ABAC policies enforced by immutable Solidity contracts with full on-chain auditability.',
  },
  {
    icon: 'token',
    title: 'NFT-Based Digital Assets',
    body: 'Licenses, certificates, and credentials minted as ERC-721 tokens for verifiable, transferable ownership.',
  },
  {
    icon: 'monitoring',
    title: 'AI Anomaly Detection',
    body: 'Isolation Forest models score every access event in real time and alert on suspicious behavior.',
  },
];

const CORE_ENDPOINTS = [
  { method: 'POST', path: '/api/v1/auth/login', description: 'Wallet-signature login, returns a JWT' },
  { method: 'GET', path: '/api/v1/did/{did}', description: 'Resolve a DID to its on-chain document' },
  { method: 'POST', path: '/api/v1/did/create', description: 'Anchor a new DID for the caller' },
  { method: 'GET', path: '/api/v1/assets', description: 'List assets owned by the caller' },
  { method: 'POST', path: '/api/v1/assets/mint', description: 'Mint a new asset NFT' },
  { method: 'POST', path: '/api/v1/access/request', description: 'Request access to a resource' },
  { method: 'POST', path: '/api/v1/access/check', description: 'Evaluate a policy for a subject, resource, and action' },
  { method: 'POST', path: '/detect', description: 'Score an access event for anomalous behavior (anomaly service)' },
];

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-primary/15 text-primary',
  POST: 'bg-warning/15 text-warning',
  PUT: 'bg-chart-3/15 text-chart-3',
  DELETE: 'bg-danger/15 text-danger',
};

const SIDEBAR_SECTIONS = [
  { id: 'quickstart', label: 'Quickstart' },
  { id: 'features', label: 'Platform Features' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'api', label: 'API Reference' },
  { id: 'websocket', label: 'Real-Time Events' },
  { id: 'sdk', label: 'SDKs and Clients' },
  { id: 'contracts', label: 'Smart Contracts' },
  { id: 'deployment', label: 'Deployment' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="mx-auto flex h-20 w-full max-w-[1280px] items-center justify-between px-4 md:px-16">
          <BrandMark />
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to Home
            </Link>
            <Link
              href="/signup"
              className="bg-primary-container text-on-primary-container text-sm font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]"
        />

        <div className="relative z-10 mx-auto max-w-[1280px] px-4 py-16 md:px-16 md:py-24">
          {/* Heading block */}
          <div className="mb-12 max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-container px-4 py-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-semibold tracking-wide text-muted-foreground">
                Platform Documentation
              </span>
            </div>
            <h1
              className="text-3xl text-foreground md:text-[48px]"
              style={{ fontFamily: 'var(--font-literata)', fontWeight: 600, lineHeight: 1.2 }}
            >
              DecentraID Docs
            </h1>
            <p
              className="mt-6 text-lg text-muted-foreground"
              style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}
            >
              Everything you need to integrate self-sovereign identity, on-chain access control, tokenized assets, and AI-driven anomaly detection.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[260px_1fr]">
            {/* Sidebar */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="glass-card">
                <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-primary">Contents</p>
                <nav className="flex flex-col gap-2">
                  {SIDEBAR_SECTIONS.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="rounded px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
              <div className="glass-card mt-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">API Status</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  All systems operational
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <DocLink href="http://localhost:8000/docs">API Explorer (Swagger UI)</DocLink>
                </div>
              </div>
            </aside>

            {/* Sections */}
            <div className="flex flex-col gap-6">
              {/* Quickstart */}
              <DocSection
                id="quickstart"
                title="Quickstart"
                description="Four steps from clone to a running stack."
              >
                <div className="flex flex-col gap-4">
                  {QUICKSTART_STEPS.map((step, i) => (
                    <div key={step.title} className="flex gap-4">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{step.title}</p>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                          {step.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <DocCode>{`# One-command full stack (Docker)
docker compose up -d

# Or run each service manually
cd backend && python3 -m uvicorn app.main:app --reload --port 8000
cd anomaly-detection && python3 -m uvicorn app.main:app --reload --port 8001
cd frontend && npm run dev`}</DocCode>
              </DocSection>

              {/* Features */}
              <DocSection
                id="features"
                title="Platform Features"
                description="The four pillars of the DecentraID platform."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <div key={f.title} className="rounded-lg border border-border bg-surface-container-low p-4">
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-surface-container">
                        <span className="material-symbols-outlined text-primary">{f.icon}</span>
                      </div>
                      <p className="mb-1 text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                        {f.body}
                      </p>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* Architecture */}
              <DocSection
                id="architecture"
                title="Architecture"
                description="How the pieces fit together, from browser to blockchain."
              >
                <DocCode>{`Browser (Next.js, port 3000)
   │
   ▼
Nginx reverse proxy (port 80)
   ├── /           → frontend:3000
   ├── /api/       → backend:8000     (rate limited)
   ├── /ws/        → backend:8000     (WebSocket)
   ├── /anomaly/   → anomaly:8001
   └── /docs       → backend:8000     (Swagger UI)
   │
   ├── PostgreSQL (5432)  identity + audit data
   ├── Redis (6379)       cache + session state
   └── Polygon Amoy       smart contracts`}</DocCode>
                <div className="flex flex-col gap-2">
                  <DocLink href="https://github.com/Samyra312007/DecentraID/blob/main/docs/architecture.md">
                    Full architecture guide
                  </DocLink>
                  <DocLink href="https://github.com/Samyra312007/DecentraID/blob/main/docs/security-checklist.md">
                    Security checklist
                  </DocLink>
                </div>
              </DocSection>

              {/* API Reference */}
              <DocSection
                id="api"
                title="API Reference"
                description="Core REST endpoints. All authenticated routes expect a JWT bearer token."
              >
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface-container-low text-left">
                        <th className="px-4 py-3 font-semibold text-foreground">Method</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Endpoint</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CORE_ENDPOINTS.map((ep) => (
                        <tr key={ep.path + ep.method} className="border-b border-border last:border-0">
                          <td className="px-4 py-3">
                            <span className={`rounded px-2 py-0.5 font-mono text-xs font-semibold ${METHOD_COLORS[ep.method] ?? 'bg-muted text-foreground'}`}>
                              {ep.method}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-foreground">{ep.path}</td>
                          <td className="px-4 py-3 text-muted-foreground">{ep.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col gap-2">
                  <DocLink href="http://localhost:8000/docs">Interactive Swagger UI</DocLink>
                  <DocLink href="https://github.com/Samyra312007/DecentraID/blob/main/docs/api-reference.md">
                    Full API reference
                  </DocLink>
                </div>
              </DocSection>

              {/* WebSocket */}
              <DocSection
                id="websocket"
                title="Real-Time Events"
                description="Subscribe to live DID, access, and anomaly events over WebSocket."
              >
                <DocCode>{`// Connect and subscribe
const ws = new WebSocket('ws://localhost:8000/ws');
ws.send(JSON.stringify({ topic: 'anomaly.alerts' }));

// Event format
{
  "type": "anomaly.alert",
  "data": {
    "user_id": "user_0199",
    "risk_score": 0.94,
    "severity": "critical",
    "action": "export",
    "resource": "api/keys"
  }
}`}</DocCode>
              </DocSection>

              {/* SDK */}
              <DocSection
                id="sdk"
                title="SDKs and Clients"
                description="Recommended client libraries for each layer of the stack."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { name: 'ethers.js v6', body: 'Contract interaction from the browser.' },
                    { name: 'wagmi v2', body: 'React hooks for wallet connection and reads.' },
                    { name: 'viem', body: 'Low-level, TypeScript-first blockchain access.' },
                    { name: 'Next.js 14', body: 'App Router with SSR and standalone output.' },
                  ].map((lib) => (
                    <div key={lib.name} className="rounded-lg border border-border bg-surface-container-low p-4">
                      <p className="mb-1 text-sm font-semibold text-foreground">{lib.name}</p>
                      <p className="text-sm text-muted-foreground">{lib.body}</p>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* Contracts */}
              <DocSection
                id="contracts"
                title="Smart Contracts"
                description="Solidity contracts on Polygon Amoy. Audit reports and test suites live in the repository."
              >
                <div className="flex flex-col gap-2">
                  <DocLink href="https://github.com/Samyra312007/DecentraID/blob/main/docs/smart-contracts.md">
                    Contract documentation
                  </DocLink>
                  <DocLink href="https://github.com/Samyra312007/DecentraID/blob/main/docs/deployment.md">
                    Deployment runbook
                  </DocLink>
                </div>
                <DocCode>{`Contracts/
├── Identity.sol         DID registry
├── AccessControl.sol    RBAC/ABAC policy engine
├── Assets.sol           ERC-721 asset custody
└── interfaces/          IIdentity, IAccessControl, IAssets`}</DocCode>
              </DocSection>

              {/* Deployment */}
              <DocSection
                id="deployment"
                title="Deployment"
                description="From local Docker to production hosting."
              >
                <DocCode>{`# Local full stack
docker compose up -d

# Rebuild the frontend after code changes
sh ./scripts/rebuild-frontend.sh`}</DocCode>
                <div className="flex flex-col gap-2">
                  <DocLink href="https://github.com/Samyra312007/DecentraID/blob/main/docs/deployment.md">
                    Production deployment guide
                  </DocLink>
                </div>
              </DocSection>

              {/* Troubleshooting */}
              <DocSection
                id="troubleshooting"
                title="Troubleshooting"
                description="Quick fixes for the most common issues."
              >
                <div className="flex flex-col gap-4">
                  {[
                    {
                      q: 'Docker shows an outdated frontend',
                      a: 'Rebuild the image from current source: sh ./scripts/rebuild-frontend.sh. For a full cache-bypassing rebuild, add --no-cache.',
                    },
                    {
                      q: 'Swagger UI is blank or blocked',
                      a: 'The nginx config already relaxes CSP on /docs routes. Verify the backend container is healthy: docker compose ps backend.',
                    },
                    {
                      q: 'Wallet connection fails on Polygon Amoy',
                      a: 'Confirm the network is added to your wallet and the RPC URL is reachable. Check the browser console for chain ID mismatches.',
                    },
                  ].map((item) => (
                    <div key={item.q} className="rounded-lg border border-border bg-surface-container-low p-4">
                      <p className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-foreground">
                        <span className="material-symbols-outlined text-base text-primary">help</span>
                        {item.q}
                      </p>
                      <p className="text-sm text-muted-foreground" style={{ fontFamily: 'var(--font-nunito)', lineHeight: 1.6 }}>
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </DocSection>

              {/* Bottom nav */}
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-surface-container-low px-6 py-5 sm:flex-row sm:items-center">
                <p className="text-sm text-muted-foreground">
                  Questions not covered here? Open an issue on the{' '}
                  <a
                    href="https://github.com/Samyra312007/DecentraID/issues"
                    className="font-semibold text-primary hover:underline underline-offset-4"
                  >
                    GitHub repository
                  </a>
                  .
                </p>
                <Link
                  href="/signup"
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
          <p className="text-sm text-slate-400">&copy; 2026 DecentraID. Securing the decentralized future.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-slate-400 transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-400 transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/docs" className="text-sm text-slate-400 transition-colors hover:text-primary">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

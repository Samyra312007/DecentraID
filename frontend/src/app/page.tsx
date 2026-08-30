'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import { WalletConnect } from '@/components/common/WalletConnect';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { Shield, KeyRound, Activity, Lock, Globe, ArrowRight, Check } from 'lucide-react';

export default function LandingPage() {
  const { connected } = useDecentraID();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
            Decentralized Identity
            <br />
            <span className="text-primary">You Control</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Self-sovereign identity management on Polygon blockchain. Own your credentials, control your data.
          </p>
          <div className="flex items-center justify-center gap-4">
            {connected ? (
              <Link href="/dashboard">
                <Button size="lg">
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            ) : (
              <div className="max-w-sm w-full">
                <WalletConnect />
              </div>
            )}
          </div>
        </div>
      </section>

      <Separator />

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold text-foreground text-center mb-10">Built for Sovereignty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: KeyRound, title: 'Decentralized IDs', desc: 'Create and manage DIDs on Polygon. Your identity, your keys.' },
              { icon: Shield, title: 'Verifiable Credentials', desc: 'Mint NFT-based credentials. Tamper-proof, instantly verifiable.' },
              { icon: Lock, title: 'Access Control', desc: 'Fine-grained RBAC policies. Decide who sees what.' },
              { icon: Activity, title: 'Anomaly Detection', desc: 'Real-time monitoring. Catch suspicious activity before it matters.' },
              { icon: Globe, title: 'Cross-Chain Ready', desc: 'Polygon-native with plans for multi-chain expansion.' },
              { icon: Shield, title: 'Privacy First', desc: 'Zero-knowledge proofs. Prove without revealing.' },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <feature.icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* Stats */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          {[
            { value: '10K+', label: 'DIDs Created' },
            { value: '50K+', label: 'Credentials Minted' },
            { value: '99.9%', label: 'Uptime' },
            { value: '<2s', label: 'Avg. Tx Time' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-foreground mb-3">Ready to Own Your Identity?</h2>
          <p className="text-sm text-muted-foreground mb-6">Connect your wallet and create your first decentralized identifier in under a minute.</p>
          {connected ? (
            <Link href="/did">
              <Button size="lg">
                Create Your DID <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          ) : (
            <div className="max-w-sm mx-auto">
              <WalletConnect />
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-muted-foreground">
          <span>DecentraID</span>
          <span>Built on Polygon</span>
        </div>
      </footer>
    </div>
  );
}

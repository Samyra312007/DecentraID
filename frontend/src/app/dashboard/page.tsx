'use client';

import Link from 'next/link';
import { useDecentraID } from '@/hooks/useDecentraID';
import { WalletConnect } from '@/components/common/WalletConnect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/PageHeader';

const stats = [
  { label: 'Identities', value: '2', change: '+1 this week', icon: 'badge' },
  { label: 'Assets', value: '3', change: '+1 this month', icon: 'token' },
  { label: 'Access Requests', value: '5', change: '2 pending', icon: 'gavel' },
  { label: 'Risk Score', value: '23', change: 'Low risk', icon: 'monitoring' },
];

export default function DashboardPage() {
  const { connected, address } = useDecentraID();

  if (!connected) {
    return (
      <div className="space-y-5">
        <PageHeader
          eyebrow="Overview"
          title="Dashboard"
          subtitle="Overview of your decentralized identity"
        />
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Overview"
        title={`Welcome back${address ? '' : ''}`}
        subtitle="Your identity, assets, and access signals at a glance."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="group hover:border-primary/30 transition-colors">
            <CardContent className="pt-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                <span className="material-symbols-outlined text-[20px] text-primary/70 transition-colors group-hover:text-primary">
                  {stat.icon}
                </span>
              </div>
              <p
                className="text-3xl text-foreground"
                style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
              >
                {stat.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick views */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="inner-glow">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Identities</CardTitle>
            <span className="material-symbols-outlined text-[20px] text-primary">badge</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {['Personal Identity', 'Business Identity'].map((name) => (
                <div key={name} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
                  <span className="text-sm text-foreground">{name}</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
            <Link href="/did" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-80">
              View all identities
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="inner-glow">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Assets</CardTitle>
            <span className="material-symbols-outlined text-[20px] text-primary">token</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {['Driver License', 'University Degree'].map((name) => (
                <div key={name} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
                  <span className="text-sm text-foreground">{name}</span>
                  <Badge variant="outline">Credential</Badge>
                </div>
              ))}
            </div>
            <Link href="/assets" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-opacity hover:opacity-80">
              View all assets
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

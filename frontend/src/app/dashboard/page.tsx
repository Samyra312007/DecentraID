'use client';

import { useDecentraID } from '@/hooks/useDecentraID';
import { WalletConnect } from '@/components/common/WalletConnect';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { connected, address } = useDecentraID();

  if (!connected) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your decentralized identity</p>
        </div>
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Overview of your decentralized identity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'DIDs', value: '2', change: '+1 this week' },
          { label: 'Assets', value: '3', change: '+1 this month' },
          { label: 'Access Requests', value: '5', change: '2 pending' },
          { label: 'Risk Score', value: '23', change: 'Low risk' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Recent DIDs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Personal Identity', 'Business Identity'].map((name) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{name}</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
            <Link href="/did" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-4 transition-colors">
              View all DIDs <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Driver License', 'University Degree'].map((name) => (
                <div key={name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm text-foreground">{name}</span>
                  <Badge variant="outline">Credential</Badge>
                </div>
              ))}
            </div>
            <Link href="/assets" className="inline-flex items-center text-sm text-primary hover:text-primary/80 mt-4 transition-colors">
              View all Assets <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Alert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

interface AlertListProps {
  alerts: Alert[];
  onAcknowledge?: (id: string) => void;
}

const severityVariant = {
  low: 'secondary' as const,
  medium: 'outline' as const,
  high: 'destructive' as const,
  critical: 'destructive' as const,
};

const severityIcon = {
  low: { icon: 'info', className: 'bg-border/40 text-muted-foreground' },
  medium: { icon: 'warning', className: 'bg-warning/10 text-warning' },
  high: { icon: 'error', className: 'bg-danger/10 text-danger' },
  critical: { icon: 'report', className: 'bg-danger/10 text-danger' },
};

const severityBorder = {
  low: 'border-l-primary/30',
  medium: 'border-l-warning',
  high: 'border-l-danger',
  critical: 'border-l-danger',
};

export function AlertList({ alerts, onAcknowledge }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <Card className="inner-glow">
        <CardContent className="py-12 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
            <span className="material-symbols-outlined text-success">check_circle</span>
          </div>
          <p className="text-sm text-muted-foreground">No alerts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {alerts.map(alert => {
            const icon = severityIcon[alert.severity];
            return (
              <div
                key={alert.id}
                className={`flex items-start justify-between rounded-lg border border-border border-l-[3px] bg-surface-container p-3.5 transition-opacity ${
                  alert.acknowledged ? 'border-l-primary/30 opacity-50' : severityBorder[alert.severity]
                }`}
              >
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${icon.className}`}>
                    <span className="material-symbols-outlined text-[18px]">{icon.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge variant={severityVariant[alert.severity]}>
                        {alert.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{alert.type}</span>
                    </div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                {!alert.acknowledged && onAcknowledge && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="ml-3 shrink-0 rounded border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

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

export function AlertList({ alerts, onAcknowledge }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-success" />
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
          {alerts.map(alert => (
            <div
              key={alert.id}
              className={`p-3.5 rounded-lg ${alert.acknowledged ? 'opacity-50' : ''} border-l-[3px] ${
                alert.severity === 'critical' || alert.severity === 'high'
                  ? 'border-l-destructive'
                  : alert.severity === 'medium'
                  ? 'border-l-warning'
                  : 'border-l-border'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={severityVariant[alert.severity]}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{alert.type}</span>
                  </div>
                  <p className="text-sm text-foreground">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
                {!alert.acknowledged && onAcknowledge && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAcknowledge(alert.id)}
                    className="shrink-0 ml-3"
                  >
                    Ack
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

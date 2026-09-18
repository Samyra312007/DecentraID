'use client';

import { RiskGauge } from './RiskGauge';
import { AlertList } from './AlertList';
import { BehaviorChart } from './BehaviorChart';
import { Card, CardContent } from '@/components/ui/card';

interface AnomalyDetailProps {
  score: number;
  alerts: Array<{
    id: string;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    timestamp: string;
    acknowledged: boolean;
  }>;
  behaviorData: Array<{
    timestamp: string;
    value: number;
    baseline?: number;
  }>;
  onAcknowledgeAlert?: (id: string) => void;
}

const statIcons = {
  critical: 'error',
  high: 'warning',
  unacknowledged: 'notifications',
  resolved: 'check_circle',
};

export function AnomalyDetail({ score, alerts, behaviorData, onAcknowledgeAlert }: AnomalyDetailProps) {
  const statTiles = [
    { label: 'Critical Alerts', value: alerts.filter(a => a.severity === 'critical').length, color: 'text-danger', icon: statIcons.critical },
    { label: 'High Alerts', value: alerts.filter(a => a.severity === 'high').length, color: 'text-warning', icon: statIcons.high },
    { label: 'Unacknowledged', value: alerts.filter(a => !a.acknowledged).length, color: 'text-foreground', icon: statIcons.unacknowledged },
    { label: 'Resolved', value: alerts.filter(a => a.acknowledged).length, color: 'text-success', icon: statIcons.resolved },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <RiskGauge score={score} />
        </div>
        <div className="lg:col-span-2">
          <BehaviorChart data={behaviorData} title="Access Pattern" />
        </div>
      </div>

      <AlertList alerts={alerts} onAcknowledge={onAcknowledgeAlert} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {statTiles.map((tile) => (
          <Card key={tile.label}>
            <CardContent className="py-4 text-center">
              <span className={`material-symbols-outlined mb-1 block text-xl ${tile.color}`}>{tile.icon}</span>
              <div
                className={`text-2xl ${tile.color}`}
                style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
              >
                {tile.value}
              </div>
              <div className="text-xs text-muted-foreground">{tile.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

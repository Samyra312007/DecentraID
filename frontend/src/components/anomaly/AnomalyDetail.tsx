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

export function AnomalyDetail({ score, alerts, behaviorData, onAcknowledgeAlert }: AnomalyDetailProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <RiskGauge score={score} />
        </div>
        <div className="lg:col-span-2">
          <BehaviorChart data={behaviorData} title="Access Pattern" />
        </div>
      </div>

      <AlertList alerts={alerts} onAcknowledge={onAcknowledgeAlert} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-xl font-bold text-foreground">
              {alerts.filter(a => a.severity === 'critical').length}
            </div>
            <div className="text-xs text-muted-foreground">Critical Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-xl font-bold text-foreground">
              {alerts.filter(a => a.severity === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">High Alerts</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-xl font-bold text-foreground">
              {alerts.filter(a => !a.acknowledged).length}
            </div>
            <div className="text-xs text-muted-foreground">Unacknowledged</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-4">
            <div className="text-xl font-bold text-success">
              {alerts.filter(a => a.acknowledged).length}
            </div>
            <div className="text-xs text-muted-foreground">Resolved</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

'use client';

import { RiskGauge } from './RiskGauge';
import { AlertList } from './AlertList';
import { BehaviorChart } from './BehaviorChart';

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <RiskGauge score={score} />
        </div>
        <div className="lg:col-span-2">
          <BehaviorChart data={behaviorData} title="Access Pattern" />
        </div>
      </div>
      
      <AlertList alerts={alerts} onAcknowledge={onAcknowledgeAlert} />
      
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
            {alerts.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Critical Alerts</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
            {alerts.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>High Alerts</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-ink)' }}>
            {alerts.filter(a => !a.acknowledged).length}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Unacknowledged</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold" style={{ color: 'var(--color-semantic-up)' }}>
            {alerts.filter(a => a.acknowledged).length}
          </div>
          <div className="text-xs" style={{ color: 'var(--color-muted)' }}>Resolved</div>
        </div>
      </div>
    </div>
  );
}

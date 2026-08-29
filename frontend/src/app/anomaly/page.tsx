'use client';

import { AnomalyDetail } from '@/components/anomaly/AnomalyDetail';
import { WalletConnect } from '@/components/common/WalletConnect';
import { useDecentraID } from '@/hooks/useDecentraID';

const mockAlerts = [
  { id: '1', type: 'Unusual Access Pattern', severity: 'high' as const, message: 'Multiple failed access attempts detected from different locations', timestamp: '2024-01-20T14:22:00Z', acknowledged: false },
  { id: '2', type: 'Rate Limit Exceeded', severity: 'medium' as const, message: 'API rate limit exceeded for identity resolution', timestamp: '2024-01-20T10:15:00Z', acknowledged: false },
  { id: '3', type: 'New Device Detected', severity: 'low' as const, message: 'Access from new device in San Francisco, CA', timestamp: '2024-01-19T08:30:00Z', acknowledged: true },
];

const mockBehaviorData = [
  { timestamp: '2024-01-20T00:00:00Z', value: 45, baseline: 50 },
  { timestamp: '2024-01-20T04:00:00Z', value: 30, baseline: 50 },
  { timestamp: '2024-01-20T08:00:00Z', value: 75, baseline: 50 },
  { timestamp: '2024-01-20T12:00:00Z', value: 90, baseline: 50 },
  { timestamp: '2024-01-20T16:00:00Z', value: 60, baseline: 50 },
  { timestamp: '2024-01-20T20:00:00Z', value: 40, baseline: 50 },
];

export default function AnomalyPage() {
  const { connected } = useDecentraID();

  if (!connected) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)]">Anomaly Detection</h1>
          <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Monitor and analyze suspicious activity</p>
        </div>
        <div className="max-w-md"><WalletConnect /></div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[24px] font-semibold text-[var(--color-text-primary)]">Anomaly Detection</h1>
        <p className="text-[14px] text-[var(--color-text-muted)] mt-1">Monitor and analyze suspicious activity</p>
      </div>

      <AnomalyDetail
        score={23}
        alerts={mockAlerts}
        behaviorData={mockBehaviorData}
        onAcknowledgeAlert={(id) => console.log('Acknowledge:', id)}
      />
    </div>
  );
}

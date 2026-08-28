'use client';

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

export function AlertList({ alerts, onAcknowledge }: AlertListProps) {
  const severityColors = {
    low: 'var(--color-surface-strong)',
    medium: 'var(--color-accent-yellow)',
    high: 'var(--color-semantic-down)',
    critical: 'var(--color-semantic-down)',
  };

  if (alerts.length === 0) {
    return (
      <div className="card text-center py-8">
        <span className="text-3xl block mb-3">✅</span>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No alerts</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>Alerts</h2>
      <div className="space-y-3">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`p-4 rounded-xl border-l-4 ${alert.acknowledged ? 'opacity-60' : ''}`}
            style={{ 
              borderColor: severityColors[alert.severity],
              backgroundColor: 'var(--color-surface-soft)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge text-xs" style={{ backgroundColor: severityColors[alert.severity], color: alert.severity === 'low' ? 'var(--color-ink)' : 'white' }}>
                    {alert.severity}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-muted)' }}>{alert.type}</span>
                </div>
                <p className="text-sm" style={{ color: 'var(--color-ink)' }}>{alert.message}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {!alert.acknowledged && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ backgroundColor: 'var(--color-surface-strong)', color: 'var(--color-ink)' }}
                >
                  Ack
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

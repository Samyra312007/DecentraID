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

const severityBadge = {
  low: 'badge-neutral',
  medium: 'badge-warning',
  high: 'badge-danger',
  critical: 'badge-danger',
};

const severityBorder = {
  low: 'var(--color-border)',
  medium: 'var(--color-warning)',
  high: 'var(--color-danger)',
  critical: 'var(--color-danger)',
};

export function AlertList({ alerts, onAcknowledge }: AlertListProps) {
  if (alerts.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
        </div>
        <p className="text-[13px] text-[var(--color-text-muted)]">No alerts</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-4">Alerts</h2>
      <div className="space-y-2.5">
        {alerts.map(alert => (
          <div
            key={alert.id}
            className={`p-3.5 rounded-lg border-l-[3px] ${alert.acknowledged ? 'opacity-50' : ''}`}
            style={{
              borderLeftColor: severityBorder[alert.severity],
              backgroundColor: 'var(--color-bg-card)',
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`badge text-[11px] ${severityBadge[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <span className="text-[12px] text-[var(--color-text-muted)]">{alert.type}</span>
                </div>
                <p className="text-[13px] text-[var(--color-text-primary)]">{alert.message}</p>
                <p className="text-[12px] text-[var(--color-text-muted)] mt-1.5">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              {!alert.acknowledged && onAcknowledge && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="text-[12px] px-2.5 py-1 rounded bg-white/[0.06] text-[var(--color-text-primary)] hover:bg-white/[0.1] transition-colors shrink-0 ml-3"
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

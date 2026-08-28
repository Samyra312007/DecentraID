'use client';

interface BehaviorDataPoint {
  timestamp: string;
  value: number;
  baseline?: number;
}

interface BehaviorChartProps {
  data: BehaviorDataPoint[];
  title?: string;
  maxValue?: number;
}

export function BehaviorChart({ data, title = 'Behavior Pattern', maxValue = 100 }: BehaviorChartProps) {
  const max = Math.max(...data.map(d => d.value), maxValue);
  
  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>{title}</h2>
      
      {/* Simple bar chart visualization */}
      <div className="h-48 flex items-end gap-1">
        {data.map((point, index) => {
          const height = (point.value / max) * 100;
          const baselineHeight = point.baseline ? (point.baseline / max) * 100 : 0;
          const isAnomaly = point.baseline ? point.value > point.baseline * 1.5 : false;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full rounded-t transition-all"
                style={{ 
                  height: `${height}%`,
                  backgroundColor: isAnomaly ? 'var(--color-semantic-down)' : 'var(--color-primary)',
                  opacity: isAnomaly ? 1 : 0.8,
                }}
              />
              {point.baseline && (
                <div 
                  className="absolute w-full"
                  style={{ 
                    bottom: `${baselineHeight}%`,
                    borderTop: '1px dashed var(--color-muted-soft)',
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--color-muted)' }}>
        {data.length > 0 && (
          <>
            <span>{new Date(data[0].timestamp).toLocaleTimeString()}</span>
            <span>{new Date(data[data.length - 1].timestamp).toLocaleTimeString()}</span>
          </>
        )}
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-primary)' }} />
          <span style={{ color: 'var(--color-muted)' }}>Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'var(--color-semantic-down)' }} />
          <span style={{ color: 'var(--color-muted)' }}>Anomaly</span>
        </div>
      </div>
    </div>
  );
}

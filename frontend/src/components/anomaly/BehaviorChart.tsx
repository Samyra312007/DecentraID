'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-48 flex items-end gap-1">
          {data.map((point, index) => {
            const height = (point.value / max) * 100;
            const isAnomaly = point.baseline ? point.value > point.baseline * 1.5 : false;

            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${height}%`,
                    backgroundColor: isAnomaly ? 'var(--danger)' : 'var(--primary)',
                    opacity: isAnomaly ? 1 : 0.8,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {data.length > 0 && (
            <>
              <span>{new Date(data[0].timestamp).toLocaleTimeString()}</span>
              <span>{new Date(data[data.length - 1].timestamp).toLocaleTimeString()}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--primary)' }} />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--danger)' }} />
            <span className="text-muted-foreground">Anomaly</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
    <Card className="inner-glow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-48 items-end gap-1.5">
          {data.map((point, index) => {
            const height = (point.value / max) * 100;
            const isAnomaly = point.baseline ? point.value > point.baseline * 1.5 : false;

            return (
              <div key={index} className="group flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-full transition-all duration-200 group-hover:opacity-100"
                  style={{
                    height: `${height}%`,
                    background: isAnomaly
                      ? 'var(--danger)'
                      : 'linear-gradient(to top, color-mix(in srgb, var(--primary) 45%, transparent), var(--primary))',
                    opacity: isAnomaly ? 1 : 0.75,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          {data.length > 0 && (
            <>
              <span>{new Date(data[0].timestamp).toLocaleTimeString()}</span>
              <span>{new Date(data[data.length - 1].timestamp).toLocaleTimeString()}</span>
            </>
          )}
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm bg-primary/75" />
            <span className="text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-sm bg-danger" />
            <span className="text-muted-foreground">Anomaly</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

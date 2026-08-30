'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RiskGaugeProps {
  score: number;
  label?: string;
}

export function RiskGauge({ score, label = 'Risk Score' }: RiskGaugeProps) {
  const getColor = (score: number) => {
    if (score < 30) return 'text-success';
    if (score < 70) return 'text-warning';
    return 'text-danger';
  };

  const getVarColor = (score: number) => {
    if (score < 30) return 'var(--success)';
    if (score < 70) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  const color = getVarColor(score);
  const rotation = (score / 100) * 180 - 90;

  return (
    <Card>
      <CardContent className="text-center">
        <h3 className="text-base font-semibold text-foreground mb-5">{label}</h3>

        <div className="relative w-48 h-24 mx-auto mb-4">
          <div
            className="absolute inset-0 rounded-t-full opacity-15"
            style={{
              background: `conic-gradient(from 180deg, var(--success) 0deg, var(--warning) 90deg, var(--danger) 180deg)`,
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom"
            style={{
              backgroundColor: color,
              transform: `translateX(-50%) rotate(${rotation}deg)`,
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full -translate-x-1/2 translate-y-1/2"
            style={{ backgroundColor: color }}
          />
        </div>

        <div className={`text-4xl font-bold mb-2 ${getColor(score)}`}>
          {score}
        </div>
        <div className={`text-sm font-medium ${getColor(score)}`}>
          {getLabel(score)}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { Card, CardContent } from '@/components/ui/card';

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
    <Card className="inner-glow">
      <CardContent className="text-center">
        <h3
          className="mb-5 text-base text-foreground"
          style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
        >
          {label}
        </h3>

        <div className="relative mx-auto mb-4 h-24 w-48">
          <div
            className="absolute inset-0 rounded-t-full opacity-15"
            style={{
              background: `conic-gradient(from 180deg, var(--success) 0deg, var(--warning) 90deg, var(--danger) 180deg)`,
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 h-20 w-1 origin-bottom rounded-full"
            style={{
              backgroundColor: color,
              transform: `translateX(-50%) rotate(${rotation}deg)`,
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 translate-y-1/2 rounded-full"
            style={{ backgroundColor: color }}
          />
        </div>

        <div
          className={`mb-2 text-4xl ${getColor(score)}`}
          style={{ fontFamily: 'var(--font-literata)', fontWeight: 600 }}
        >
          {score}
        </div>
        <div className={`text-sm font-medium ${getColor(score)}`}>
          {getLabel(score)}
        </div>
      </CardContent>
    </Card>
  );
}

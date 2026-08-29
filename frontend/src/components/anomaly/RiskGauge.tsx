'use client';

interface RiskGaugeProps {
  score: number;
  label?: string;
}

export function RiskGauge({ score, label = 'Risk Score' }: RiskGaugeProps) {
  const getColor = (score: number) => {
    if (score < 30) return 'var(--color-success)';
    if (score < 70) return 'var(--color-warning)';
    return 'var(--color-danger)';
  };

  const getLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  const color = getColor(score);
  const rotation = (score / 100) * 180 - 90;

  return (
    <div className="card text-center">
      <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)] mb-5">{label}</h3>

      <div className="relative w-48 h-24 mx-auto mb-4">
        <div
          className="absolute inset-0 rounded-t-full"
          style={{
            background: `conic-gradient(from 180deg, var(--color-success) 0deg, var(--color-warning) 90deg, var(--color-danger) 180deg)`,
            opacity: 0.15,
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

      <div className="text-[2rem] font-bold mb-2" style={{ color }}>
        {score}
      </div>
      <div className="text-[13px] font-medium" style={{ color }}>
        {getLabel(score)}
      </div>
    </div>
  );
}

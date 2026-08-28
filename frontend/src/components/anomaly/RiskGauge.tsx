'use client';

interface RiskGaugeProps {
  score: number; // 0-100
  label?: string;
}

export function RiskGauge({ score, label = 'Risk Score' }: RiskGaugeProps) {
  const getColor = (score: number) => {
    if (score < 30) return 'var(--color-semantic-up)';
    if (score < 70) return 'var(--color-accent-yellow)';
    return 'var(--color-semantic-down)';
  };

  const getLabel = (score: number) => {
    if (score < 30) return 'Low Risk';
    if (score < 70) return 'Medium Risk';
    return 'High Risk';
  };

  const color = getColor(score);
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="card text-center">
      <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-ink)' }}>{label}</h3>
      
      {/* Gauge */}
      <div className="relative w-48 h-24 mx-auto mb-4">
        {/* Background arc */}
        <div 
          className="absolute inset-0 rounded-t-full"
          style={{ 
            background: `conic-gradient(from 180deg, var(--color-semantic-up) 0deg, var(--color-accent-yellow) 90deg, var(--color-semantic-down) 180deg)`,
            opacity: 0.2,
          }}
        />
        
        {/* Needle */}
        <div 
          className="absolute bottom-0 left-1/2 w-1 h-20 origin-bottom transform -translate-x-1/2"
          style={{ 
            backgroundColor: color,
            transform: `translateX(-50%) rotate(${rotation}deg)`,
          }}
        />
        
        {/* Center dot */}
        <div 
          className="absolute bottom-0 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 translate-y-1/2"
          style={{ backgroundColor: color }}
        />
      </div>

      {/* Score */}
      <div className="text-4xl font-bold mb-2" style={{ color }}>
        {score}
      </div>
      <div className="text-sm font-medium" style={{ color }}>
        {getLabel(score)}
      </div>
    </div>
  );
}

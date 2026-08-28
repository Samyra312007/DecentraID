interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${sizeClasses[size]} border-2 border-t-transparent rounded-full animate-spin`}
        style={{ borderColor: 'var(--color-hairline)', borderTopColor: 'var(--color-primary)' }}
      />
      {text && (
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>{text}</p>
      )}
    </div>
  );
}

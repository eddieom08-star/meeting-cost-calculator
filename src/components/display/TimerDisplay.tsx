import React from 'react';
import { formatDuration } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface TimerDisplayProps {
  elapsedMs: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  elapsedMs,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className={cn('text-center', className)}>
      {showLabel && (
        <p className="text-slate-400 text-sm mb-1">Duration</p>
      )}
      <time
        className={cn(
          'font-mono tabular-nums text-slate-300',
          sizeClasses[size]
        )}
        dateTime={`PT${Math.floor(elapsedMs / 1000)}S`}
      >
        {formatDuration(elapsedMs)}
      </time>
    </div>
  );
};

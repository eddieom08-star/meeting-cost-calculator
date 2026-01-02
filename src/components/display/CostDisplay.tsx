import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { TimerDisplay } from './TimerDisplay';
import { BurnRateIndicator } from './BurnRateIndicator';
import { CostComparison } from './CostComparison';
import { useMeetingTimer } from '@/hooks/useMeetingTimer';
import { useMeetingCost } from '@/hooks/useMeetingCost';
import { Card } from '@/components/ui';
import { cn } from '@/utils/cn';

interface CostDisplayProps {
  variant?: 'default' | 'compact' | 'presentation';
  showComparison?: boolean;
  className?: string;
}

export const CostDisplay: React.FC<CostDisplayProps> = ({
  variant = 'default',
  showComparison = true,
  className,
}) => {
  const { elapsedTime, currentCost, isActive } = useMeetingTimer();
  const { costPerMinute, costLevel } = useMeetingCost(currentCost);

  if (variant === 'presentation') {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center min-h-screen p-8',
        'bg-gradient-to-b from-slate-900 to-slate-950',
        className
      )}>
        <AnimatedCounter value={currentCost} size="presentation" />
        <TimerDisplay elapsedMs={elapsedTime} size="lg" className="mt-4" />
        <BurnRateIndicator
          costPerMinute={costPerMinute}
          costLevel={costLevel}
          className="mt-8"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <AnimatedCounter value={currentCost} size="md" />
        <TimerDisplay elapsedMs={elapsedTime} size="sm" />
      </div>
    );
  }

  // Default variant
  return (
    <Card variant="elevated" className={cn('text-center py-8', className)}>
      <AnimatedCounter value={currentCost} size="xl" />
      <TimerDisplay elapsedMs={elapsedTime} size="md" className="mt-2" />

      <div className="flex justify-center mt-6">
        <BurnRateIndicator
          costPerMinute={costPerMinute}
          costLevel={costLevel}
        />
      </div>

      {showComparison && currentCost > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-700">
          <CostComparison costCents={currentCost} />
        </div>
      )}

      {isActive && (
        <div className="mt-4">
          <span className="inline-flex items-center gap-2 text-green-400 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Meeting in progress
          </span>
        </div>
      )}
    </Card>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface BurnRateIndicatorProps {
  costPerMinute: number;
  costLevel: 'low' | 'medium' | 'high';
  className?: string;
}

const levelConfig = {
  low: {
    color: 'text-green-400',
    bgColor: 'bg-green-400/20',
    icon: '💰',
    label: 'Low burn',
  },
  medium: {
    color: 'text-amber-400',
    bgColor: 'bg-amber-400/20',
    icon: '🔥',
    label: 'Medium burn',
  },
  high: {
    color: 'text-red-400',
    bgColor: 'bg-red-400/20',
    icon: '🔥🔥',
    label: 'High burn',
  },
};

export const BurnRateIndicator: React.FC<BurnRateIndicatorProps> = ({
  costPerMinute,
  costLevel,
  className,
}) => {
  const config = levelConfig[costLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full',
        config.bgColor,
        className
      )}
    >
      <span role="img" aria-hidden="true">{config.icon}</span>
      <span className={cn('font-medium', config.color)}>
        {formatCurrency(costPerMinute)}/min
      </span>
    </motion.div>
  );
};

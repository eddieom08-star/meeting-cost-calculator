import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface AnimatedCounterProps {
  value: number;
  size?: 'md' | 'lg' | 'xl' | 'presentation';
  className?: string;
}

const sizeClasses = {
  md: 'text-3xl md:text-4xl',
  lg: 'text-4xl md:text-5xl',
  xl: 'text-5xl md:text-6xl',
  presentation: 'text-7xl md:text-9xl',
};

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  size = 'lg',
  className,
}) => {
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 30,
    mass: 1,
  });

  const displayValue = useTransform(springValue, (current) =>
    formatCurrency(Math.round(current))
  );

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  return (
    <motion.div
      className={cn(
        'font-mono font-bold tabular-nums tracking-tight',
        'text-white',
        sizeClasses[size],
        className
      )}
      aria-live="polite"
      aria-atomic="true"
      role="timer"
    >
      <motion.span>{displayValue}</motion.span>
    </motion.div>
  );
};

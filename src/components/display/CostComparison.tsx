import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCostComparison, getAllComparisons } from '@/utils/comparisons';
import { cn } from '@/utils/cn';

interface CostComparisonProps {
  costCents: number;
  rotate?: boolean;
  className?: string;
}

export const CostComparison: React.FC<CostComparisonProps> = ({
  costCents,
  rotate = true,
  className,
}) => {
  const comparisons = getAllComparisons(costCents);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!rotate || comparisons.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % comparisons.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [rotate, comparisons.length]);

  const currentComparison = comparisons[currentIndex] || { text: 'Starting...', count: 0 };

  return (
    <div className={cn('text-center', className)}>
      <p className="text-slate-500 text-sm mb-1">This meeting equals</p>
      <AnimatePresence mode="wait">
        <motion.p
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-xl text-slate-300"
        >
          {currentComparison.text}
        </motion.p>
      </AnimatePresence>

      {comparisons.length > 1 && rotate && (
        <div className="flex justify-center gap-1 mt-3">
          {comparisons.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                idx === currentIndex ? 'bg-blue-500' : 'bg-slate-600'
              )}
              aria-label={`Show comparison ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

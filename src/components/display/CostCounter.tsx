import { useSpring, animated } from '@react-spring/web';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/utils/cn';

interface CostCounterProps {
  value: number;
  size?: 'default' | 'large' | 'presentation';
  className?: string;
}

const sizeClasses = {
  default: 'text-4xl',
  large: 'text-6xl',
  presentation: 'text-9xl'
};

export const CostCounter: React.FC<CostCounterProps> = ({
  value,
  size = 'default',
  className
}) => {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    config: { tension: 300, friction: 30 }
  });

  return (
    <animated.div
      className={cn(
        'font-mono font-bold tabular-nums text-white',
        sizeClasses[size],
        className
      )}
      aria-live="polite"
      aria-label={`Current meeting cost: ${formatCurrency(value)}`}
    >
      {number.to(n => formatCurrency(n))}
    </animated.div>
  );
};

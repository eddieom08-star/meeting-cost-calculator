import React, { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn';

interface IconButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = 'default', size = 'md', label, className, children, ...props }, ref) => {
    const variantStyles = {
      default: 'bg-slate-700 hover:bg-slate-600 text-white',
      ghost: 'bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white',
    };

    const sizeStyles = {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          'inline-flex items-center justify-center rounded-lg',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        aria-label={label}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';

import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number;
  onChange: (value: number) => void;
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, label, prefix, suffix, error, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value) || 0;
      onChange(newValue);
    };

    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefix && (
            <span className="absolute left-3 text-slate-400">{prefix}</span>
          )}
          <input
            ref={ref}
            type="number"
            value={value}
            onChange={handleChange}
            className={cn(
              'w-full bg-slate-800 border border-slate-600 rounded-lg',
              'text-white placeholder-slate-500',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
              'font-mono tabular-nums',
              prefix ? 'pl-8' : 'pl-3',
              suffix ? 'pr-12' : 'pr-3',
              'py-2',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-slate-400 text-sm">{suffix}</span>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

NumberInput.displayName = 'NumberInput';

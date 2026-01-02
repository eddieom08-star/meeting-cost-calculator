import React from 'react';
import { motion } from 'framer-motion';
import { MeetingStatus as MeetingStatusType } from '@/types/meeting';
import { cn } from '@/utils/cn';

interface MeetingStatusProps {
  status: MeetingStatusType;
  className?: string;
}

const statusConfig: Record<MeetingStatusType, { label: string; color: string; pulse: boolean }> = {
  setup: { label: 'Setting up', color: 'bg-slate-500', pulse: false },
  running: { label: 'In progress', color: 'bg-green-500', pulse: true },
  paused: { label: 'Paused', color: 'bg-amber-500', pulse: false },
  completed: { label: 'Completed', color: 'bg-blue-500', pulse: false },
};

export const MeetingStatusBadge: React.FC<MeetingStatusProps> = ({
  status,
  className,
}) => {
  const config = statusConfig[status];

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <span className="relative flex h-2.5 w-2.5">
        {config.pulse && (
          <span className={cn(
            'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
            config.color
          )} />
        )}
        <span className={cn(
          'relative inline-flex rounded-full h-2.5 w-2.5',
          config.color
        )} />
      </span>
      <span className="text-sm text-slate-300">{config.label}</span>
    </div>
  );
};

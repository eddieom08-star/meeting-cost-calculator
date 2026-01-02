import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency, formatDurationHuman } from '@/utils/formatters';
import type { MeetingSummary } from '@/types';
import { cn } from '@/utils/cn';

interface MeetingSummaryCardProps {
  meeting: MeetingSummary;
  onClick?: () => void;
  className?: string;
}

export const MeetingSummaryCard: React.FC<MeetingSummaryCardProps> = ({
  meeting,
  onClick,
  className,
}) => {
  const date = new Date(meeting.endedAt);
  const isToday =
    date.toDateString() === new Date().toDateString();
  const dateStr = isToday
    ? 'Today'
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      });

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  const costPerAttendee = meeting.totalCost / meeting.attendeeCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={onClick ? { scale: 1.01 } : undefined}
      onClick={onClick}
      className={cn(
        'bg-slate-800/50 rounded-lg p-4 border border-slate-700/50',
        'hover:border-slate-600 transition-colors',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-sm text-slate-400">
            {dateStr} at {timeStr}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatDurationHuman(meeting.duration)} • {meeting.attendeeCount}{' '}
            {meeting.attendeeCount === 1 ? 'attendee' : 'attendees'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            {formatCurrency(meeting.totalCost)}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {formatCurrency(costPerAttendee)}/person
          </p>
        </div>
      </div>

      {meeting.notes && (
        <p className="text-sm text-slate-300 line-clamp-2">{meeting.notes}</p>
      )}
    </motion.div>
  );
};

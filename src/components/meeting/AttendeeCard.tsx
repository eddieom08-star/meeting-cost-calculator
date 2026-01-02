import React from 'react';
import { motion } from 'framer-motion';
import { Attendee } from '@/types/meeting';
import { ROLE_PRESETS } from '@/constants/roles';
import { formatHourlyRate } from '@/utils/formatters';
import { IconButton } from '@/components/ui';
import { cn } from '@/utils/cn';

interface AttendeeCardProps {
  attendee: Attendee;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
  isEditable?: boolean;
}

export const AttendeeCard: React.FC<AttendeeCardProps> = ({
  attendee,
  onRemove,
  onEdit,
  isEditable = true,
}) => {
  const rolePreset = ROLE_PRESETS.find(r => r.type === attendee.role);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={cn(
        'flex items-center justify-between',
        'bg-slate-800/50 rounded-lg px-4 py-3',
        'border border-slate-700/50',
        'group hover:border-slate-600 transition-colors'
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl" role="img" aria-hidden="true">
          {rolePreset?.icon ?? '👤'}
        </span>
        <div>
          <p className="text-white font-medium">
            {attendee.name || rolePreset?.label || 'Attendee'}
          </p>
          <p className="text-slate-400 text-sm">
            {formatHourlyRate(attendee.hourlyRate)}
            {attendee.isCustomRate && (
              <span className="ml-2 text-blue-400 text-xs">(custom)</span>
            )}
          </p>
        </div>
      </div>

      {isEditable && (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <IconButton
              variant="ghost"
              size="sm"
              label={`Edit ${attendee.name || rolePreset?.label}`}
              onClick={() => onEdit(attendee.id)}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </IconButton>
          )}
          <IconButton
            variant="ghost"
            size="sm"
            label={`Remove ${attendee.name || rolePreset?.label}`}
            onClick={() => onRemove(attendee.id)}
          >
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>
      )}
    </motion.div>
  );
};

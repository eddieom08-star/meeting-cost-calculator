import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAttendees, useMeetingStore } from '@/stores/meetingStore';
import { AttendeeCard } from './AttendeeCard';
import { getTotalHourlyRate, getCostPerMinute } from '@/utils/calculations';
import { formatCurrency } from '@/utils/formatters';
import { Card } from '@/components/ui';

interface AttendeeListProps {
  isEditable?: boolean;
}

export const AttendeeList: React.FC<AttendeeListProps> = ({ isEditable = true }) => {
  const attendees = useAttendees();
  const removeAttendee = useMeetingStore(state => state.removeAttendee);

  const totalHourlyRate = getTotalHourlyRate(attendees);
  const costPerMinute = getCostPerMinute(attendees);

  if (attendees.length === 0) {
    return (
      <Card variant="bordered" className="text-center py-8">
        <div className="text-slate-400">
          <div className="text-4xl mb-2">👥</div>
          <p>No attendees yet</p>
          <p className="text-sm mt-1">Add attendees to calculate meeting cost</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <div className="flex flex-wrap justify-between items-center gap-4 px-4 py-3 bg-slate-800/30 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-sm">
            {attendees.length} {attendees.length === 1 ? 'attendee' : 'attendees'}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-slate-400">Total: </span>
            <span className="text-white font-medium">{formatCurrency(totalHourlyRate)}/hr</span>
          </div>
          <div>
            <span className="text-slate-400">Burn rate: </span>
            <span className="text-amber-400 font-medium">{formatCurrency(costPerMinute)}/min</span>
          </div>
        </div>
      </div>

      {/* Attendee cards */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {attendees.map((attendee) => (
            <AttendeeCard
              key={attendee.id}
              attendee={attendee}
              onRemove={removeAttendee}
              isEditable={isEditable}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

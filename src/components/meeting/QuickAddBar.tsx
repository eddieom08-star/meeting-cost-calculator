import React from 'react';
import { RoleType } from '@/types/meeting';
import { ROLE_PRESETS } from '@/constants/roles';
import { useMeetingStore } from '@/stores/meetingStore';
import { Button } from '@/components/ui';

const QUICK_ADD_ROLES: RoleType[] = [
  'junior_engineer',
  'senior_engineer',
  'engineering_manager',
  'product_manager',
];

export const QuickAddBar: React.FC = () => {
  const addAttendee = useMeetingStore(state => state.addAttendee);

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-slate-400 text-sm self-center mr-2">Quick add:</span>
      {QUICK_ADD_ROLES.map((role) => {
        const preset = ROLE_PRESETS.find(p => p.type === role);
        if (!preset) return null;

        return (
          <Button
            key={role}
            variant="secondary"
            size="sm"
            onClick={() => addAttendee(role)}
          >
            {preset.icon} {preset.label}
          </Button>
        );
      })}
    </div>
  );
};

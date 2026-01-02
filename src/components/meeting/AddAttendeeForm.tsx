import React, { useState } from 'react';
import { RoleType } from '@/types/meeting';
import { ROLE_PRESETS, DEFAULT_ROLE } from '@/constants/roles';
import { Button, Select, NumberInput } from '@/components/ui';
import { useMeetingStore } from '@/stores/meetingStore';

interface AddAttendeeFormProps {
  onAdd?: () => void;
}

export const AddAttendeeForm: React.FC<AddAttendeeFormProps> = ({ onAdd }) => {
  const addAttendee = useMeetingStore(state => state.addAttendee);

  const [selectedRole, setSelectedRole] = useState<RoleType>(DEFAULT_ROLE);
  const [customRate, setCustomRate] = useState<number>(10000); // $100/hr in cents
  const [name, setName] = useState('');

  const isCustom = selectedRole === 'custom';
  const roleOptions = ROLE_PRESETS.map(preset => ({
    value: preset.type,
    label: preset.label,
    icon: preset.icon,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttendee(
      selectedRole,
      isCustom ? customRate : undefined,
      name.trim()
    );
    // Reset form
    setName('');
    setSelectedRole(DEFAULT_ROLE);
    setCustomRate(10000);
    onAdd?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Name (optional)
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., John Smith"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <Select
          label="Role"
          options={roleOptions}
          value={selectedRole}
          onChange={(value) => setSelectedRole(value as RoleType)}
        />
      </div>

      {isCustom && (
        <NumberInput
          label="Custom Hourly Rate"
          value={customRate / 100}
          onChange={(value) => setCustomRate(Math.round(value * 100))}
          prefix="$"
          suffix="/hr"
          min={0}
          step={5}
        />
      )}

      <Button type="submit" className="w-full md:w-auto">
        Add Attendee
      </Button>
    </form>
  );
};

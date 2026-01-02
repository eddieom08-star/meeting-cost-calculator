import { useState, useCallback, type FormEvent } from 'react'
import { Button, Input, Select } from '../ui'
import { ModalFooter } from '../ui/Modal'
import { useMeetingStore } from '../../store'
import { SALARY_PRESETS, ROLE_PRESETS, MIN_HOURLY_RATE, MAX_HOURLY_RATE } from '../../types'
import type { AttendeeFormData, AttendeeFormErrors, Attendee } from '../../types'
import { formatCurrency, clamp } from '../../utils'

interface AttendeeFormProps {
  initialData?: Attendee
  onClose: () => void
}

export const AttendeeForm = ({ initialData, onClose }: AttendeeFormProps) => {
  const addAttendee = useMeetingStore((state) => state.addAttendee)
  const updateAttendee = useMeetingStore((state) => state.updateAttendee)

  const [formData, setFormData] = useState<AttendeeFormData>({
    name: initialData?.name ?? '',
    hourlyRate: initialData?.hourlyRate ?? 75,
    role: initialData?.role ?? '',
  })

  const [errors, setErrors] = useState<AttendeeFormErrors>({})
  const [selectedPreset, setSelectedPreset] = useState('')

  const isEditing = Boolean(initialData)

  const validate = useCallback((): boolean => {
    const newErrors: AttendeeFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be 50 characters or less'
    }

    if (formData.hourlyRate < MIN_HOURLY_RATE) {
      newErrors.hourlyRate = `Hourly rate must be at least ${formatCurrency(MIN_HOURLY_RATE)}`
    } else if (formData.hourlyRate > MAX_HOURLY_RATE) {
      newErrors.hourlyRate = `Hourly rate must be ${formatCurrency(MAX_HOURLY_RATE)} or less`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault()

      if (!validate()) return

      if (isEditing && initialData) {
        updateAttendee(initialData.id, {
          name: formData.name.trim(),
          hourlyRate: formData.hourlyRate,
          role: formData.role?.trim() || undefined,
        })
      } else {
        addAttendee({
          name: formData.name.trim(),
          hourlyRate: formData.hourlyRate,
          role: formData.role?.trim() || undefined,
        })
      }

      onClose()
    },
    [formData, validate, isEditing, initialData, addAttendee, updateAttendee, onClose]
  )

  const handlePresetChange = useCallback((presetId: string) => {
    setSelectedPreset(presetId)
    const preset = SALARY_PRESETS.find((p) => p.id === presetId)
    if (preset) {
      setFormData((prev) => ({
        ...prev,
        hourlyRate: preset.hourlyRate,
      }))
    }
  }, [])

  const handleRoleChange = useCallback((roleId: string) => {
    const role = ROLE_PRESETS.find((r) => r.id === roleId)
    if (role) {
      setFormData((prev) => ({
        ...prev,
        role: role.role,
        hourlyRate: role.defaultHourlyRate,
      }))
    }
  }, [])

  const presetOptions = SALARY_PRESETS.map((p) => ({
    value: p.id,
    label: `${p.label} - ${formatCurrency(p.hourlyRate)}/hr`,
  }))

  const roleOptions = ROLE_PRESETS.map((r) => ({
    value: r.id,
    label: r.role,
  }))

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter attendee name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          error={errors.name}
          autoFocus
        />

        <Select
          label="Role (Optional)"
          options={roleOptions}
          value=""
          onChange={(e) => handleRoleChange(e.target.value)}
          placeholder="Select a role preset..."
        />

        {formData.role && (
          <Input
            label="Custom Role"
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
          />
        )}

        <Select
          label="Salary Preset"
          options={presetOptions}
          value={selectedPreset}
          onChange={(e) => handlePresetChange(e.target.value)}
          placeholder="Select a salary preset..."
        />

        <Input
          label="Hourly Rate"
          type="number"
          min={MIN_HOURLY_RATE}
          max={MAX_HOURLY_RATE}
          step="1"
          value={formData.hourlyRate}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              hourlyRate: clamp(
                Number(e.target.value),
                MIN_HOURLY_RATE,
                MAX_HOURLY_RATE
              ),
            }))
          }
          error={errors.hourlyRate}
          leftAddon="$"
          rightAddon="/hr"
        />

        <div className="text-sm text-gray-400">
          Annual equivalent: {formatCurrency(formData.hourlyRate * 2080)}
        </div>
      </div>

      <ModalFooter>
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Update' : 'Add'} Attendee
        </Button>
      </ModalFooter>
    </form>
  )
}

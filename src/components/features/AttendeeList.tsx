import { useMeetingStore, selectAttendees, selectMeetingStatus } from '../../store'
import { Button, Card, CardHeader } from '../ui'
import { formatCurrency, formatHourlyRate } from '../../utils'
import type { Attendee } from '../../types'

interface AttendeeListProps {
  onAddClick: () => void
  onEditClick: (attendee: Attendee) => void
}

export const AttendeeList = ({ onAddClick, onEditClick }: AttendeeListProps) => {
  const attendees = useMeetingStore(selectAttendees)
  const status = useMeetingStore(selectMeetingStatus)
  const removeAttendee = useMeetingStore((state) => state.removeAttendee)

  const canModify = status === 'idle' || status === 'completed'
  const totalHourlyRate = attendees.reduce((sum, a) => sum + a.hourlyRate, 0)

  return (
    <Card>
      <CardHeader
        title="Attendees"
        description={`${attendees.length} attendee${attendees.length !== 1 ? 's' : ''}`}
        action={
          canModify && (
            <Button size="sm" onClick={onAddClick}>
              + Add
            </Button>
          )
        }
      />

      {attendees.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500 mb-4">No attendees added yet</p>
          {canModify && (
            <Button onClick={onAddClick}>Add First Attendee</Button>
          )}
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-800">
            {attendees.map((attendee) => (
              <AttendeeItem
                key={attendee.id}
                attendee={attendee}
                canModify={canModify}
                onEdit={() => onEditClick(attendee)}
                onRemove={() => removeAttendee(attendee.id)}
              />
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-gray-400">Combined Rate</span>
            <span className="text-lg font-semibold text-gray-100">
              {formatHourlyRate(totalHourlyRate)}
            </span>
          </div>
        </>
      )}
    </Card>
  )
}

interface AttendeeItemProps {
  attendee: Attendee
  canModify: boolean
  onEdit: () => void
  onRemove: () => void
}

const AttendeeItem = ({
  attendee,
  canModify,
  onEdit,
  onRemove,
}: AttendeeItemProps) => {
  return (
    <li className="py-3 flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-100 truncate">
            {attendee.name}
          </span>
          {attendee.role && (
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
              {attendee.role}
            </span>
          )}
        </div>
        <div className="text-sm text-gray-400">
          {formatHourlyRate(attendee.hourlyRate)}
        </div>
      </div>

      {canModify && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            aria-label={`Edit ${attendee.name}`}
          >
            <EditIcon />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onRemove}
            aria-label={`Remove ${attendee.name}`}
          >
            <TrashIcon />
          </Button>
        </div>
      )}
    </li>
  )
}

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-4 w-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

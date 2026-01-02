import {
  useMeetingStore,
  selectCanStart,
  selectCanPause,
  selectCanResume,
  selectCanStop,
  selectMeetingStatus,
  selectAttendees,
} from '../../store'
import { Button, Card } from '../ui'
import { cn } from '../../utils'

export const MeetingControls = () => {
  const status = useMeetingStore(selectMeetingStatus)
  const attendees = useMeetingStore(selectAttendees)
  const canStart = useMeetingStore(selectCanStart)
  const canPause = useMeetingStore(selectCanPause)
  const canResume = useMeetingStore(selectCanResume)
  const canStop = useMeetingStore(selectCanStop)

  const startMeeting = useMeetingStore((state) => state.startMeeting)
  const pauseMeeting = useMeetingStore((state) => state.pauseMeeting)
  const resumeMeeting = useMeetingStore((state) => state.resumeMeeting)
  const stopMeeting = useMeetingStore((state) => state.stopMeeting)
  const resetMeeting = useMeetingStore((state) => state.resetMeeting)

  const hasAttendees = attendees.length > 0

  return (
    <Card padding="md">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Primary action button */}
        {canStart && (
          <Button
            size="lg"
            onClick={startMeeting}
            disabled={!hasAttendees}
            leftIcon={<PlayIcon />}
            className="min-w-[140px]"
          >
            Start
          </Button>
        )}

        {canPause && (
          <Button
            size="lg"
            variant="secondary"
            onClick={pauseMeeting}
            leftIcon={<PauseIcon />}
            className="min-w-[140px]"
          >
            Pause
          </Button>
        )}

        {canResume && (
          <Button
            size="lg"
            onClick={resumeMeeting}
            leftIcon={<PlayIcon />}
            className="min-w-[140px]"
          >
            Resume
          </Button>
        )}

        {/* Stop button */}
        {canStop && (
          <Button
            size="lg"
            variant="danger"
            onClick={stopMeeting}
            leftIcon={<StopIcon />}
            className="min-w-[140px]"
          >
            Stop
          </Button>
        )}

        {/* Reset button */}
        <Button
          size="lg"
          variant="ghost"
          onClick={resetMeeting}
          leftIcon={<ResetIcon />}
        >
          Reset
        </Button>
      </div>

      {/* Status indicator */}
      <div className="mt-4 flex justify-center">
        <StatusBadge status={status} />
      </div>

      {/* Keyboard hints */}
      <div className="mt-3 text-center text-xs text-gray-600">
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
            Space
          </kbd>
          <span>to start/pause</span>
        </span>
        <span className="mx-2">|</span>
        <span className="inline-flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">
            Esc
          </kbd>
          <span>to stop</span>
        </span>
      </div>
    </Card>
  )
}

interface StatusBadgeProps {
  status: 'idle' | 'running' | 'paused' | 'completed'
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = {
    idle: { label: 'Ready', color: 'bg-gray-700 text-gray-300' },
    running: { label: 'Running', color: 'bg-green-900 text-green-400' },
    paused: { label: 'Paused', color: 'bg-yellow-900 text-yellow-400' },
    completed: { label: 'Completed', color: 'bg-primary-900 text-primary-400' },
  }

  const { label, color } = config[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
        color
      )}
    >
      {status === 'running' && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
      )}
      {label}
    </span>
  )
}

const PlayIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
)

const PauseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
  </svg>
)

const StopIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M6 6h12v12H6z" />
  </svg>
)

const ResetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
)

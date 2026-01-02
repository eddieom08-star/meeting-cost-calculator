import { useMeetingStore, selectHistory } from '../../store'
import { Button, Card, CardHeader } from '../ui'
import { formatCurrency, formatDurationHuman, formatDateTime } from '../../utils'
import type { MeetingSummary } from '../../types'

export const MeetingHistory = () => {
  const history = useMeetingStore(selectHistory)
  const clearHistory = useMeetingStore((state) => state.clearHistory)

  if (history.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader
        title="Meeting History"
        description={`${history.length} past meeting${history.length !== 1 ? 's' : ''}`}
        action={
          <Button size="sm" variant="ghost" onClick={clearHistory}>
            Clear
          </Button>
        }
      />
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {history.map((meeting) => (
          <HistoryItem key={meeting.meetingId} meeting={meeting} />
        ))}
      </div>
    </Card>
  )
}

interface HistoryItemProps {
  meeting: MeetingSummary
}

const HistoryItem = ({ meeting }: HistoryItemProps) => {
  return (
    <div className="p-3 bg-gray-800/50 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-200">{meeting.title}</h4>
          <p className="text-xs text-gray-500">{formatDateTime(meeting.timestamp)}</p>
        </div>
        <span className="text-lg font-semibold text-primary-400 tabular-nums">
          {formatCurrency(meeting.totalCost)}
        </span>
      </div>
      <div className="flex gap-4 text-xs text-gray-500">
        <span>{formatDurationHuman(meeting.duration)}</span>
        <span>{meeting.attendeeCount} attendee{meeting.attendeeCount !== 1 ? 's' : ''}</span>
      </div>
    </div>
  )
}

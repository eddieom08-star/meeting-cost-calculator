import { useMemo, useCallback, useState } from 'react'
import { useMeetingStore, selectMeeting } from '../../store'
import { Button, Card, CardHeader } from '../ui'
import { ModalFooter } from '../ui/Modal'
import {
  formatCurrency,
  formatDurationHuman,
  formatDateTime,
  secondsToDuration,
  calculateCostBreakdown,
  calculateAverageCostPerAttendee,
} from '../../utils'
import { exportMeetingSummary, copyToClipboard } from '../../utils/export'
import type { MeetingSummary as MeetingSummaryType, ExportFormat } from '../../types'

interface MeetingSummaryProps {
  onClose: () => void
}

export const MeetingSummary = ({ onClose }: MeetingSummaryProps) => {
  const meeting = useMeetingStore(selectMeeting)
  const [copied, setCopied] = useState(false)

  const summary: MeetingSummaryType = useMemo(() => {
    const costBreakdown = calculateCostBreakdown(
      meeting.attendees,
      meeting.elapsedSeconds
    )
    const duration = secondsToDuration(meeting.elapsedSeconds)

    return {
      meetingId: meeting.id,
      title: meeting.title,
      duration,
      totalCost: costBreakdown.totalCost,
      attendeeCount: meeting.attendees.length,
      averageCostPerAttendee: calculateAverageCostPerAttendee(
        costBreakdown.totalCost,
        meeting.attendees.length
      ),
      costBreakdown,
      timestamp: meeting.endTime ?? Date.now(),
    }
  }, [meeting])

  const handleExport = useCallback(
    (format: ExportFormat) => {
      exportMeetingSummary(summary, format)
    },
    [summary]
  )

  const handleCopy = useCallback(async () => {
    const success = await copyToClipboard(summary)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [summary])

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Total Cost" value={formatCurrency(summary.totalCost)} highlight />
        <StatCard label="Duration" value={formatDurationHuman(summary.duration)} />
        <StatCard label="Attendees" value={summary.attendeeCount.toString()} />
        <StatCard
          label="Avg Cost/Person"
          value={formatCurrency(summary.averageCostPerAttendee)}
        />
      </div>

      {/* Breakdown */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Cost Breakdown</h3>
        <div className="space-y-2">
          {summary.costBreakdown.attendeeCosts.map((attendee) => (
            <div
              key={attendee.attendeeId}
              className="flex justify-between items-center py-2 border-b border-gray-800 last:border-0"
            >
              <span className="text-gray-300">{attendee.name}</span>
              <span className="text-gray-100 font-medium tabular-nums">
                {formatCurrency(attendee.totalCost)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export options */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 mb-3">Export</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => handleExport('json')}>
            JSON
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleExport('csv')}>
            CSV
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleExport('pdf')}>
            PDF
          </Button>
          <Button size="sm" variant="secondary" onClick={handleCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </div>
  )
}

interface StatCardProps {
  label: string
  value: string
  highlight?: boolean
}

const StatCard = ({ label, value, highlight }: StatCardProps) => (
  <div className="bg-gray-800/50 rounded-lg p-4 text-center">
    <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
      {label}
    </div>
    <div
      className={`text-xl font-semibold tabular-nums ${
        highlight ? 'text-primary-400' : 'text-gray-200'
      }`}
    >
      {value}
    </div>
  </div>
)

import { useCostBreakdown } from '../../hooks'
import { formatCurrency, formatPercentage } from '../../utils'
import { Card, CardHeader } from '../ui'

export const CostBreakdown = () => {
  const breakdown = useCostBreakdown()

  if (breakdown.attendeeCosts.length === 0) {
    return null
  }

  const totalCost = breakdown.totalCost

  return (
    <Card>
      <CardHeader
        title="Cost Breakdown"
        description="Cost per attendee"
      />
      <div className="space-y-3">
        {breakdown.attendeeCosts.map((attendee) => {
          const percentage = totalCost > 0 ? attendee.totalCost / totalCost : 0

          return (
            <div key={attendee.attendeeId} className="space-y-1">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">{attendee.name}</span>
                <span className="text-gray-400 tabular-nums">
                  {formatCurrency(attendee.totalCost)}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: `${percentage * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatCurrency(attendee.hourlyRate)}/hr</span>
                <span>{formatPercentage(percentage)}</span>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center">
        <span className="font-medium text-gray-300">Total</span>
        <span className="text-lg font-semibold text-gray-100 tabular-nums">
          {formatCurrency(totalCost)}
        </span>
      </div>
    </Card>
  )
}

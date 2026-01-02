import { useProjectedCosts } from '../../hooks'
import { formatCurrency } from '../../utils'
import { Card, CardHeader } from '../ui'

export const ProjectedCosts = () => {
  const projections = useProjectedCosts()

  const items = [
    { label: '15 min', value: projections.per15Min },
    { label: '30 min', value: projections.per30Min },
    { label: '1 hour', value: projections.per1Hour },
    { label: '2 hours', value: projections.per2Hours },
  ]

  return (
    <Card>
      <CardHeader
        title="Projected Costs"
        description="Estimated cost based on current attendees"
      />
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="bg-gray-800/50 rounded-lg p-3 text-center"
          >
            <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
              {item.label}
            </div>
            <div className="text-lg font-semibold text-gray-200">
              {formatCurrency(item.value)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

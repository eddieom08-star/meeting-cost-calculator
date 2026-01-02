import { useCost, useCostThresholdStyle, useFormattedTime } from '../../hooks'
import { formatCurrency, formatHourlyRate, cn } from '../../utils'
import { Card } from '../ui'

export const CostDisplay = () => {
  const { totalCost, burnRate, threshold } = useCost()
  const { textClass } = useCostThresholdStyle(threshold)
  const { formatted: timeFormatted } = useFormattedTime()

  return (
    <Card className="text-center" padding="lg">
      {/* Main cost display */}
      <div className="mb-6">
        <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">
          Meeting Cost
        </div>
        <div
          className={cn(
            'text-6xl md:text-7xl font-mono font-bold tabular-nums tracking-tight',
            textClass
          )}
        >
          <AnimatedCurrency value={totalCost} />
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="text-sm uppercase tracking-wider text-gray-500 mb-1">
          Duration
        </div>
        <div className="text-3xl font-mono text-gray-300 tabular-nums">
          {timeFormatted}
        </div>
      </div>

      {/* Burn rate */}
      <div className="flex justify-center gap-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Burn Rate
          </div>
          <div className="text-lg font-semibold text-gray-300">
            {formatCurrency(burnRate)}/min
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">
            Combined Rate
          </div>
          <div className="text-lg font-semibold text-gray-300">
            {formatHourlyRate(burnRate * 60)}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface AnimatedCurrencyProps {
  value: number
}

const AnimatedCurrency = ({ value }: AnimatedCurrencyProps) => {
  const formatted = formatCurrency(value, { minimumFractionDigits: 2 })
  const symbol = formatted.charAt(0)
  const [dollars, cents] = formatted.slice(1).split('.')

  return (
    <span className="inline-flex items-baseline">
      <span className="text-4xl md:text-5xl opacity-80">{symbol}</span>
      <span>{dollars}</span>
      <span className="text-3xl md:text-4xl opacity-70">.{cents}</span>
    </span>
  )
}

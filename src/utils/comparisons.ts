import { COST_COMPARISONS } from '@/constants/thresholds'

/**
 * Get a fun comparison for the current cost
 * @param costCents - Current cost in cents
 * @returns Human-readable comparison string
 */
export function getCostComparison(costCents: number): string {
  // Find the most appropriate comparison (aim for reasonable numbers)
  const sorted = [...COST_COMPARISONS].sort(
    (a, b) => b.unitCostCents - a.unitCostCents
  )

  for (const comparison of sorted) {
    const count = Math.floor(costCents / comparison.unitCostCents)
    if (count >= 1 && count <= 1000) {
      const label = count === 1 ? comparison.singular : comparison.plural
      return `${count} ${label} ${comparison.emoji}`
    }
  }

  // Fallback to coffee
  const coffee = COST_COMPARISONS[0]
  if (!coffee) return ''
  const count = Math.floor(costCents / coffee.unitCostCents)
  return `${count} ${coffee.plural} ${coffee.emoji}`
}

/**
 * Get multiple comparisons for display
 */
export function getAllComparisons(
  costCents: number
): Array<{ text: string; count: number }> {
  return COST_COMPARISONS.map((comparison) => {
    const count = Math.floor(costCents / comparison.unitCostCents)
    const label = count === 1 ? comparison.singular : comparison.plural
    return {
      text: `${count} ${label} ${comparison.emoji}`,
      count,
    }
  }).filter((c) => c.count > 0)
}

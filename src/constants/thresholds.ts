import type { CostThreshold, CostComparison } from '@/types/meeting'

// Cost in cents
export const COST_THRESHOLDS: CostThreshold[] = [
  { min: 0, max: 50000, level: 'low', color: 'var(--color-cost-low)' },
  { min: 50000, max: 200000, level: 'medium', color: 'var(--color-cost-medium)' },
  { min: 200000, max: Infinity, level: 'high', color: 'var(--color-cost-high)' },
]

export const COST_COMPARISONS: CostComparison[] = [
  { unitCostCents: 500, singular: 'cup of coffee', plural: 'cups of coffee', emoji: '☕' },
  { unitCostCents: 1500, singular: 'pizza', plural: 'pizzas', emoji: '🍕' },
  { unitCostCents: 1000, singular: 'Spotify subscription', plural: 'Spotify subscriptions', emoji: '🎵' },
  { unitCostCents: 2500, singular: 'support ticket', plural: 'support tickets', emoji: '🎫' },
  { unitCostCents: 5000, singular: 'hour of dev time', plural: 'hours of dev time', emoji: '⌨️' },
]

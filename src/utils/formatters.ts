import { CURRENCY_CONFIG } from '@/constants/app'

/**
 * Format cents as currency string
 * @param cents - Amount in cents
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(cents: number): string {
  const dollars = cents / 100
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
    minimumFractionDigits: CURRENCY_CONFIG.minimumFractionDigits,
    maximumFractionDigits: CURRENCY_CONFIG.maximumFractionDigits,
  }).format(dollars)
}

/**
 * Format cents as compact currency (e.g., "$1.2K")
 */
export function formatCurrencyCompact(cents: number): string {
  const dollars = cents / 100
  if (dollars < 1000) return formatCurrency(cents)

  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, {
    style: 'currency',
    currency: CURRENCY_CONFIG.currency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(dollars)
}

/**
 * Format milliseconds as HH:MM:SS
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds]
    .map((n) => n.toString().padStart(2, '0'))
    .join(':')
}

/**
 * Format milliseconds as human readable (e.g., "1h 23m")
 */
export function formatDurationHuman(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  return `${hours}h ${minutes}m`
}

/**
 * Format hourly rate for display
 */
export function formatHourlyRate(cents: number): string {
  return `${formatCurrency(cents)}/hr`
}

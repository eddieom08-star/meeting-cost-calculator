import type { Attendee } from '@/types/meeting'

/**
 * Calculate the total hourly rate for all attendees
 * @returns Total rate in cents per hour
 */
export function getTotalHourlyRate(attendees: Attendee[]): number {
  return attendees.reduce((sum, attendee) => sum + attendee.hourlyRate, 0)
}

/**
 * Calculate cost per second for all attendees
 * @returns Cost in cents per second
 */
export function getCostPerSecond(attendees: Attendee[]): number {
  const hourlyRate = getTotalHourlyRate(attendees)
  return hourlyRate / 3600
}

/**
 * Calculate cost per minute for all attendees
 * @returns Cost in cents per minute
 */
export function getCostPerMinute(attendees: Attendee[]): number {
  const hourlyRate = getTotalHourlyRate(attendees)
  return hourlyRate / 60
}

/**
 * Calculate current meeting cost based on elapsed time
 * @param attendees - List of meeting attendees
 * @param startTime - Unix timestamp when meeting started (ms)
 * @param totalPausedDuration - Total time paused in ms
 * @param currentTime - Current time (defaults to Date.now())
 * @returns Cost in cents
 */
export function calculateCurrentCost(
  attendees: Attendee[],
  startTime: number,
  totalPausedDuration: number,
  currentTime: number = Date.now()
): number {
  if (!startTime || attendees.length === 0) return 0

  const elapsedMs = currentTime - startTime - totalPausedDuration
  const elapsedSeconds = Math.max(0, elapsedMs / 1000)
  const costPerSecond = getCostPerSecond(attendees)

  return Math.round(elapsedSeconds * costPerSecond)
}

/**
 * Calculate elapsed active time (excluding pauses)
 * @returns Elapsed time in milliseconds
 */
export function calculateElapsedTime(
  startTime: number | null,
  totalPausedDuration: number,
  pausedAt: number | null,
  currentTime: number = Date.now()
): number {
  if (!startTime) return 0

  // If currently paused, use pausedAt as the reference
  const endReference = pausedAt ?? currentTime
  const elapsed = endReference - startTime - totalPausedDuration

  return Math.max(0, elapsed)
}

/**
 * Determine cost level based on thresholds
 */
export function getCostLevel(costCents: number): 'low' | 'medium' | 'high' {
  if (costCents < 50000) return 'low' // < $500
  if (costCents < 200000) return 'medium' // < $2000
  return 'high'
}

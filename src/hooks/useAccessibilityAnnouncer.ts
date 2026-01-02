import { useEffect, useRef } from 'react'
import { formatCurrency, formatDurationHuman } from '@/utils/formatters'
import { APP_CONFIG } from '@/constants/app'

/**
 * Announces meeting cost periodically for screen reader users
 */
export function useAccessibilityAnnouncer(
  isRunning: boolean,
  currentCostCents: number,
  elapsedTimeMs: number
) {
  const announcerRef = useRef<HTMLDivElement | null>(null)
  const lastAnnouncementRef = useRef<number>(0)

  useEffect(() => {
    // Create announcer element if it doesn't exist
    if (!announcerRef.current) {
      const announcer = document.createElement('div')
      announcer.setAttribute('role', 'status')
      announcer.setAttribute('aria-live', 'polite')
      announcer.setAttribute('aria-atomic', 'true')
      announcer.className = 'sr-only'
      document.body.appendChild(announcer)
      announcerRef.current = announcer
    }

    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current)
        announcerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!isRunning || !announcerRef.current) return

    const now = Date.now()
    if (now - lastAnnouncementRef.current >= APP_CONFIG.announcementInterval) {
      const message = `Meeting cost: ${formatCurrency(currentCostCents)}. Duration: ${formatDurationHuman(elapsedTimeMs)}.`
      announcerRef.current.textContent = message
      lastAnnouncementRef.current = now
    }
  }, [isRunning, currentCostCents, elapsedTimeMs])
}

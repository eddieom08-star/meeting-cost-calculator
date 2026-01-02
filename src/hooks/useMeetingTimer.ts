import { useState, useEffect, useRef, useCallback } from 'react'
import {
  useMeetingTiming,
  useMeetingStatus,
  useAttendees,
} from '@/stores/meetingStore'
import {
  calculateCurrentCost,
  calculateElapsedTime,
  getCostPerSecond,
} from '@/utils/calculations'
import { APP_CONFIG } from '@/constants/app'

interface MeetingTimerState {
  elapsedTime: number // in milliseconds
  currentCost: number // in cents
  costPerSecond: number // in cents
  isActive: boolean
}

export function useMeetingTimer(): MeetingTimerState {
  const status = useMeetingStatus()
  const timing = useMeetingTiming()
  const attendees = useAttendees()

  const [state, setState] = useState<MeetingTimerState>({
    elapsedTime: 0,
    currentCost: 0,
    costPerSecond: 0,
    isActive: false,
  })

  const rafRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)

  const updateState = useCallback(() => {
    const now = Date.now()

    // Throttle updates to every 100ms for performance
    if (now - lastUpdateRef.current < APP_CONFIG.timerUpdateInterval) {
      rafRef.current = requestAnimationFrame(updateState)
      return
    }
    lastUpdateRef.current = now

    const elapsedTime = calculateElapsedTime(
      timing.startTime,
      timing.totalPausedDuration,
      timing.pausedAt,
      now
    )

    const currentCost = timing.startTime
      ? calculateCurrentCost(
          attendees,
          timing.startTime,
          timing.totalPausedDuration,
          now
        )
      : 0

    setState({
      elapsedTime,
      currentCost,
      costPerSecond: getCostPerSecond(attendees),
      isActive: status === 'running',
    })

    if (status === 'running') {
      rafRef.current = requestAnimationFrame(updateState)
    }
  }, [timing, attendees, status])

  useEffect(() => {
    if (status === 'running') {
      rafRef.current = requestAnimationFrame(updateState)
    } else {
      // Still update once for paused/completed state
      updateState()
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [status, updateState])

  return state
}

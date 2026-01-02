import { useMemo } from 'react'
import { useAttendees } from '@/stores/meetingStore'
import {
  getTotalHourlyRate,
  getCostPerMinute,
  getCostLevel,
} from '@/utils/calculations'
import { getCostComparison, getAllComparisons } from '@/utils/comparisons'

interface MeetingCostInfo {
  totalHourlyRate: number // cents
  costPerMinute: number // cents
  costLevel: 'low' | 'medium' | 'high'
  comparison: string
  allComparisons: Array<{ text: string; count: number }>
}

export function useMeetingCost(currentCostCents: number): MeetingCostInfo {
  const attendees = useAttendees()

  return useMemo(
    () => ({
      totalHourlyRate: getTotalHourlyRate(attendees),
      costPerMinute: getCostPerMinute(attendees),
      costLevel: getCostLevel(currentCostCents),
      comparison: getCostComparison(currentCostCents),
      allComparisons: getAllComparisons(currentCostCents),
    }),
    [attendees, currentCostCents]
  )
}

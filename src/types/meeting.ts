// Attendee role enumeration
export type RoleType =
  | 'junior_engineer'
  | 'senior_engineer'
  | 'engineering_manager'
  | 'product_manager'
  | 'designer'
  | 'director'
  | 'vp'
  | 'c_suite'
  | 'custom'

// Meeting status state machine
export type MeetingStatus = 'setup' | 'running' | 'paused' | 'completed'

// Single attendee
export interface Attendee {
  id: string
  name: string // Optional display name, can be empty
  role: RoleType
  hourlyRate: number // Always in cents to avoid floating point issues
  isCustomRate: boolean
}

// Meeting state
export interface Meeting {
  id: string
  title: string
  attendees: Attendee[]
  startTime: number | null // Unix timestamp when started
  pausedAt: number | null // Unix timestamp when paused
  totalPausedDuration: number // Accumulated pause time in ms
  status: MeetingStatus
  createdAt: number
  completedAt: number | null
}

// Meeting summary for completed meetings
export interface MeetingSummary {
  meetingId: string
  title: string
  totalCost: number // In cents
  duration: number // In milliseconds
  attendeeCount: number
  averageCostPerMinute: number
  completedAt: number
}

// Role preset configuration
export interface RolePreset {
  type: RoleType
  label: string
  hourlyRateCents: number // Store in cents
  icon: string // Emoji or icon identifier
}

// Cost threshold for color coding
export interface CostThreshold {
  min: number
  max: number
  level: 'low' | 'medium' | 'high'
  color: string
}

// Fun comparison for cost display
export interface CostComparison {
  unitCostCents: number
  singular: string
  plural: string
  emoji: string
}

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'
import type { Meeting, Attendee, MeetingStatus, RoleType } from '@/types/meeting'
import { ROLE_PRESETS, DEFAULT_ROLE } from '@/constants/roles'
import { APP_CONFIG } from '@/constants/app'
import { generateId } from '@/utils/ids'

interface MeetingState {
  // Current meeting
  meeting: Meeting

  // Computed helpers (not persisted, derived)
  isRunning: boolean
  isPaused: boolean
  canStart: boolean
}

interface MeetingActions {
  // Attendee management
  addAttendee: (role: RoleType, customRate?: number, name?: string) => void
  removeAttendee: (id: string) => void
  updateAttendee: (id: string, updates: Partial<Omit<Attendee, 'id'>>) => void
  clearAttendees: () => void

  // Meeting lifecycle
  setTitle: (title: string) => void
  startMeeting: () => void
  pauseMeeting: () => void
  resumeMeeting: () => void
  endMeeting: () => void
  resetMeeting: () => void

  // Quick actions
  addQuickAttendees: (roles: RoleType[]) => void
}

type MeetingStore = MeetingState & MeetingActions

function createEmptyMeeting(): Meeting {
  return {
    id: generateId(),
    title: '',
    attendees: [],
    startTime: null,
    pausedAt: null,
    totalPausedDuration: 0,
    status: 'setup',
    createdAt: Date.now(),
    completedAt: null,
  }
}

function getRateForRole(role: RoleType, customRate?: number): number {
  if (role === 'custom' && customRate !== undefined) {
    return customRate
  }
  const preset = ROLE_PRESETS.find((p) => p.type === role)
  const defaultPreset = ROLE_PRESETS.find((p) => p.type === DEFAULT_ROLE)
  return preset?.hourlyRateCents ?? defaultPreset?.hourlyRateCents ?? 9500
}

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      // Initial state
      meeting: createEmptyMeeting(),

      // Computed (derived from state)
      get isRunning() {
        return get().meeting.status === 'running'
      },
      get isPaused() {
        return get().meeting.status === 'paused'
      },
      get canStart() {
        return (
          get().meeting.attendees.length > 0 && get().meeting.status === 'setup'
        )
      },

      // Attendee actions
      addAttendee: (role, customRate, name = '') => {
        const { meeting } = get()
        if (meeting.attendees.length >= APP_CONFIG.maxAttendees) return

        const newAttendee: Attendee = {
          id: generateId(),
          name,
          role,
          hourlyRate: getRateForRole(role, customRate),
          isCustomRate: role === 'custom',
        }

        set({
          meeting: {
            ...meeting,
            attendees: [...meeting.attendees, newAttendee],
          },
        })
      },

      removeAttendee: (id) => {
        const { meeting } = get()
        set({
          meeting: {
            ...meeting,
            attendees: meeting.attendees.filter((a) => a.id !== id),
          },
        })
      },

      updateAttendee: (id, updates) => {
        const { meeting } = get()
        set({
          meeting: {
            ...meeting,
            attendees: meeting.attendees.map((a) =>
              a.id === id ? { ...a, ...updates } : a
            ),
          },
        })
      },

      clearAttendees: () => {
        const { meeting } = get()
        set({
          meeting: {
            ...meeting,
            attendees: [],
          },
        })
      },

      // Meeting lifecycle
      setTitle: (title) => {
        set({
          meeting: {
            ...get().meeting,
            title,
          },
        })
      },

      startMeeting: () => {
        const { meeting } = get()
        if (meeting.attendees.length === 0) return
        if (meeting.status !== 'setup') return

        set({
          meeting: {
            ...meeting,
            status: 'running',
            startTime: Date.now(),
          },
        })
      },

      pauseMeeting: () => {
        const { meeting } = get()
        if (meeting.status !== 'running') return

        set({
          meeting: {
            ...meeting,
            status: 'paused',
            pausedAt: Date.now(),
          },
        })
      },

      resumeMeeting: () => {
        const { meeting } = get()
        if (meeting.status !== 'paused' || !meeting.pausedAt) return

        const additionalPauseDuration = Date.now() - meeting.pausedAt

        set({
          meeting: {
            ...meeting,
            status: 'running',
            pausedAt: null,
            totalPausedDuration:
              meeting.totalPausedDuration + additionalPauseDuration,
          },
        })
      },

      endMeeting: () => {
        const { meeting } = get()
        if (meeting.status === 'setup' || meeting.status === 'completed') return

        // If paused, add final pause duration
        let finalPausedDuration = meeting.totalPausedDuration
        if (meeting.status === 'paused' && meeting.pausedAt) {
          finalPausedDuration += Date.now() - meeting.pausedAt
        }

        set({
          meeting: {
            ...meeting,
            status: 'completed',
            completedAt: Date.now(),
            pausedAt: null,
            totalPausedDuration: finalPausedDuration,
          },
        })
      },

      resetMeeting: () => {
        set({
          meeting: createEmptyMeeting(),
        })
      },

      // Quick actions
      addQuickAttendees: (roles) => {
        const { addAttendee } = get()
        roles.forEach((role) => addAttendee(role))
      },
    }),
    {
      name: APP_CONFIG.storageKeys.meeting,
      partialize: (state) => ({ meeting: state.meeting }),
    }
  )
)

// Selector hooks for optimized renders
export const useAttendees = () =>
  useMeetingStore((state) => state.meeting.attendees)
export const useMeetingStatus = () =>
  useMeetingStore((state) => state.meeting.status)
export const useMeetingTiming = () =>
  useMeetingStore(
    useShallow((state) => ({
      startTime: state.meeting.startTime,
      pausedAt: state.meeting.pausedAt,
      totalPausedDuration: state.meeting.totalPausedDuration,
    }))
  )

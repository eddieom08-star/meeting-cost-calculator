import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Attendee, Meeting, MeetingStatus, MeetingSummary, ModalState, ModalType } from '../types'
import { generateId, safeLocalStorage } from '../utils'
import { calculateCostBreakdown, secondsToDuration, calculateAverageCostPerAttendee } from '../utils'
import { LOCAL_STORAGE_KEYS, MAX_ATTENDEES } from '../types'

// ============================================================================
// Store Types
// ============================================================================

interface MeetingState {
  // Meeting data
  meeting: Meeting

  // UI state
  modal: ModalState
  editingAttendeeId: string | null

  // History
  history: MeetingSummary[]
}

interface MeetingActions {
  // Attendee actions
  addAttendee: (attendee: Omit<Attendee, 'id'>) => void
  removeAttendee: (id: string) => void
  updateAttendee: (id: string, updates: Partial<Omit<Attendee, 'id'>>) => void
  clearAttendees: () => void

  // Meeting control actions
  startMeeting: () => void
  pauseMeeting: () => void
  resumeMeeting: () => void
  stopMeeting: () => void
  resetMeeting: () => void
  tick: (deltaSeconds: number) => void

  // UI actions
  openModal: (type: ModalType) => void
  closeModal: () => void
  setEditingAttendee: (id: string | null) => void

  // History actions
  addToHistory: (summary: MeetingSummary) => void
  clearHistory: () => void

  // Meeting metadata
  setMeetingTitle: (title: string) => void
}

type MeetingStore = MeetingState & MeetingActions

// ============================================================================
// Initial State
// ============================================================================

const createInitialMeeting = (): Meeting => ({
  id: generateId(),
  title: 'Untitled Meeting',
  attendees: [],
  startTime: null,
  endTime: null,
  elapsedSeconds: 0,
  status: 'idle',
})

const initialState: MeetingState = {
  meeting: createInitialMeeting(),
  modal: { isOpen: false, type: null },
  editingAttendeeId: null,
  history: [],
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useMeetingStore = create<MeetingStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================================================
      // Attendee Actions
      // ========================================================================

      addAttendee: (attendeeData) => {
        const { meeting } = get()
        if (meeting.attendees.length >= MAX_ATTENDEES) return

        const newAttendee: Attendee = {
          ...attendeeData,
          id: generateId(),
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

      // ========================================================================
      // Meeting Control Actions
      // ========================================================================

      startMeeting: () => {
        const { meeting } = get()
        if (meeting.status === 'running') return
        if (meeting.attendees.length === 0) return

        set({
          meeting: {
            ...meeting,
            status: 'running',
            startTime: meeting.startTime ?? Date.now(),
            endTime: null,
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
          },
        })
      },

      resumeMeeting: () => {
        const { meeting } = get()
        if (meeting.status !== 'paused') return

        set({
          meeting: {
            ...meeting,
            status: 'running',
          },
        })
      },

      stopMeeting: () => {
        const { meeting, addToHistory } = get()
        if (meeting.status === 'idle' || meeting.status === 'completed') return

        const endTime = Date.now()
        const costBreakdown = calculateCostBreakdown(
          meeting.attendees,
          meeting.elapsedSeconds
        )

        // Create summary for history
        const summary: MeetingSummary = {
          meetingId: meeting.id,
          title: meeting.title,
          duration: secondsToDuration(meeting.elapsedSeconds),
          totalCost: costBreakdown.totalCost,
          attendeeCount: meeting.attendees.length,
          averageCostPerAttendee: calculateAverageCostPerAttendee(
            costBreakdown.totalCost,
            meeting.attendees.length
          ),
          costBreakdown,
          timestamp: endTime,
        }

        set({
          meeting: {
            ...meeting,
            status: 'completed',
            endTime,
          },
        })

        addToHistory(summary)
      },

      resetMeeting: () => {
        set({
          meeting: createInitialMeeting(),
          editingAttendeeId: null,
        })
      },

      tick: (deltaSeconds) => {
        const { meeting } = get()
        if (meeting.status !== 'running') return

        set({
          meeting: {
            ...meeting,
            elapsedSeconds: meeting.elapsedSeconds + deltaSeconds,
          },
        })
      },

      // ========================================================================
      // UI Actions
      // ========================================================================

      openModal: (type) => {
        set({
          modal: { isOpen: true, type },
        })
      },

      closeModal: () => {
        set({
          modal: { isOpen: false, type: null },
          editingAttendeeId: null,
        })
      },

      setEditingAttendee: (id) => {
        set({ editingAttendeeId: id })
      },

      // ========================================================================
      // History Actions
      // ========================================================================

      addToHistory: (summary) => {
        const { history } = get()
        set({
          history: [summary, ...history].slice(0, 50), // Keep last 50
        })
      },

      clearHistory: () => {
        set({ history: [] })
      },

      // ========================================================================
      // Meeting Metadata
      // ========================================================================

      setMeetingTitle: (title) => {
        const { meeting } = get()
        set({
          meeting: {
            ...meeting,
            title,
          },
        })
      },
    }),
    {
      name: LOCAL_STORAGE_KEYS.MEETING_STATE,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        meeting: state.meeting,
        history: state.history,
      }),
    }
  )
)

// ============================================================================
// Selectors
// ============================================================================

export const selectMeeting = (state: MeetingStore) => state.meeting
export const selectAttendees = (state: MeetingStore) => state.meeting.attendees
export const selectMeetingStatus = (state: MeetingStore) => state.meeting.status
export const selectElapsedSeconds = (state: MeetingStore) => state.meeting.elapsedSeconds
export const selectModal = (state: MeetingStore) => state.modal
export const selectHistory = (state: MeetingStore) => state.history
export const selectIsRunning = (state: MeetingStore) => state.meeting.status === 'running'
export const selectIsPaused = (state: MeetingStore) => state.meeting.status === 'paused'
export const selectIsIdle = (state: MeetingStore) => state.meeting.status === 'idle'
export const selectIsCompleted = (state: MeetingStore) => state.meeting.status === 'completed'
export const selectCanStart = (state: MeetingStore) =>
  state.meeting.attendees.length > 0 &&
  (state.meeting.status === 'idle' || state.meeting.status === 'completed')
export const selectCanPause = (state: MeetingStore) => state.meeting.status === 'running'
export const selectCanResume = (state: MeetingStore) => state.meeting.status === 'paused'
export const selectCanStop = (state: MeetingStore) =>
  state.meeting.status === 'running' || state.meeting.status === 'paused'

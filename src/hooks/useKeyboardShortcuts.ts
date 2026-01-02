import { useEffect, useCallback } from 'react'
import { useMeetingStore } from '@/stores/meetingStore'

interface ShortcutHandlers {
  onToggleFullscreen?: () => void
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers = {}) {
  const { meeting, startMeeting, pauseMeeting, resumeMeeting } =
    useMeetingStore()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      // Space: Toggle start/pause
      if (event.code === 'Space' && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        if (meeting.status === 'setup' && meeting.attendees.length > 0) {
          startMeeting()
        } else if (meeting.status === 'running') {
          pauseMeeting()
        } else if (meeting.status === 'paused') {
          resumeMeeting()
        }
      }

      // R: Reset (with confirmation in actual usage)
      if (event.code === 'KeyR' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        // In real implementation, show confirmation first
      }

      // F: Toggle fullscreen
      if (event.code === 'KeyF' && !event.metaKey && !event.ctrlKey) {
        handlers.onToggleFullscreen?.()
      }

      // Escape: Exit fullscreen or close modals
      if (event.code === 'Escape') {
        // Handle escape
      }
    },
    [meeting, startMeeting, pauseMeeting, resumeMeeting, handlers]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

import { useCallback } from 'react'
import { useMeetingStore, selectModal, selectIsCompleted } from '../../store'
import { useTimer, useKeyboardShortcuts } from '../../hooks'
import { Modal, Button } from '../ui'
import { MeetingTitle } from './MeetingTitle'
import { CostDisplay } from './CostDisplay'
import { MeetingControls } from './MeetingControls'
import { AttendeeList } from './AttendeeList'
import { AttendeeForm } from './AttendeeForm'
import { ProjectedCosts } from './ProjectedCosts'
import { CostBreakdown } from './CostBreakdown'
import { MeetingSummary } from './MeetingSummary'
import { MeetingHistory } from './MeetingHistory'
import type { Attendee } from '../../types'

export const MeetingCalculator = () => {
  // Initialize timer and keyboard shortcuts
  useTimer()
  useKeyboardShortcuts()

  const modal = useMeetingStore(selectModal)
  const editingAttendeeId = useMeetingStore((state) => state.editingAttendeeId)
  const attendees = useMeetingStore((state) => state.meeting.attendees)
  const isCompleted = useMeetingStore(selectIsCompleted)
  const openModal = useMeetingStore((state) => state.openModal)
  const closeModal = useMeetingStore((state) => state.closeModal)
  const setEditingAttendee = useMeetingStore((state) => state.setEditingAttendee)

  const editingAttendee = editingAttendeeId
    ? attendees.find((a) => a.id === editingAttendeeId)
    : undefined

  const handleAddClick = useCallback(() => {
    openModal('addAttendee')
  }, [openModal])

  const handleEditClick = useCallback(
    (attendee: Attendee) => {
      setEditingAttendee(attendee.id)
      openModal('editAttendee')
    },
    [setEditingAttendee, openModal]
  )

  const handleCloseModal = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleSummaryClick = useCallback(() => {
    openModal('summary')
  }, [openModal])

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-8 text-center">
        <MeetingTitle />
        <p className="text-gray-500 mt-2">
          Track the real cost of your meetings
        </p>
        {isCompleted && (
          <Button
            className="mt-4"
            onClick={handleSummaryClick}
          >
            View Summary
          </Button>
        )}
      </header>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Cost display and controls */}
        <div className="lg:col-span-2 space-y-6">
          <CostDisplay />
          <MeetingControls />
          <CostBreakdown />
        </div>

        {/* Right column - Attendees and projections */}
        <div className="space-y-6">
          <AttendeeList
            onAddClick={handleAddClick}
            onEditClick={handleEditClick}
          />
          <ProjectedCosts />
          <MeetingHistory />
        </div>
      </div>

      {/* Add Attendee Modal */}
      <Modal
        isOpen={modal.isOpen && modal.type === 'addAttendee'}
        onClose={handleCloseModal}
        title="Add Attendee"
        description="Add a new person to the meeting"
      >
        <AttendeeForm onClose={handleCloseModal} />
      </Modal>

      {/* Edit Attendee Modal */}
      <Modal
        isOpen={modal.isOpen && modal.type === 'editAttendee'}
        onClose={handleCloseModal}
        title="Edit Attendee"
        description="Update attendee details"
      >
        {editingAttendee && (
          <AttendeeForm
            initialData={editingAttendee}
            onClose={handleCloseModal}
          />
        )}
      </Modal>

      {/* Summary Modal */}
      <Modal
        isOpen={modal.isOpen && modal.type === 'summary'}
        onClose={handleCloseModal}
        title="Meeting Summary"
        size="lg"
      >
        <MeetingSummary onClose={handleCloseModal} />
      </Modal>
    </div>
  )
}

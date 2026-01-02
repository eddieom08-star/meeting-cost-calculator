import { useState, useCallback, type KeyboardEvent } from 'react'
import { useMeetingStore, selectMeetingStatus } from '../../store'
import { cn } from '../../utils'

export const MeetingTitle = () => {
  const title = useMeetingStore((state) => state.meeting.title)
  const status = useMeetingStore(selectMeetingStatus)
  const setMeetingTitle = useMeetingStore((state) => state.setMeetingTitle)

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)

  const canEdit = status === 'idle' || status === 'completed'

  const handleStartEdit = useCallback(() => {
    if (!canEdit) return
    setEditValue(title)
    setIsEditing(true)
  }, [canEdit, title])

  const handleSave = useCallback(() => {
    const trimmed = editValue.trim()
    if (trimmed) {
      setMeetingTitle(trimmed)
    }
    setIsEditing(false)
  }, [editValue, setMeetingTitle])

  const handleCancel = useCallback(() => {
    setEditValue(title)
    setIsEditing(false)
  }, [title])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSave()
      } else if (e.key === 'Escape') {
        handleCancel()
      }
    },
    [handleSave, handleCancel]
  )

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="text-2xl md:text-3xl font-bold bg-transparent border-b-2 border-primary-500 text-gray-100 focus:outline-none w-full max-w-md text-center"
        autoFocus
        maxLength={50}
      />
    )
  }

  return (
    <h1
      onClick={handleStartEdit}
      className={cn(
        'text-2xl md:text-3xl font-bold text-gray-100 text-center',
        canEdit && 'cursor-pointer hover:text-gray-300 transition-colors'
      )}
      title={canEdit ? 'Click to edit' : undefined}
    >
      {title}
    </h1>
  )
}

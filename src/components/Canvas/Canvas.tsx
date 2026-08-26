import { useRef } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { useOnboardingHint } from '../../hooks/useOnboardingHint'
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation'
import { useTrashZoneDrop } from '../../hooks/useTrashZoneDrop'
import { StickyNote } from '../StickyNote/StickyNote'
import { TrashZone } from '../TrashZone/TrashZone'
import { Popover } from '../Popover/Popover'
import { DeleteConfirmationModal } from '../DeleteConfirmationModal/DeleteConfirmationModal'
import styles from './Canvas.module.scss'

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const {
    notes,
    editingNoteId,
    onCreate,
    onUpdate,
    onDrag,
    onResize,
    onColorChange,
    onDelete,
    onStartEditing,
    onStopEditing,
    onBringToFront,
  } = useNotes()
  const onboardingHint = useOnboardingHint(
    notes.length > 0,
    editingNoteId !== null,
  )
  const deleteConfirmation = useDeleteConfirmation(onDelete)
  const { trashZoneRef, isTrashActive, handleDragOverTrash, handleDrop } =
    useTrashZoneDrop({
      canvasRef,
      requestDelete: deleteConfirmation.requestDelete,
    })

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    onCreate(event.clientX - rect.left, event.clientY - rect.top)
  }

  return (
    <div
      ref={canvasRef}
      className={styles.canvas}
      onDoubleClick={handleDoubleClick}
    >
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          isEditing={note.id === editingNoteId}
          onUpdate={onUpdate}
          onDrag={onDrag}
          onResize={onResize}
          onColorChange={onColorChange}
          onDragOverTrash={handleDragOverTrash}
          onDrop={handleDrop}
          onStartEditing={onStartEditing}
          onStopEditing={onStopEditing}
          onBringToFront={onBringToFront}
        />
      ))}
      <TrashZone ref={trashZoneRef} isActive={isTrashActive} />
      <Popover
        message={onboardingHint.message}
        isOpen={onboardingHint.isOpen}
      />
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onCancel={deleteConfirmation.cancelDelete}
        onConfirm={deleteConfirmation.confirmDelete}
      />
    </div>
  )
}

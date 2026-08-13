import { useRef, useState } from 'react'
import type { Size } from '../../types/note'
import { useNotes } from '../../hooks/useNotes'
import { useOnboardingHint } from '../../hooks/useOnboardingHint'
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation'
import { StickyNote } from '../StickyNote/StickyNote'
import { TrashZone } from '../TrashZone/TrashZone'
import { Popover } from '../Popover/Popover'
import { DeleteConfirmationModal } from '../DeleteConfirmationModal/DeleteConfirmationModal'
import type { Rect } from '../../utils/isPointInRect'
import type { Point } from '../../utils/clampNotePosition'
import { doRectsOverlap } from '../../utils/doRectsOverlap'
import { clampNotePosition } from '../../utils/clampNotePosition'
import { getCanvasBounds } from '../../utils/getCanvasBounds'
import styles from './Canvas.module.scss'

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const trashZoneRef = useRef<HTMLDivElement>(null)
  const [isTrashActive, setIsTrashActive] = useState(false)
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

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    onCreate(event.clientX - rect.left, event.clientY - rect.top)
  }

  function getNoteViewportRect(position: Point, size: Size): Rect | null {
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return null

    const left = canvasRect.left + position.x
    const top = canvasRect.top + position.y
    return { left, top, right: left + size.width, bottom: top + size.height }
  }

  function isTouchingTrashZone(rect: Rect | null): boolean {
    const trashRect = trashZoneRef.current?.getBoundingClientRect()
    return rect !== null && trashRect ? doRectsOverlap(rect, trashRect) : false
  }

  function isNoteTouchingTrashZone(x: number, y: number, size: Size): boolean {
    const position = clampNotePosition({ x, y }, size, getCanvasBounds())
    return isTouchingTrashZone(getNoteViewportRect(position, size))
  }

  function handleDragOverTrash(x: number, y: number, size: Size): void {
    setIsTrashActive(isNoteTouchingTrashZone(x, y, size))
  }

  function handleDrop(id: string, x: number, y: number, size: Size): void {
    setIsTrashActive(false)

    if (isNoteTouchingTrashZone(x, y, size)) {
      deleteConfirmation.requestDelete(id)
    }
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

import { useRef, useState } from 'react'
import type { Size } from '../../types/note'
import type { ConnectionEdge } from '../../types/connection'
import { useNoteLifecycle } from '../../hooks/useNoteLifecycle'
import { useOnboardingHint } from '../../hooks/useOnboardingHint'
import { useDeleteConfirmation } from '../../hooks/useDeleteConfirmation'
import { StickyNote } from '../StickyNote/StickyNote'
import { TrashZone } from '../TrashZone/TrashZone'
import { Popover } from '../Popover/Popover'
import { DeleteConfirmationModal } from '../DeleteConfirmationModal/DeleteConfirmationModal'
import { ConnectionsLayer } from '../ConnectionsLayer/ConnectionsLayer'
import type { Rect } from '../../utils/isPointInRect'
import type { Point } from '../../utils/clampNotePosition'
import { doRectsOverlap } from '../../utils/doRectsOverlap'
import { clampNotePosition } from '../../utils/clampNotePosition'
import { getCanvasBounds } from '../../utils/getCanvasBounds'
import { findNoteById } from '../../utils/findNoteById'
import { computeConnectedNotePosition } from '../../utils/computeConnectedNotePosition'
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
    onShapeChange,
    onDelete,
    onStartEditing,
    onStopEditing,
    onBringToFront,
    connections,
    activeNoteId,
    onActivateNote,
    onDeactivateNote,
    onCreateConnection,
  } = useNoteLifecycle()
  const onboardingHint = useOnboardingHint(
    notes.length > 0,
    editingNoteId !== null,
  )

  const deleteConfirmation = useDeleteConfirmation(onDelete)

  function handleCreateConnection(
    sourceId: string,
    edge: ConnectionEdge,
  ): void {
    const sourceNote = findNoteById(notes, sourceId)
    if (!sourceNote) return

    const position = computeConnectedNotePosition(sourceNote, edge)
    const targetId = onCreate(position.x, position.y)
    onCreateConnection(sourceId, targetId)
  }

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
          isActive={note.id === activeNoteId}
          onUpdate={onUpdate}
          onDrag={onDrag}
          onResize={onResize}
          onColorChange={onColorChange}
          onShapeChange={onShapeChange}
          onDragOverTrash={handleDragOverTrash}
          onDrop={handleDrop}
          onStartEditing={onStartEditing}
          onStopEditing={onStopEditing}
          onBringToFront={onBringToFront}
          onActivate={onActivateNote}
          onDeactivate={onDeactivateNote}
          onCreateConnection={handleCreateConnection}
        />
      ))}
      <ConnectionsLayer notes={notes} connections={connections} />
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

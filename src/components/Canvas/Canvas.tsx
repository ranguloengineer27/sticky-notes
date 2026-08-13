import { useRef, useState } from 'react'
import type { Size } from '../../types/note'
import { useNotes } from '../../hooks/useNotes'
import { useEmptyCanvasHint } from '../../hooks/useEmptyCanvasHint'
import { StickyNote } from '../StickyNote/StickyNote'
import { TrashZone } from '../TrashZone/TrashZone'
import { Popover } from '../Popover/Popover'
import type { Rect } from '../../utils/isPointInRect'
import type { Point } from '../../utils/clampNotePosition'
import { doRectsOverlap } from '../../utils/doRectsOverlap'
import { findNoteById } from '../../utils/findNoteById'
import { clampNotePosition } from '../../utils/clampNotePosition'
import { getCanvasBounds } from '../../utils/getCanvasBounds'
import { EMPTY_CANVAS_HINT_MESSAGE } from '../../constants'
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
  const isHintVisible = useEmptyCanvasHint(notes.length > 0)

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

  function handleDragOverTrash(id: string, x: number, y: number): void {
    const note = findNoteById(notes, id)
    if (!note) return

    const position = clampNotePosition({ x, y }, note.size, getCanvasBounds())
    const noteRect = getNoteViewportRect(position, note.size)
    const isTouchingTrash = isTouchingTrashZone(noteRect)
    setIsTrashActive(isTouchingTrash)
  }

  function handleDrop(id: string): void {
    setIsTrashActive(false)

    const note = findNoteById(notes, id)
    if (!note) return

    const noteRect = getNoteViewportRect(note.position, note.size)
    const isTouchingTrash = isTouchingTrashZone(noteRect)
    if (isTouchingTrash) {
      onDelete(id)
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
      <Popover message={EMPTY_CANVAS_HINT_MESSAGE} isOpen={isHintVisible} />
    </div>
  )
}

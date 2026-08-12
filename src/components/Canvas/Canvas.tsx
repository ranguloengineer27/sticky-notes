import { useRef, useState } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { StickyNote } from '../StickyNote/StickyNote'
import { TrashZone } from '../TrashZone/TrashZone'
import { isPointInRect } from '../../utils/isPointInRect'
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

  console.log('editingNoteId ::::', editingNoteId)

  function handleDoubleClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    onCreate(event.clientX - rect.left, event.clientY - rect.top)
  }

  function isOverTrashZone(clientX: number, clientY: number): boolean {
    const rect = trashZoneRef.current?.getBoundingClientRect()
    return rect ? isPointInRect(clientX, clientY, rect) : false
  }

  function handleDragOverTrash(clientX: number, clientY: number): void {
    setIsTrashActive(isOverTrashZone(clientX, clientY))
  }

  function handleDrop(id: string, clientX: number, clientY: number): void {
    setIsTrashActive(false)

    if (isOverTrashZone(clientX, clientY)) {
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
    </div>
  )
}

import { useRef } from 'react'
import { useNotes } from '../../hooks/useNotes'
import { StickyNote } from '../StickyNote/StickyNote'
import { TrashZone } from '../TrashZone/TrashZone'
import styles from './Canvas.module.scss'

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const {
    notes,
    editingNoteId,
    onCreate,
    onUpdate,
    onStartEditing,
    onStopEditing,
    onBringToFront,
  } = useNotes()

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
          onStartEditing={onStartEditing}
          onStopEditing={onStopEditing}
          onBringToFront={onBringToFront}
        />
      ))}
      <TrashZone isActive={false} />
    </div>
  )
}

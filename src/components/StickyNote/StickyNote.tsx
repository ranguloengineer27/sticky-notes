import type { Note, Content } from '../../types/note'
import styles from './StickyNote.module.scss'

export interface StickyNoteProps {
  note: Note
  isEditing: boolean
  onUpdate: (id: string, content: Content) => void
  onStartEditing: (id: string) => void
  onStopEditing: () => void
  onBringToFront: (id: string) => void
}

export function StickyNote({
  note,
  isEditing,
  onUpdate,
  onStartEditing,
  onStopEditing,
  onBringToFront,
}: StickyNoteProps) {
  function handlePointerDown() {
    onBringToFront(note.id)
  }

  function handleBlur(event: React.FocusEvent<HTMLDivElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      onStopEditing()
    }
  }

  return (
    <div
      className={styles.note}
      data-testid="sticky-note"
      style={{
        left: note.position.x,
        top: note.position.y,
        width: note.size.width,
        height: note.size.height,
        backgroundColor: note.color,
        zIndex: note.position.zIndex,
      }}
      onPointerDown={handlePointerDown}
      onBlur={isEditing ? handleBlur : undefined}
    >
      {isEditing ? (
        <>
          <input
            className={styles.title}
            aria-label="Note title"
            value={note.content.title}
            onChange={(event) =>
              onUpdate(note.id, { ...note.content, title: event.target.value })
            }
          />
          <textarea
            className={styles.description}
            aria-label="Note description"
            value={note.content.description}
            onChange={(event) =>
              onUpdate(note.id, {
                ...note.content,
                description: event.target.value,
              })
            }
          />
        </>
      ) : (
        <div
          className={styles.staticContent}
          onDoubleClick={() => onStartEditing(note.id)}
        >
          <h3 className={styles.titleText}>{note.content.title}</h3>
          <p className={styles.descriptionText}>{note.content.description}</p>
        </div>
      )}
    </div>
  )
}

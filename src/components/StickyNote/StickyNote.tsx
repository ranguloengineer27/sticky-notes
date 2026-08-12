import { useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import type {
  Note,
  NoteColor,
  Content,
  ResizeBounds,
  ResizeCorner,
} from '../../types/note'
import { NOTE_COLORS } from '../../constants'
import { usePointerDrag } from '../../hooks/usePointerDrag'
import { computeResizedBounds } from '../../utils/computeResizedBounds'
import styles from './StickyNote.module.scss'
import { useClickOutside } from '../../hooks/useClickOutside'

export interface StickyNoteProps {
  note: Note
  isEditing: boolean
  onUpdate: (id: string, content: Content) => void
  onDrag: (id: string, x: number, y: number) => void
  onResize: (id: string, corner: ResizeCorner, bounds: ResizeBounds) => void
  onColorChange: (id: string, color: NoteColor) => void
  onDragOverTrash: (clientX: number, clientY: number) => void
  onDrop: (id: string, clientX: number, clientY: number) => void
  onStartEditing: (id: string) => void
  onStopEditing: () => void
  onBringToFront: (id: string) => void
}

const INTERACTIVE_TAG_NAMES = ['INPUT', 'TEXTAREA', 'BUTTON']

function isInteractiveElement(target: EventTarget): boolean {
  return (
    target instanceof HTMLElement &&
    INTERACTIVE_TAG_NAMES.includes(target.tagName)
  )
}

export function StickyNote({
  note,
  isEditing,
  onUpdate,
  onDrag,
  onResize,
  onColorChange,
  onDragOverTrash,
  onDrop,
  onStartEditing,
  onStopEditing,
  onBringToFront,
}: StickyNoteProps) {
  const dragOrigin = useRef<{ x: number; y: number } | null>(null)
  const resizeOrigin = useRef<ResizeBounds | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (isEditing && textarea) {
      textarea.focus()
      const end = textarea.value.length
      textarea.setSelectionRange(end, end)
    }
  }, [isEditing])

  useClickOutside(textareaRef, () => {
    // onStartEditing(null)

    if (!isEditing) return
    console.log('Click outsite !')
    onStopEditing()
  })

  console.log('ARE WE EDITING ???', isEditing)

  const dragHandlers = usePointerDrag({
    onMove(deltaX, deltaY, event) {
      const origin = dragOrigin.current
      if (!origin) return

      onDrag(note.id, origin.x + deltaX, origin.y + deltaY)
      onDragOverTrash(event.clientX, event.clientY)
    },
    onEnd(event) {
      dragOrigin.current = null
      onDrop(note.id, event.clientX, event.clientY)
    },
  })

  function handleResizeMove(
    corner: ResizeCorner,
    deltaX: number,
    deltaY: number,
  ): void {
    const origin = resizeOrigin.current
    if (!origin) return

    onResize(
      note.id,
      corner,
      computeResizedBounds(corner, origin, deltaX, deltaY),
    )
  }

  function handleResizeEnd(): void {
    resizeOrigin.current = null
  }

  const topLeftDrag = usePointerDrag({
    onMove: (deltaX, deltaY) => handleResizeMove('top-left', deltaX, deltaY),
    onEnd: handleResizeEnd,
  })
  const topRightDrag = usePointerDrag({
    onMove: (deltaX, deltaY) => handleResizeMove('top-right', deltaX, deltaY),
    onEnd: handleResizeEnd,
  })
  const bottomLeftDrag = usePointerDrag({
    onMove: (deltaX, deltaY) => handleResizeMove('bottom-left', deltaX, deltaY),
    onEnd: handleResizeEnd,
  })
  const bottomRightDrag = usePointerDrag({
    onMove: (deltaX, deltaY) =>
      handleResizeMove('bottom-right', deltaX, deltaY),
    onEnd: handleResizeEnd,
  })

  function handlePointerDown(event: PointerEvent<HTMLDivElement>): void {
    onBringToFront(note.id)

    if (isInteractiveElement(event.target)) return

    dragOrigin.current = { x: note.position.x, y: note.position.y }
    dragHandlers.onPointerDown(event)
  }

  function captureResizeOrigin(): ResizeBounds {
    return {
      x: note.position.x,
      y: note.position.y,
      width: note.size.width,
      height: note.size.height,
    }
  }

  function handleTopLeftPointerDown(event: PointerEvent<HTMLDivElement>): void {
    event.stopPropagation()
    onBringToFront(note.id)
    resizeOrigin.current = captureResizeOrigin()
    topLeftDrag.onPointerDown(event)
  }

  function handleTopRightPointerDown(
    event: PointerEvent<HTMLDivElement>,
  ): void {
    event.stopPropagation()
    onBringToFront(note.id)
    resizeOrigin.current = captureResizeOrigin()
    topRightDrag.onPointerDown(event)
  }

  function handleBottomLeftPointerDown(
    event: PointerEvent<HTMLDivElement>,
  ): void {
    event.stopPropagation()
    onBringToFront(note.id)
    resizeOrigin.current = captureResizeOrigin()
    bottomLeftDrag.onPointerDown(event)
  }

  function handleBottomRightPointerDown(
    event: PointerEvent<HTMLDivElement>,
  ): void {
    event.stopPropagation()
    onBringToFront(note.id)
    resizeOrigin.current = captureResizeOrigin()
    bottomRightDrag.onPointerDown(event)
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
    >
      {isEditing ? (
        <>
          {/* <input
            ref={titleInputRef}
            className={styles.title}
            aria-label="Note title"
            value={note.content.title}
            onChange={(event) =>
              onUpdate(note.id, { ...note.content, title: event.target.value })
            }
          /> */}
          <textarea
            ref={textareaRef}
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
        <>
          <div
            className={styles.staticContent}
            onDoubleClick={(e) => {
              e.stopPropagation()
              console.log('LETS START EDITING !!!!')
              onStartEditing(note.id)
            }}
            //onClick={() => onStartEditing(note.id)}
          >
            {/* <h3 className={styles.titleText}>{note.content.title}</h3> */}
            <p className={styles.descriptionText}>{note.content.description}</p>
          </div>
          <button
            type="button"
            className={styles.editButton}
            aria-label="Edit note"
            onClick={() => onStartEditing(note.id)}
          >
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 20l1-4L16 5l3 3L8 19l-4 1Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className={styles.colorSwatches}>
            {NOTE_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorSwatch} ${color === note.color ? styles.colorSwatchSelected : ''}`}
                style={{ backgroundColor: color }}
                aria-label={`Set note color to ${color}`}
                aria-pressed={color === note.color}
                onClick={() => onColorChange(note.id, color)}
              />
            ))}
          </div>
        </>
      )}

      <div
        aria-hidden="true"
        data-testid="resize-handle-top-left"
        className={`${styles.resizeHandle} ${styles.resizeHandleTopLeft}`}
        onPointerDown={handleTopLeftPointerDown}
      />
      <div
        aria-hidden="true"
        data-testid="resize-handle-top-right"
        className={`${styles.resizeHandle} ${styles.resizeHandleTopRight}`}
        onPointerDown={handleTopRightPointerDown}
      />
      <div
        aria-hidden="true"
        data-testid="resize-handle-bottom-left"
        className={`${styles.resizeHandle} ${styles.resizeHandleBottomLeft}`}
        onPointerDown={handleBottomLeftPointerDown}
      />
      <div
        aria-hidden="true"
        data-testid="resize-handle-bottom-right"
        className={`${styles.resizeHandle} ${styles.resizeHandleBottomRight}`}
        onPointerDown={handleBottomRightPointerDown}
      />
    </div>
  )
}

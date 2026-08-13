import { memo, useEffect, useRef } from 'react'
import type { PointerEvent } from 'react'
import type {
  Note,
  NoteColor,
  Content,
  ResizeBounds,
  ResizeCorner,
  Size,
} from '../../types/note'
import { NOTE_COLORS, RESIZE_CORNERS } from '../../constants'
import { usePointerDrag } from '../../hooks/usePointerDrag'
import type { PointerDragHandlers } from '../../hooks/usePointerDrag'
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
  onDragOverTrash: (x: number, y: number, size: Size) => void
  onDrop: (id: string, x: number, y: number, size: Size) => void
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

export const StickyNote = memo(function StickyNote({
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
  const dragPosition = useRef<{ x: number; y: number } | null>(null)
  const resizeOrigin = useRef<ResizeBounds | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (isEditing && textarea) {
      textarea.focus()
      const caretPosition = textarea.value.length
      textarea.setSelectionRange(caretPosition, caretPosition)
    }
  }, [isEditing])

  useClickOutside(textareaRef, () => {
    if (!isEditing) return
    onStopEditing()
  })

  const dragHandlers = usePointerDrag({
    onMove(deltaX, deltaY) {
      const origin = dragOrigin.current
      if (!origin) return

      const x = origin.x + deltaX
      const y = origin.y + deltaY
      dragPosition.current = { x, y }

      onDrag(note.id, x, y)
      onDragOverTrash(x, y, note.size)
    },
    onEnd() {
      dragOrigin.current = null
      const position = dragPosition.current ?? {
        x: note.position.x,
        y: note.position.y,
      }
      dragPosition.current = null

      onDrop(note.id, position.x, position.y, note.size)
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

  const resizeDragByCorner: Record<ResizeCorner, PointerDragHandlers> = {
    'top-left': topLeftDrag,
    'top-right': topRightDrag,
    'bottom-left': bottomLeftDrag,
    'bottom-right': bottomRightDrag,
  }

  const resizeHandleClassByCorner: Record<ResizeCorner, string> = {
    'top-left': styles.resizeHandleTopLeft,
    'top-right': styles.resizeHandleTopRight,
    'bottom-left': styles.resizeHandleBottomLeft,
    'bottom-right': styles.resizeHandleBottomRight,
  }

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

  function handleResizePointerDown(
    corner: ResizeCorner,
    event: PointerEvent<HTMLDivElement>,
  ): void {
    event.stopPropagation()
    onBringToFront(note.id)
    resizeOrigin.current = captureResizeOrigin()
    resizeDragByCorner[corner].onPointerDown(event)
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
      ) : (
        <>
          <div
            className={styles.staticContent}
            onDoubleClick={(e) => {
              e.stopPropagation()
              onStartEditing(note.id)
            }}
          >
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

      {RESIZE_CORNERS.map((corner) => (
        <div
          key={corner}
          aria-hidden="true"
          data-testid={`resize-handle-${corner}`}
          className={`${styles.resizeHandle} ${resizeHandleClassByCorner[corner]}`}
          onPointerDown={(event) => handleResizePointerDown(corner, event)}
        />
      ))}
    </div>
  )
})

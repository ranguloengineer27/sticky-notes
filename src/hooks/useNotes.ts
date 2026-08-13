import { useEffect, useState } from 'react'
import type {
  Note,
  NoteColor,
  Content,
  ResizeBounds,
  ResizeCorner,
} from '../types/note'
import { createNote, updateNote, deleteNote } from '../services/notesService'
import { clampNoteSize } from '../utils/clampNoteSize'
import { clampNotePosition } from '../utils/clampNotePosition'
import { clampNotesToCanvas } from '../utils/clampNotesToCanvas'
import { findNoteById } from '../utils/findNoteById'
import { getCanvasBounds } from '../utils/getCanvasBounds'
import { loadInitialNotes } from '../utils/loadInitialNotes'
import { getNextZIndex } from '../utils/getNextZIndex'
import { useAutoSave } from './useAutoSave'
import { DEFAULT_NOTE_WIDTH, DEFAULT_NOTE_HEIGHT } from '../constants'

const LEFT_RESIZE_CORNERS: ResizeCorner[] = ['top-left', 'bottom-left']
const TOP_RESIZE_CORNERS: ResizeCorner[] = ['top-left', 'top-right']

export interface UseNotesResult {
  notes: Note[]
  editingNoteId: string | null
  onCreate: (x: number, y: number) => void
  onUpdate: (id: string, content: Content) => void
  onColorChange: (id: string, color: NoteColor) => void
  onDrag: (id: string, x: number, y: number) => void
  onResize: (id: string, corner: ResizeCorner, bounds: ResizeBounds) => void
  onDelete: (id: string) => void
  onBringToFront: (id: string) => void
  onStartEditing: (id: string) => void
  onStopEditing: () => void
}

export function useNotes(): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>(loadInitialNotes)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

  useAutoSave(notes)

  useEffect(() => {
    function handleWindowResize(): void {
      const canvasBounds = getCanvasBounds()
      setNotes((currentNotes) => clampNotesToCanvas(currentNotes, canvasBounds))
    }

    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  function onCreate(x: number, y: number): void {
    const position = clampNotePosition(
      { x, y },
      { width: DEFAULT_NOTE_WIDTH, height: DEFAULT_NOTE_HEIGHT },
      getCanvasBounds(),
    )
    const id = crypto.randomUUID()

    setNotes(
      (currentNotes) =>
        createNote(currentNotes, id, position.x, position.y).notes,
    )
    setEditingNoteId(id)
  }

  function onUpdate(id: string, content: Content): void {
    setNotes((currentNotes) => updateNote(currentNotes, id, { content }))
  }

  function onColorChange(id: string, color: NoteColor): void {
    setNotes((currentNotes) => updateNote(currentNotes, id, { color }))
  }

  function onDrag(id: string, x: number, y: number): void {
    setNotes((currentNotes) => {
      const note = findNoteById(currentNotes, id)
      if (!note) return currentNotes

      const position = clampNotePosition({ x, y }, note.size, getCanvasBounds())

      return updateNote(currentNotes, id, {
        position: { ...position, zIndex: note.position.zIndex },
      })
    })
  }

  function onResize(
    id: string,
    corner: ResizeCorner,
    bounds: ResizeBounds,
  ): void {
    setNotes((currentNotes) => {
      const note = findNoteById(currentNotes, id)
      if (!note) return currentNotes

      const canvasBounds = getCanvasBounds()
      const minClampedSize = clampNoteSize({
        width: bounds.width,
        height: bounds.height,
      })
      const size = {
        width: Math.min(minClampedSize.width, canvasBounds.width),
        height: Math.min(minClampedSize.height, canvasBounds.height),
      }

      const isLeftCorner = LEFT_RESIZE_CORNERS.includes(corner)
      const isTopCorner = TOP_RESIZE_CORNERS.includes(corner)
      const x = isLeftCorner ? bounds.x + bounds.width - size.width : bounds.x
      const y = isTopCorner ? bounds.y + bounds.height - size.height : bounds.y

      const position = clampNotePosition({ x, y }, size, canvasBounds)

      return updateNote(currentNotes, id, {
        position: { ...position, zIndex: note.position.zIndex },
        size,
      })
    })
  }

  function onDelete(id: string): void {
    setNotes((currentNotes) => deleteNote(currentNotes, id))
    setEditingNoteId((currentEditingNoteId) =>
      currentEditingNoteId === id ? null : currentEditingNoteId,
    )
  }

  function onBringToFront(id: string): void {
    setNotes((currentNotes) => {
      const note = findNoteById(currentNotes, id)
      if (!note) return currentNotes

      const zIndex = getNextZIndex(currentNotes)
      return updateNote(currentNotes, id, {
        position: { ...note.position, zIndex },
      })
    })
  }

  function onStartEditing(id: string): void {
    setEditingNoteId(id)
  }

  function onStopEditing(): void {
    setEditingNoteId(null)
  }

  return {
    notes,
    editingNoteId,
    onCreate,
    onUpdate,
    onColorChange,
    onDrag,
    onResize,
    onDelete,
    onBringToFront,
    onStartEditing,
    onStopEditing,
  }
}

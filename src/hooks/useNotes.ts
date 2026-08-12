import { useState } from 'react'
import type {
  Note,
  NoteColor,
  Content,
  ResizeBounds,
  ResizeCorner,
} from '../types/note'
import {
  loadNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../services/notesService'
import { clampNoteSize } from '../utils/clampNoteSize'
import { getNextZIndex } from '../utils/getNextZIndex'
import { useAutoSave } from './useAutoSave'

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

function loadInitialNotes(): Note[] {
  try {
    return loadNotes()
  } catch (error) {
    console.error(error)
    return []
  }
}

export function useNotes(): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>(loadInitialNotes)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

  useAutoSave(notes)

  function findNoteById(id: string): Note | undefined {
    return notes.find((note) => note.id === id)
  }

  function onCreate(x: number, y: number): void {
    const result = createNote(notes, x, y)
    setNotes(result.notes)
    setEditingNoteId(result.note.id)
  }

  function onUpdate(id: string, content: Content): void {
    setNotes(updateNote(notes, id, { content }))
  }

  function onColorChange(id: string, color: NoteColor): void {
    setNotes(updateNote(notes, id, { color }))
  }

  function onDrag(id: string, x: number, y: number): void {
    const note = findNoteById(id)
    if (!note) return

    setNotes(
      updateNote(notes, id, {
        position: { x, y, zIndex: note.position.zIndex },
      }),
    )
  }

  function onResize(
    id: string,
    corner: ResizeCorner,
    bounds: ResizeBounds,
  ): void {
    const note = findNoteById(id)
    if (!note) return

    const size = clampNoteSize({ width: bounds.width, height: bounds.height })

    const isLeftCorner = LEFT_RESIZE_CORNERS.includes(corner)
    const isTopCorner = TOP_RESIZE_CORNERS.includes(corner)
    const x = isLeftCorner ? bounds.x + bounds.width - size.width : bounds.x
    const y = isTopCorner ? bounds.y + bounds.height - size.height : bounds.y

    setNotes(
      updateNote(notes, id, {
        position: { x, y, zIndex: note.position.zIndex },
        size,
      }),
    )
  }

  function onDelete(id: string): void {
    setNotes(deleteNote(notes, id))
    if (editingNoteId === id) {
      setEditingNoteId(null)
    }
  }

  function onBringToFront(id: string): void {
    const note = findNoteById(id)
    if (!note) return

    const zIndex = getNextZIndex(notes)
    setNotes(updateNote(notes, id, { position: { ...note.position, zIndex } }))
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

import { useEffect, useState } from 'react'
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
import { clampNotePosition } from '../utils/clampNotePosition'
import type { CanvasBounds } from '../utils/clampNotePosition'
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

function getCanvasBounds(): CanvasBounds {
  return { width: window.innerWidth, height: window.innerHeight }
}

function clampNoteToCanvas(note: Note, canvasBounds: CanvasBounds): Note {
  const position = clampNotePosition(note.position, note.size, canvasBounds)
  return { ...note, position: { ...position, zIndex: note.position.zIndex } }
}

function loadInitialNotes(): Note[] {
  try {
    const canvasBounds = getCanvasBounds()
    return loadNotes().map((note) => clampNoteToCanvas(note, canvasBounds))
  } catch (error) {
    console.error(error)
    return []
  }
}

export function useNotes(): UseNotesResult {
  const [notes, setNotes] = useState<Note[]>(loadInitialNotes)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)

  useAutoSave(notes)

  useEffect(() => {
    function clampNotesToCanvas(): void {
      const canvasBounds = getCanvasBounds()

      setNotes((currentNotes) => {
        let hasOffCanvasNotes = false
        const clampedNotes = currentNotes.map((note) => {
          const clampedNote = clampNoteToCanvas(note, canvasBounds)
          if (
            clampedNote.position.x !== note.position.x ||
            clampedNote.position.y !== note.position.y
          ) {
            hasOffCanvasNotes = true
          }
          return clampedNote
        })

        return hasOffCanvasNotes ? clampedNotes : currentNotes
      })
    }

    window.addEventListener('resize', clampNotesToCanvas)
    return () => window.removeEventListener('resize', clampNotesToCanvas)
  }, [])

  function findNoteById(id: string): Note | undefined {
    return notes.find((note) => note.id === id)
  }

  function onCreate(x: number, y: number): void {
    const position = clampNotePosition(
      { x, y },
      { width: DEFAULT_NOTE_WIDTH, height: DEFAULT_NOTE_HEIGHT },
      getCanvasBounds(),
    )
    const result = createNote(notes, position.x, position.y)
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

    const position = clampNotePosition({ x, y }, note.size, getCanvasBounds())

    setNotes(
      updateNote(notes, id, {
        position: { ...position, zIndex: note.position.zIndex },
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

    setNotes(
      updateNote(notes, id, {
        position: { ...position, zIndex: note.position.zIndex },
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

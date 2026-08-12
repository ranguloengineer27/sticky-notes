import type { Note, NoteChanges, CreateNoteResult } from '../types/note'
import {
  STORAGE_KEY,
  DEFAULT_NOTE_WIDTH,
  DEFAULT_NOTE_HEIGHT,
  DEFAULT_NOTE_COLOR,
} from '../constants'

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}

export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === null ? [] : (JSON.parse(raw) as Note[])
  } catch (error) {
    throw new Error(
      `Failed to load notes from localStorage: ${getErrorMessage(error)}`,
    )
  }
}

export function saveNotes(notes: Note[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    throw new Error(
      `Failed to save ${notes.length} note(s) to localStorage: ${getErrorMessage(error)}`,
    )
  }
}

export function createNote(
  notes: Note[],
  x: number,
  y: number,
): CreateNoteResult {
  const zIndex =
    notes.reduce((max, note) => Math.max(max, note.position.zIndex), 0) + 1
  const note: Note = {
    id: crypto.randomUUID(),
    position: { x, y, zIndex },
    size: { width: DEFAULT_NOTE_WIDTH, height: DEFAULT_NOTE_HEIGHT },
    color: DEFAULT_NOTE_COLOR,
    content: { title: '', description: '' },
  }
  return { notes: [...notes, note], note }
}

export function updateNote(
  notes: Note[],
  id: string,
  changes: NoteChanges,
): Note[] {
  return notes.map((note) => (note.id === id ? { ...note, ...changes } : note))
}

export function deleteNote(notes: Note[], id: string): Note[] {
  return notes.filter((note) => note.id !== id)
}

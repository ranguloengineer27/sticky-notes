import type { Note } from '../types/note'

export function findNoteById(notes: Note[], id: string): Note | undefined {
  return notes.find((note) => note.id === id)
}

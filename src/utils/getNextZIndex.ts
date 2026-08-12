import type { Note } from '../types/note'

export function getNextZIndex(notes: Note[]): number {
  return notes.reduce((max, note) => Math.max(max, note.position.zIndex), 0) + 1
}

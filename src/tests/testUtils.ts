import type { Note } from '../types/note'
import { DEFAULT_NOTE_COLOR } from '../constants'

export function buildNote(overrides: Partial<Note> = {}): Note {
  return {
    id: 'note-1',
    position: { x: 10, y: 20, zIndex: 1 },
    size: { width: 200, height: 180 },
    color: DEFAULT_NOTE_COLOR,
    content: { title: 'Title', description: 'Description' },
    ...overrides,
  }
}

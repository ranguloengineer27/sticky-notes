import type { Note } from '../types/note'
import type { CanvasBounds } from './clampNotePosition'
import { clampNotePosition } from './clampNotePosition'

export function clampNoteToCanvas(
  note: Note,
  canvasBounds: CanvasBounds,
): Note {
  const position = clampNotePosition(note.position, note.size, canvasBounds)
  return { ...note, position: { ...position, zIndex: note.position.zIndex } }
}

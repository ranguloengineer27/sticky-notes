import type { Note } from '../types/note'
import type { CanvasBounds } from './clampNotePosition'
import { clampNoteToCanvas } from './clampNoteToCanvas'

export function clampNotesToCanvas(
  notes: Note[],
  canvasBounds: CanvasBounds,
): Note[] {
  let hasOffCanvasNotes = false
  const clampedNotes = notes.map((note) => {
    const clampedNote = clampNoteToCanvas(note, canvasBounds)
    if (
      clampedNote.position.x !== note.position.x ||
      clampedNote.position.y !== note.position.y
    ) {
      hasOffCanvasNotes = true
    }
    return clampedNote
  })

  return hasOffCanvasNotes ? clampedNotes : notes
}

import type { Note } from '../types/note'
import { loadNotes } from '../services/notesService'
import { clampNoteToCanvas } from './clampNoteToCanvas'
import { getCanvasBounds } from './getCanvasBounds'

export function loadInitialNotes(): Note[] {
  try {
    const canvasBounds = getCanvasBounds()
    return loadNotes().map((note) => clampNoteToCanvas(note, canvasBounds))
  } catch (error) {
    console.error(error)
    return []
  }
}

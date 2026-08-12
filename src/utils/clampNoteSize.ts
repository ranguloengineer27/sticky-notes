import type { Size } from '../types/note'
import { MIN_NOTE_WIDTH, MIN_NOTE_HEIGHT } from '../constants'

export function clampNoteSize(size: Size): Size {
  return {
    width: Math.max(size.width, MIN_NOTE_WIDTH),
    height: Math.max(size.height, MIN_NOTE_HEIGHT),
  }
}

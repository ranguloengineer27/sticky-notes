import type { Note } from '../types/note'
import type { ConnectionEdge } from '../types/connection'
import type { Point } from './clampNotePosition'
import {
  DEFAULT_NOTE_WIDTH,
  DEFAULT_NOTE_HEIGHT,
  CONNECTION_NEW_NOTE_GAP_PX,
} from '../constants'

export function computeConnectedNotePosition(
  sourceNote: Note,
  edge: ConnectionEdge,
): Point {
  const { position, size } = sourceNote

  switch (edge) {
    case 'top':
      return {
        x: position.x + size.width / 2 - DEFAULT_NOTE_WIDTH / 2,
        y: position.y - CONNECTION_NEW_NOTE_GAP_PX - DEFAULT_NOTE_HEIGHT,
      }
    case 'bottom':
      return {
        x: position.x + size.width / 2 - DEFAULT_NOTE_WIDTH / 2,
        y: position.y + size.height + CONNECTION_NEW_NOTE_GAP_PX,
      }
    case 'left':
      return {
        x: position.x - CONNECTION_NEW_NOTE_GAP_PX - DEFAULT_NOTE_WIDTH,
        y: position.y + size.height / 2 - DEFAULT_NOTE_HEIGHT / 2,
      }
    case 'right':
      return {
        x: position.x + size.width + CONNECTION_NEW_NOTE_GAP_PX,
        y: position.y + size.height / 2 - DEFAULT_NOTE_HEIGHT / 2,
      }
  }
}

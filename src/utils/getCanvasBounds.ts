import type { CanvasBounds } from './clampNotePosition'

export function getCanvasBounds(): CanvasBounds {
  return { width: window.innerWidth, height: window.innerHeight }
}

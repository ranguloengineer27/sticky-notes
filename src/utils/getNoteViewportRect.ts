import type { Size } from '../types/note'
import type { Rect } from './isPointInRect'
import type { Point } from './clampNotePosition'

export function getNoteViewportRect(
  canvasRect: Rect,
  position: Point,
  size: Size,
): Rect {
  const left = canvasRect.left + position.x
  const top = canvasRect.top + position.y
  return { left, top, right: left + size.width, bottom: top + size.height }
}

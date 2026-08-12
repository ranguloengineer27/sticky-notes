import type { Size } from '../types/note'

export interface CanvasBounds {
  width: number
  height: number
}

export interface Point {
  x: number
  y: number
}

export function clampNotePosition(
  point: Point,
  size: Size,
  canvasBounds: CanvasBounds,
): Point {
  const maxX = Math.max(0, canvasBounds.width - size.width)
  const maxY = Math.max(0, canvasBounds.height - size.height)

  return {
    x: Math.min(Math.max(point.x, 0), maxX),
    y: Math.min(Math.max(point.y, 0), maxY),
  }
}

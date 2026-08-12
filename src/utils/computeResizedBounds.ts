import type { ResizeBounds, ResizeCorner } from '../types/note'

export function computeResizedBounds(
  corner: ResizeCorner,
  origin: ResizeBounds,
  deltaX: number,
  deltaY: number,
): ResizeBounds {
  switch (corner) {
    case 'bottom-right':
      return {
        x: origin.x,
        y: origin.y,
        width: origin.width + deltaX,
        height: origin.height + deltaY,
      }
    case 'bottom-left':
      return {
        x: origin.x + deltaX,
        y: origin.y,
        width: origin.width - deltaX,
        height: origin.height + deltaY,
      }
    case 'top-right':
      return {
        x: origin.x,
        y: origin.y + deltaY,
        width: origin.width + deltaX,
        height: origin.height - deltaY,
      }
    case 'top-left':
      return {
        x: origin.x + deltaX,
        y: origin.y + deltaY,
        width: origin.width - deltaX,
        height: origin.height - deltaY,
      }
  }
}

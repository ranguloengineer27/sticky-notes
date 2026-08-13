import type { Rect } from './isPointInRect'

export function doRectsOverlap(a: Rect, b: Rect): boolean {
  const overlapsHorizontally = a.left <= b.right && a.right >= b.left
  const overlapsVertically = a.top <= b.bottom && a.bottom >= b.top

  return overlapsHorizontally && overlapsVertically
}
